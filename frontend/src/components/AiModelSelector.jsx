import React from 'react';
import { Cpu, Sparkles, Bot, Brain, Globe } from 'lucide-react';

export const AI_MODELS = [
  {
    id: 'gpt-4o',
    name: 'ChatGPT (GPT-4o)',
    provider: 'OpenAI',
    badge: 'Popular',
    color: '#10a37f',
    bg: '#ecfdf5',
    icon: Bot,
    description: 'OpenAI premier multimodal LLM'
  },
  {
    id: 'claude-3-5',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    badge: 'Deep Analysis',
    color: '#d97706',
    bg: '#fffbeb',
    icon: Brain,
    description: 'Anthropic superior prose & logic'
  },
  {
    id: 'gemini-2',
    name: 'Google Gemini 2.0',
    provider: 'Google AI',
    badge: 'High Speed',
    color: '#0284c7',
    bg: '#f0f9ff',
    icon: Sparkles,
    description: 'Google multi-modal neural model'
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    badge: 'Reasoning',
    color: '#4f46e5',
    bg: '#eef2ff',
    icon: Cpu,
    description: 'DeepSeek high-speed reasoning engine'
  },
  {
    id: 'llama-3',
    name: 'Meta Llama 3.3',
    provider: 'Meta AI',
    badge: 'Open Weight',
    color: '#9333ea',
    bg: '#faf5ff',
    icon: Globe,
    description: 'Meta open source flagship AI'
  }
];

export default function AiModelSelector({ selectedModel, onSelectModel, compact = false }) {
  return (
    <div style={{
      marginBottom: '14px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '8px'
    }}>
      {AI_MODELS.map((model) => {
        const isSelected = selectedModel === model.id;
        const Icon = model.icon;
        return (
          <button
            key={model.id}
            type="button"
            onClick={() => onSelectModel(model.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 10px',
              borderRadius: '8px',
              border: isSelected ? `1.5px solid ${model.color}` : '1px solid var(--border-color, #cbd5e1)',
              background: isSelected ? model.bg : 'var(--card-bg, #ffffff)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              background: isSelected ? model.color : 'var(--border-color, #f1f5f9)',
              color: isSelected ? '#ffffff' : model.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Icon size={14} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ 
                fontSize: '12px', 
                fontWeight: isSelected ? 700 : 600, 
                color: isSelected ? '#0f172a' : 'var(--text-dark, #334155)',
                whiteSpace: 'nowrap', 
                textOverflow: 'ellipsis', 
                overflow: 'hidden' 
              }}>
                {model.name}
              </div>
              <div style={{ 
                fontSize: '10.5px', 
                fontWeight: 500,
                color: isSelected ? model.color : 'var(--text-muted, #64748b)',
                whiteSpace: 'nowrap', 
                textOverflow: 'ellipsis', 
                overflow: 'hidden' 
              }}>
                {model.provider}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
