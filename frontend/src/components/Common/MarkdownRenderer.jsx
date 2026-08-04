import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cleanAiMarkdown } from '../../utils/textCleaner';

export default function MarkdownRenderer({ content, className = '', style = {} }) {
  if (!content) return null;

  const cleanedText = cleanAiMarkdown(content);

  return (
    <div 
      className={`markdown-renderer-body ${className}`} 
      style={{ 
        fontSize: '15px', 
        lineHeight: '1.75', 
        color: 'var(--text-dark, #1e293b)',
        wordBreak: 'break-word',
        overflowWrap: 'anywhere',
        ...style 
      }}
    >
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 style={{ fontSize: '20px', fontWeight: 800, marginTop: '16px', marginBottom: '10px', color: 'var(--text-dark, #0f172a)' }} {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginTop: '14px', marginBottom: '8px', color: 'var(--text-dark, #0f172a)' }} {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginTop: '12px', marginBottom: '6px', color: 'var(--text-dark, #0f172a)' }} {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 style={{ fontSize: '15px', fontWeight: 600, marginTop: '10px', marginBottom: '4px', color: 'var(--text-dark, #0f172a)' }} {...props} />
          ),
          p: ({ node, ...props }) => (
            <p style={{ marginBottom: '12px', lineHeight: '1.75' }} {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul style={{ paddingLeft: '20px', marginBottom: '12px', listStyleType: 'disc' }} {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol style={{ paddingLeft: '20px', marginBottom: '12px', listStyleType: 'decimal' }} {...props} />
          ),
          li: ({ node, ...props }) => (
            <li style={{ marginBottom: '6px', lineHeight: '1.6' }} {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong style={{ fontWeight: 700, color: 'var(--primary-teal, #0284c7)' }} {...props} />
          ),
          em: ({ node, ...props }) => (
            <em style={{ fontStyle: 'italic', opacity: 0.9 }} {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote style={{ borderLeft: '4px solid var(--primary-teal, #0284c7)', paddingLeft: '12px', marginLeft: 0, marginY: '12px', color: '#475569', fontStyle: 'italic' }} {...props} />
          ),
          code: ({ node, inline, ...props }) => (
            inline ? (
              <code style={{ background: 'rgba(2, 132, 199, 0.08)', color: '#0284c7', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', fontFamily: 'monospace' }} {...props} />
            ) : (
              <pre style={{ background: '#1e293b', color: '#f8fafc', padding: '14px', borderRadius: '8px', overflowX: 'auto', fontSize: '13px', marginY: '12px' }}>
                <code {...props} />
              </pre>
            )
          ),
          table: ({ node, ...props }) => (
            <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', border: '1px solid var(--border-color, #e2e8f0)' }} {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th style={{ background: 'rgba(2, 132, 199, 0.08)', padding: '10px 12px', textAlign: 'left', fontWeight: 700, borderBottom: '2px solid var(--border-color, #e2e8f0)' }} {...props} />
          ),
          td: ({ node, ...props }) => (
            <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color, #e2e8f0)' }} {...props} />
          )
        }}
      >
        {cleanedText}
      </ReactMarkdown>
    </div>
  );
}
