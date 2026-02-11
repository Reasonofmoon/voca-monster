import React, { useMemo } from 'react';

interface AnalyzedContentProps {
  text: string;
  highlightWords: string[];
  onWordClick: (word: string) => void;
}

/**
 * AnalyzedContent Component
 *
 * Performance Optimizations:
 * 1. Wrapped in React.memo to prevent re-renders when parent state changes (e.g. progress bar updates).
 * 2. regex creation is memoized with useMemo to avoid expensive compilation on every render.
 * 3. lookup is optimized using a Set (O(1)) instead of Array.includes/some (O(N)).
 * 4. text splitting is memoized.
 */
const AnalyzedContent: React.FC<AnalyzedContentProps> = React.memo(({ text, highlightWords, onWordClick }) => {

  const regex = useMemo(() => {
    if (highlightWords.length === 0) return null;
    return new RegExp(`\\b(${highlightWords.map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})\\b`, 'gi');
  }, [highlightWords]);

  const highlightSet = useMemo(() => {
    return new Set(highlightWords.map(w => w.toLowerCase()));
  }, [highlightWords]);

  const parts = useMemo(() => {
    if (!regex) return [text];
    return text.split(regex);
  }, [text, regex]);

  // Render plain text if no highlights (safe to return early after hooks)
  if (highlightWords.length === 0) {
    return <p className="whitespace-pre-wrap">{text}</p>;
  }

  return (
    <p className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        const isHighlight = highlightSet.has(part.toLowerCase());
        if (isHighlight) {
          return (
            <button key={index} onClick={() => onWordClick(part)} className="bg-yellow-200 hover:bg-yellow-300 text-black font-bold py-1 px-2 rounded-md transition-colors duration-200">
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
