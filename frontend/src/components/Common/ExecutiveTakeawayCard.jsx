import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cleanAiMarkdown, autoHighlightKeyTerms } from '../../utils/textCleaner';

export default function ExecutiveTakeawayCard({ pointIndex = 1, rawText = '', modelBg = '#e0f2fe', modelColor = '#0284c7' }) {
  if (!rawText) return null;

  // 1. Pre-clean text
  let cleaned = cleanAiMarkdown(rawText);

  // Strip prefix labels like "**Key Point 1:**", "Point #1:", "GPT-4o Executive Takeaway 1:", etc.
  cleaned = cleaned
    .replace(/^\s*\*{0,2}\s*(Key\s+)?(Point|Takeaway|Highlight|Insight|Logic Point)\s*#?\d+\s*\*{0,2}\s*:?\s*/gi, '')
    .replace(/^#{1,6}\s+/g, '')
    .replace(/^[#\-\*•\s]+/, '')
    .trim();

  // 2. Separate title if available (e.g., "Title: Body text..." or "Title - Body text...")
  let title = '';
  let body = cleaned;

  const colonMatch = cleaned.match(/^([^:\.\n]{3,60}):\s*([\s\S]+)$/);
  if (colonMatch) {
    title = colonMatch[1].replace(/\*\*/g, '').replace(/^[#\-\*•\s]+/, '').trim();
    body = colonMatch[2].replace(/^\s*[:\-\*•]\s*/, '').trim();
  } else {
    // Or take first phrase / sentence as title if concise
    const sentenceParts = cleaned.split(/(?<=[.?!])\s+/);
    if (sentenceParts.length > 1 && sentenceParts[0].length < 60) {
      title = sentenceParts[0].replace(/[\.\?!]$/, '').replace(/\*\*/g, '').replace(/^[#\-\*•\s]+/, '').trim();
      body = sentenceParts.slice(1).join(' ').trim();
    }
  }

  // Clean orphan asterisks in title & body
  if (title) {
    title = title.replace(/\*\*/g, '').trim();
  }
  body = body.replace(/^\s*\*\*\s*/, '').trim();

  // Auto highlight terms in body
  const highlightedBody = autoHighlightKeyTerms(body);

  return (
    <div 
      className="executive-takeaway-card"
      style={{
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
        background: 'var(--card-bg, #ffffff)',
        padding: '16px 18px',
        borderRadius: '12px',
        border: '1px solid var(--border-color, #e2e8f0)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.2s ease-in-out',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Left Badge */}
      <div 
        style={{ 
          background: modelBg, 
          color: modelColor, 
          fontSize: '12px', 
          fontWeight: 800, 
          padding: '4px 10px', 
          borderRadius: '20px', 
          whiteSpace: 'nowrap', 
          flexShrink: 0,
          marginTop: '2px',
          letterSpacing: '0.3px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}
      >
        Point #{pointIndex}
      </div>

      {/* Right Content Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <h5 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-dark, #0f172a)', lineHeight: '1.4' }}>
            {title}
          </h5>
        )}
        <div style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-dark, #334155)', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ node, ...props }) => <span style={{ display: 'block', margin: 0 }} {...props} />,
              strong: ({ node, ...props }) => <strong style={{ fontWeight: 700, color: 'var(--primary-teal, #0284c7)' }} {...props} />
            }}
          >
            {highlightedBody}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
