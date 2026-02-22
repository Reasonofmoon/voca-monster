import React, { useMemo } from 'react';

export interface AnalyzedContentProps {
  text: string;
  highlightWords: string[];
  onWordClick: (word: string) => void;
}

const AnalyzedContent: React.FC<AnalyzedContentProps> = React.memo(({ text, highlightWords, onWordClick }) => {
  const parts = useMemo(() => {
    if (highlightWords.length === 0) return [text];

    // Escape special regex characters
    const escapedWords = highlightWords.map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    // Construct regex with capturing group so split includes the matches
    const regex = new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'gi');

    return text.split(regex);
  }, [text, highlightWords]);

  if (highlightWords.length === 0) {
    return <p className="whitespace-pre-wrap">{text}</p>;
  }

  return (
    <p className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        // With capturing group split, odd indices are always the matches
        // This avoids O(N*M) check for highlight words
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
