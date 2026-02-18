import React, { useMemo } from 'react';

interface AnalyzedContentProps {
  text: string;
  highlightWords: string[];
  onWordClick: (word: string) => void;
}

/**
 * Optimized AnalyzedContent component.
 * Uses React.memo to prevent re-renders when parent state changes (e.g. checkbox selection).
 * Uses useMemo to cache expensive regex creation and text splitting.
 * Uses index parity check (index % 2 === 1) for O(1) highlight detection instead of O(N) .some().
 */
const AnalyzedContent: React.FC<AnalyzedContentProps> = React.memo(({ text, highlightWords, onWordClick }) => {
  if (highlightWords.length === 0) {
    return <p className="whitespace-pre-wrap">{text}</p>;
  }

  const parts = useMemo(() => {
    const regex = new RegExp(`\\b(${highlightWords.map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})\\b`, 'gi');
    return text.split(regex);
  }, [text, highlightWords]);

  return (
    <p className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        // Odd indices are the captured groups (matches) from split with capturing group
        if (index % 2 === 1) {
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
