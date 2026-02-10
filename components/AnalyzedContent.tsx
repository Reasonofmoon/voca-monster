import React, { useMemo } from 'react';

interface AnalyzedContentProps {
  text: string;
  highlightWords: string[];
  onWordClick: (word: string) => void;
}

const AnalyzedContent: React.FC<AnalyzedContentProps> = React.memo(({ text, highlightWords, onWordClick }) => {
  // Memoize the Set for O(1) lookup
  const highlightSet = useMemo(() => new Set(highlightWords.map(w => w.toLowerCase())), [highlightWords]);

  // Memoize the parts generation (regex creation and splitting)
  const parts = useMemo(() => {
    if (highlightWords.length === 0) {
      return [text];
    }
    // Escape special regex characters
    const escapedWords = highlightWords.map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    const regex = new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'gi');
    return text.split(regex);
  }, [text, highlightWords]);

  if (highlightWords.length === 0) {
    return <p className="whitespace-pre-wrap">{text}</p>;
  }

  return (
    <p className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        // O(1) lookup using Set
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
