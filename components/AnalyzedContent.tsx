import React, { useMemo } from 'react';

interface AnalyzedContentProps {
  text: string;
  highlightWords: string[];
  onWordClick: (word: string) => void;
}

const AnalyzedContent: React.FC<AnalyzedContentProps> = React.memo(({ text, highlightWords, onWordClick }) => {
  if (highlightWords.length === 0) {
    return <p className="whitespace-pre-wrap">{text}</p>;
  }

  // Optimized: Use useMemo to prevent regex recompilation on every render.
  // The regex is constructed to capture the highlight words, so odd indices in split will be matches.
  const regex = useMemo(() => {
    const escapedWords = highlightWords.map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    return new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'gi');
  }, [highlightWords]);

  // Optimized: Memoize the split operation to avoid re-splitting text unless text or regex changes.
  const parts = useMemo(() => text.split(regex), [text, regex]);

  return (
    <p className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        // Optimized: Since we split by the highlight regex (capturing group), odd indices are always the matches.
        // This avoids the O(M) loop of checking highlightWords.some(...) for every part, making it O(1).
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

AnalyzedContent.displayName = 'AnalyzedContent';

export default AnalyzedContent;
