/**
 * Production-Quality AI Text Cleaning & Repair Utility
 * Repairs malformed AI outputs, unsquishes merged words, normalizes punctuation spacing,
 * and strips raw syntax artifacts before rendering.
 */

// Common English words frequently merged by OCR/AI glitches
const COMMON_GLUED_WORDS = [
  { pattern: /\b([A-Za-z]+)is(one|a|the|known|located|used|designed|built|created|defined|not|of|in|to|for|with)\b/gi, fix: '$1 is $2' },
  { pattern: /\b([A-Za-z]+)attempted(to|solve|create|build|make)\b/gi, fix: '$1 attempted $2' },
  { pattern: /\b([A-Za-z]+)difficult(or|to|even|and)\b/gi, fix: '$1 difficult $2' },
  { pattern: /\b([A-Za-z]+)him(a|the|to|an|highly|most)\b/gi, fix: '$1 him $2' },
  { pattern: /\bHeis(known|a|the|one|working)\b/gi, fix: 'He is $1' },
  { pattern: /\bThisis(a|the|one|an)\b/gi, fix: 'This is $1' },
  { pattern: /\bItis(a|the|one|an|known)\b/gi, fix: 'It is $1' },
  { pattern: /\bThereis(a|the|no|one)\b/gi, fix: 'There is $1' }
];

/**
 * Repairs merged words, normalizes whitespace, and formats text cleanly.
 * @param {string} rawText 
 * @returns {string} Cleaned, readable text
 */
export function cleanAiMarkdown(rawText) {
  if (!rawText || typeof rawText !== 'string') return '';

  let cleaned = rawText
    // 1. Remove non-printable glyphs and null replacement chars
    .replace(/[\uFFFC\uFFFD\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ' ')
    // 2. Strip leading Markdown header symbols inside short takeaways
    .replace(/^#{1,6}\s+/g, '')
    // 3. Fix common glued words
    .replace(/([a-z])([A-Z])/g, '$1 $2') // CamelCase / glued word separation (e.g. "ElonMusk" -> "Elon Musk")
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    .replace(/(\d)([a-zA-Z])/g, '$1 $2');

  // Apply explicit glued word patterns
  COMMON_GLUED_WORDS.forEach(({ pattern, fix }) => {
    cleaned = cleaned.replace(pattern, fix);
  });

  cleaned = cleaned
    // 4. Ensure space after punctuation (periods, commas, colons, semicolons) if missing
    .replace(/([,\.\?\!\;:]);?/g, '$1 ')
    // Restore valid URLs (don't break http:// or https://)
    .replace(/(https?:\s+\/\/)/gi, 'http://')
    .replace(/(https?:\s+\/\s+\/)/gi, 'https://')
    // 5. Clean up duplicate spaces on each line while preserving single newline breaks
    .split('\n')
    .map(line => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return cleaned;
}

/**
 * Automatically bolds key names, numbers, percentages, and dates in takeaway text
 * @param {string} text 
 * @returns {string} Text with enhanced markdown bolding
 */
export function autoHighlightKeyTerms(text) {
  if (!text || typeof text !== 'string') return '';

  let processed = cleanAiMarkdown(text);

  // Bold prominent dates, percentages, and metrics if not already bolded
  processed = processed.replace(/(?<!\*\*)(\b\d{1,3}%\b|\b\d{4}\b|\$\d+[\d,]*|\b\d+\s*years?\b)(?!\*\*)/gi, '**$1**');

  return processed;
}
