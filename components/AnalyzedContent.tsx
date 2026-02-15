import React, { useMemo } from 'react';

interface AnalyzedContentProps {
  text: string;
  highlightWords: string[];
  onWordClick: (word: string) => void;
}

const AnalyzedContent = React.memo(({ text, highlightWords, onWordClick }: AnalyzedContentProps) => {
  if (highlightWords.length === 0) {
    return <p className="whitespace-pre-wrap">{text}</p>;
  }

  // Memoize regex construction to avoid rebuilding on every render
  const regex = useMemo(() => {
    // Escape special characters in highlight words
    const pattern = highlightWords
      .map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
      .join('|');
    return new RegExp(`\\b(${pattern})\\b`, 'gi');
  }, [highlightWords]);

  // Memoize the split operation to avoid expensive string processing
  const parts = useMemo(() => text.split(regex), [text, regex]);

  return (
    <p className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        // Optimization: In split results with capturing regex, odd indices are always the matches.
        // This avoids the O(M) lookup for each part, making the loop O(N) instead of O(N*M).
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
