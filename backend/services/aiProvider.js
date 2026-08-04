/**
 * Production-Quality AI Provider Abstraction Layer
 * Supports Local Ollama with Auto-Detection & Fallback to Hugging Face Inference API
 */

const axios = require('axios');

class AIProvider {
  constructor(name) {
    if (new.target === AIProvider) {
      throw new Error('Cannot instantiate abstract class AIProvider directly.');
    }
    this.name = name;
  }

  async isAvailable() {
    throw new Error('Method isAvailable() must be implemented.');
  }

  async generateText({ prompt, model, systemPrompt, maxTokens, temperature }) {
    throw new Error('Method generateText() must be implemented.');
  }
}

class OllamaProvider extends AIProvider {
  constructor(baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434') {
    super('ollama');
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  async isAvailable() {
    try {
      const response = await axios.get(`${this.baseUrl}/api/tags`, { timeout: 1500 });
      return response.status === 200;
    } catch (_) {
      return false;
    }
  }

  async generateText({ prompt, model = 'llama3.1', systemPrompt = '', maxTokens = 1024, temperature = 0.7 }) {
    const response = await axios.post(
      `${this.baseUrl}/api/generate`,
      {
        model,
        prompt: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt,
        stream: false,
        options: {
          num_predict: maxTokens,
          temperature
        }
      },
      { timeout: 45000 }
    );

    if (response.data && response.data.response) {
      return {
        text: response.data.response.trim(),
        provider: this.name,
        model
      };
    }
    throw new Error('Ollama returned empty response.');
  }
}

class HuggingFaceProvider extends AIProvider {
  constructor(apiKey = process.env.HUGGINGFACE_API_KEY) {
    super('huggingface');
    this.apiKey = apiKey;
    this.defaultModel = 'meta-llama/Llama-3.1-8B-Instruct';
  }

  async isAvailable() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async generateText({ prompt, model, systemPrompt = '', maxTokens = 1024, temperature = 0.7 }) {
    if (!this.apiKey) {
      throw new Error('HUGGINGFACE_API_KEY is not configured.');
    }

    const targetModel = model || this.defaultModel;
    const fullPrompt = systemPrompt ? `System: ${systemPrompt}\nUser: ${prompt}\nAssistant:` : prompt;

    // Use HF Router / Inference API endpoint
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${targetModel}`,
      {
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: maxTokens,
          temperature,
          return_full_text: false
        }
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 45000
      }
    );

    if (Array.isArray(response.data) && response.data[0]?.generated_text) {
      return {
        text: response.data[0].generated_text.trim(),
        provider: this.name,
        model: targetModel
      };
    } else if (response.data?.generated_text) {
      return {
        text: response.data.generated_text.trim(),
        provider: this.name,
        model: targetModel
      };
    }

    throw new Error('Hugging Face API returned invalid payload structure.');
  }
}

class ProviderFactory {
  constructor() {
    this.ollama = new OllamaProvider();
    this.huggingFace = new HuggingFaceProvider();
    this.cachedHealth = { isOllamaUp: false, lastCheck: 0 };
    this.healthCacheTtlMs = 10000; // 10 seconds health check caching
  }

  async detectPrimaryProvider() {
    const now = Date.now();
    if (now - this.cachedHealth.lastCheck < this.healthCacheTtlMs) {
      return this.cachedHealth.isOllamaUp ? this.ollama : this.huggingFace;
    }

    const ollamaUp = await this.ollama.isAvailable();
    this.cachedHealth = { isOllamaUp: ollamaUp, lastCheck: now };

    return ollamaUp ? this.ollama : this.huggingFace;
  }

  async executeWithFallback(options) {
    const primary = await this.detectPrimaryProvider();
    const fallback = primary.name === 'ollama' ? this.huggingFace : this.ollama;

    try {
      return await primary.generateText(options);
    } catch (primaryErr) {
      console.warn(`[AIProviderFactory] Primary provider '${primary.name}' failed: ${primaryErr.message}. Attempting fallback to '${fallback.name}'...`);
      
      const fallbackAvailable = await fallback.isAvailable();
      if (!fallbackAvailable) {
        throw new Error(`Primary AI provider '${primary.name}' failed (${primaryErr.message}) and fallback provider '${fallback.name}' is unavailable.`);
      }

      try {
        return await fallback.generateText(options);
      } catch (fallbackErr) {
        throw new Error(`All AI providers failed. Primary ('${primary.name}'): ${primaryErr.message} | Fallback ('${fallback.name}'): ${fallbackErr.message}`);
      }
    }
  }
}

const factoryInstance = new ProviderFactory();

module.exports = {
  AIProvider,
  OllamaProvider,
  HuggingFaceProvider,
  ProviderFactory,
  aiProviderService: factoryInstance
};
