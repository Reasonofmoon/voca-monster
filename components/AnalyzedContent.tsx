import React, { useMemo } from 'react';

export interface AnalyzedContentProps {
  text: string;
  highlightWords: string[];
  onWordClick: (word: string) => void;
}

const AnalyzedContent: React.FC<AnalyzedContentProps> = React.memo(({ text, highlightWords, onWordClick }) => {
  if (highlightWords.length === 0) {
    return <p className="whitespace-pre-wrap">{text}</p>;
  }

  // Memoize regex creation and text splitting to avoid recalculation on every render
  const parts = useMemo(() => {
    // Escape special regex characters in highlight words
    const escapedWords = highlightWords.map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    // Create a regex that matches any of the words, capturing the match
    // Using capturing group () ensures split includes the separators (matches) in the output array
    const regex = new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'gi');
    return text.split(regex);
  }, [text, highlightWords]);

  return (
    <p className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        // Since we use a capturing group in split, odd indices are matches
        // This avoids O(N) search for each part: highlightWords.some(...)
        if (index % 2 === 1) {
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
