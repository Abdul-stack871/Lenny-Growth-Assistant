import React from 'react';

/**
 * Lightweight safe Markdown renderer for editorial previews.
 * Parses headers, bold, italics, code, lists, dividers, and paragraphs into styled React nodes.
 */

// Helper to parse inline bold, italic, code, and links
export function parseInlineMarkdown(text: string): React.ReactNode[] {
  // Regex pattern matching **bold**, *italic*, `code`
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={index} className="italic text-gray-200">
          {part.slice(1, -1)}
        </em>
      );
    }

    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={index}
          className="font-mono text-xs bg-black/40 text-orange-400 px-1.5 py-0.5 rounded border border-white/10"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

export function renderMarkdownBlocks(content: string): React.ReactNode {
  if (!content) return null;

  // Split content by double newlines into block chunks
  const blocks = content.split(/\n\s*\n/);

  return (
    <>
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Horizontal Rule
        if (trimmed === '---' || trimmed === '***') {
          return <hr key={idx} className="essay-divider my-6 border-white/10" />;
        }

        // H1 Heading
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={idx} className="essay-section-h1 font-serif text-2xl font-bold text-white mb-4">
              {parseInlineMarkdown(trimmed.replace(/^#\s+/, ''))}
            </h1>
          );
        }

        // H2 Heading
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="essay-section-h2 font-serif text-xl font-bold text-white mt-6 mb-3">
              {parseInlineMarkdown(trimmed.replace(/^##\s+/, ''))}
            </h2>
          );
        }

        // H3 Heading
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="essay-section-h3 font-serif text-lg font-semibold text-orange-300 mt-4 mb-2">
              {parseInlineMarkdown(trimmed.replace(/^###\s+/, ''))}
            </h3>
          );
        }

        // Unordered List (- or *)
        if (trimmed.split('\n').every((line) => line.trim().startsWith('- ') || line.trim().startsWith('* '))) {
          const items = trimmed.split('\n').map((line) => line.trim().replace(/^[-*]\s+/, ''));
          return (
            <ul key={idx} className="essay-bullet-list list-disc pl-5 my-3 space-y-1 text-gray-300">
              {items.map((item, itemIdx) => (
                <li key={itemIdx}>{parseInlineMarkdown(item)}</li>
              ))}
            </ul>
          );
        }

        // Ordered List (1. 2. 3.)
        if (trimmed.split('\n').every((line) => /^\d+\.\s+/.test(line.trim()))) {
          const items = trimmed.split('\n').map((line) => line.trim().replace(/^\d+\.\s+/, ''));
          return (
            <ol key={idx} className="essay-ordered-list list-decimal pl-5 my-3 space-y-1.5 text-gray-300">
              {items.map((item, itemIdx) => (
                <li key={itemIdx}>{parseInlineMarkdown(item)}</li>
              ))}
            </ol>
          );
        }

        // Blockquote (> )
        if (trimmed.startsWith('> ')) {
          const quoteText = trimmed.replace(/^>\s+/, '');
          return (
            <blockquote
              key={idx}
              className="essay-blockquote border-l-2 border-orange-500 pl-4 py-1 my-4 italic text-gray-300 bg-white/5 rounded-r"
            >
              {parseInlineMarkdown(quoteText)}
            </blockquote>
          );
        }

        // Standard Paragraph with multi-line breaks preserved
        return (
          <p key={idx} className="essay-p text-gray-200 leading-relaxed mb-4 text-[15px]">
            {trimmed.split('\n').map((line, lidx, arr) => (
              <React.Fragment key={lidx}>
                {parseInlineMarkdown(line)}
                {lidx < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}
