import React, { useMemo } from 'react';

interface AnalyzedContentProps {
  text: string;
  highlightWords: string[];
  onWordClick: (word: string) => void;
}

/**
 * AnalyzedContent Component
 *
 * Optimized for performance:
 * 1. Uses React.memo to prevent re-renders when parent state updates but props remain same.
 * 2. Uses useMemo for regex creation to avoid recompilation on every render.
 * 3. Uses useMemo for text splitting to avoid re-processing large text strings.
 * 4. Uses O(1) index check (odd indices are matches) instead of O(M) .some() check.
 */
const AnalyzedContent: React.FC<AnalyzedContentProps> = React.memo(({ text, highlightWords, onWordClick }) => {
  // Memoize the parts array. This includes the regex creation and string splitting.
  // Dependencies are text and highlightWords.
  const parts = useMemo(() => {
    if (highlightWords.length === 0) {
      return [text];
    }

    // Create regex with capturing group for all highlight words
    // Escapes special characters to prevent regex errors
    const pattern = highlightWords
      .map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
      .join('|');

    const regex = new RegExp(`\\b(${pattern})\\b`, 'gi');
    return text.split(regex);
  }, [text, highlightWords]);

  // Optimization: Early return for simple case, but must be after hooks
  if (highlightWords.length === 0) {
    return <p className="whitespace-pre-wrap">{text}</p>;
  }

  return (
    <p className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        // Optimization: split with capturing regex puts matches at odd indices (1, 3, 5...)
        // This avoids the expensive O(M) .some() check for every part.
        const isHighlight = index % 2 === 1;

        if (isHighlight) {
          return (
            <button
              key={index}
              onClick={() => onWordClick(part)}
              className="bg-yellow-200 hover:bg-yellow-300 text-black font-bold py-1 px-2 rounded-md transition-colors duration-200"
            >
              {part}
            </button>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </p>
  );
});

export default AnalyzedContent;
