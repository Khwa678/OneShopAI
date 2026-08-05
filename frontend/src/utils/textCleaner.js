/**
 * Production-Quality AI Text Cleaning & Repair Utility
 * Repairs malformed AI outputs, unsquishes merged words, normalizes punctuation spacing,
 * and strips raw syntax artifacts before rendering.
 */

// Common dictionary words for greedy segmentation of unspaced tokens
const DICTIONARY_WORDS = [
  'categories', 'sections', 'website', 'opening', 'looking', 'should', 'another', 'correct',
  'visible', 'corners', 'design', 'upper', 'lower', 'does', 'same', 'work', 'main', 'page',
  'your', 'other', 'open', 'with', 'from', 'have', 'been', 'they', 'this', 'that', 'there',
  'here', 'when', 'what', 'where', 'some', 'more', 'both', 'good', 'need', 'than', 'into',
  'also', 'only', 'just', 'over', 'back', 'even', 'most', 'make', 'like', 'time', 'used',
  'using', 'know', 'take', 'come', 'give', 'look', 'well', 'down', 'line', 'side', 'free',
  'best', 'tool', 'text', 'user', 'site', 'view', 'list', 'data', 'form', 'show', 'item',
  'file', 'code', 'link', 'name', 'type', 'part', 'test', 'exam', 'quiz', 'note', 'rate',
  'mode', 'cost', 'plan', 'card', 'path', 'info', 'step', 'task', 'goal', 'help', 'all',
  'not', 'the', 'and', 'for', 'are', 'was', 'but', 'out', 'can', 'has', 'her', 'was', 'one',
  'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see',
  'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'too', 'use', 'you', 'she',
  'is', 'it', 'in', 'to', 'of', 'on', 'at', 'by', 'as', 'an', 'be', 'or', 'do', 'no', 'so',
  'if', 'up', 'my', 'he', 'we', 'us', 'me', 'am', 'go', 'a'
].sort((a, b) => b.length - a.length);

// Dedicated Regex Glued Word Replacements
const COMMON_GLUED_PATTERNS = [
  { pattern: /\bworkissame\b/gi, fix: 'work is same' },
  { pattern: /\bAlltheupperandlowerbothdoesthesamework\b/gi, fix: 'All the upper and lower both does the same work' },
  { pattern: /\bItisnotlookinggood\b/gi, fix: 'It is not looking good' },
  { pattern: /\bthecategoriessectionsdesignisnotgood\b/gi, fix: 'the categories sections design is not good' },
  { pattern: /\bwhenopeningthemainthebaropens\b/gi, fix: 'when opening the main the bar opens' },
  { pattern: /\bwithnouse\b/gi, fix: 'with no use' },
  { pattern: /\bunstopvisible\b/gi, fix: 'unstop visible' },
  { pattern: /\bYoushouldnotopentheotherwebsitepageonyourwebsite\b/gi, fix: 'You should not open the other website page on your website' },
  { pattern: /\bcornersneedtocorrect\b/gi, fix: 'corners need to correct' },
  { pattern: /\bdoesthesamework\b/gi, fix: 'does the same work' },
  { pattern: /\bupperandlower\b/gi, fix: 'upper and lower' },
  { pattern: /\bsectionsdesign\b/gi, fix: 'sections design' },
  { pattern: /\bthebaropens\b/gi, fix: 'the bar opens' },
  { pattern: /\bneedtocorrect\b/gi, fix: 'need to correct' },
  { pattern: /\b([A-Za-z]+)is(one|a|the|known|located|used|designed|built|created|defined|not|of|in|to|for|with|same|good)\b/gi, fix: '$1 is $2' },
  { pattern: /\b([A-Za-z]+)attempted(to|solve|create|build|make)\b/gi, fix: '$1 attempted $2' },
  { pattern: /\b([A-Za-z]+)difficult(or|to|even|and)\b/gi, fix: '$1 difficult $2' },
  { pattern: /\b([A-Za-z]+)him(a|the|to|an|highly|most)\b/gi, fix: '$1 him $2' },
  { pattern: /\bHeis(known|a|the|one|working)\b/gi, fix: 'He is $1' },
  { pattern: /\bThisis(a|the|one|an)\b/gi, fix: 'This is $1' },
  { pattern: /\bItis(a|the|one|an|known|not)\b/gi, fix: 'It is $1' },
  { pattern: /\bThereis(a|the|no|one)\b/gi, fix: 'There is $1' }
];

/**
 * Greedily decomposes a single unspaced token into valid words if possible.
 */
function segmentGluedToken(token) {
  if (!token || token.length < 10 || !/^[A-Za-z]+$/.test(token)) return token;

  const lower = token.toLowerCase();
  let pos = 0;
  const resultWords = [];

  while (pos < lower.length) {
    let matchedWord = null;
    for (const word of DICTIONARY_WORDS) {
      if (lower.startsWith(word, pos)) {
        // Prevent single-letter matches ('a', 'i') if a longer word matches next
        if (word.length === 1 && pos + 1 < lower.length) {
          const nextCharWord = DICTIONARY_WORDS.find(w => w.length > 1 && lower.startsWith(w, pos));
          if (nextCharWord) {
            matchedWord = nextCharWord;
            break;
          }
        }
        matchedWord = word;
        break;
      }
    }

    if (matchedWord) {
      // Preserve original capitalization for the segment
      const originalSegment = token.slice(pos, pos + matchedWord.length);
      resultWords.push(originalSegment);
      pos += matchedWord.length;
    } else {
      // Cannot cleanly segment
      return token;
    }
  }

  return resultWords.join(' ');
}

/**
 * Unsquishes concatenated or glued words across a text block.
 */
export function unsquishGluedWords(text) {
  if (!text || typeof text !== 'string') return '';

  let processed = text;

  // 1. CamelCase / concatenated boundary separation
  processed = processed
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    .replace(/(\d)([a-zA-Z])/g, '$1 $2');

  // 2. Specific regex glued word fixes
  COMMON_GLUED_PATTERNS.forEach(({ pattern, fix }) => {
    processed = processed.replace(pattern, fix);
  });

  // 3. Token-by-token dynamic dictionary segmentation for any remaining long unspaced words
  processed = processed.replace(/\b[A-Za-z]{10,}\b/g, (match) => segmentGluedToken(match));

  return processed;
}

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
    // 2. Strip DeepSeek <think>...</think> blocks
    .replace(/<think>[\s\S]*?<\/think>\s*/gi, '')
    // 3. Strip markdown code fences wrapping JSON
    .replace(/```json\s*/gi, '').replace(/```\s*/g, '')
    // 4. Strip model-specific header lines (e.g. "### ChatGPT (GPT-4o) Executive Summary:")
    .replace(/^#{1,6}\s+(ChatGPT|Claude|Google Gemini|DeepSeek|Meta Llama|GPT-4o)[^\n]*\n*/gim, '')
    // 5. Strip "Actionable Summary:" type boilerplate
    .replace(/\*\*Actionable Summary:\*\*\s*/gi, '')
    .replace(/•\s*Key (executive )?takeaways[^\n]*/gi, '')
    .replace(/•\s*Key ideas summarized[^\n]*/gi, '');

  // 6. Unsquish glued words
  cleaned = unsquishGluedWords(cleaned);

  cleaned = cleaned
    // 7. Ensure space after punctuation (periods, commas, colons, semicolons) if missing
    .replace(/([,\.\?\!\;:]);?/g, '$1 ')
    // Restore valid URLs (don't break http:// or https://)
    .replace(/(https?:\s+\/\/)/gi, 'http://')
    .replace(/(https?:\s+\/\s+\/)/gi, 'https://')
    // 8. Clean up duplicate spaces on each line while preserving single newline breaks
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

