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

  const { parts, highlightSet } = useMemo(() => {
    // Escape special regex characters
    const escapedWords = highlightWords.map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    const regex = new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'gi');
    const parts = text.split(regex);
    const highlightSet = new Set(highlightWords.map(w => w.toLowerCase()));
    return { parts, highlightSet };
  }, [text, highlightWords]);

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
