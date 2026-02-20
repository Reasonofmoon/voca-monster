import React, { useMemo } from 'react';

// Define the interface for props.
// This interface was previously inline in App.tsx.
interface AnalyzedContentProps {
  text: string;
  highlightWords: string[];
  onWordClick: (word: string) => void;
}

/**
 * AnalyzedContent Component
 *
 * Optimized for performance:
 * 1. Uses React.memo to prevent unnecessary re-renders when props are stable.
 * 2. Uses useMemo for regex construction to avoid recompilation on every render.
 * 3. Uses direct index checking (odd indices) for O(1) highlight detection instead of O(N) .some() check.
 */
const AnalyzedContent: React.FC<AnalyzedContentProps> = React.memo(({ text, highlightWords, onWordClick }) => {
  if (highlightWords.length === 0) {
    return <p className="whitespace-pre-wrap">{text}</p>;
  }

  // Memoize regex creation.
  // Dependency: highlightWords.
  const regex = useMemo(() => {
    // Escape special regex characters to prevent invalid regex errors.
    const escapedWords = highlightWords.map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));

    // Create a capturing group regex for splitting.
    // The capturing group ensure that the delimiters (highlight words) are included in the result array.
    return new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'gi');
  }, [highlightWords]);

  // Memoize the parts array.
  // Dependency: text, regex.
  const parts = useMemo(() => text.split(regex), [text, regex]);

  return (
    <p className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        // Optimization: When using split with a capturing group, the captured delimiters are always at odd indices.
        // This avoids the O(N) .some() check inside the loop, making rendering O(M) where M is the number of parts.
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
