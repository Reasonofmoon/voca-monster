import React, { useMemo } from 'react';

export interface AnalyzedContentProps {
  text: string;
  highlightWords: string[];
  onWordClick: (word: string) => void;
}

const AnalyzedContent: React.FC<AnalyzedContentProps> = React.memo(({ text, highlightWords, onWordClick }) => {
  const parts = useMemo(() => {
    if (highlightWords.length === 0) {
      return [text];
    }

    const regex = new RegExp(`\\b(${highlightWords.map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})\\b`, 'gi');
    return text.split(regex);
  }, [text, highlightWords]);

  if (highlightWords.length === 0) {
    return <p className="whitespace-pre-wrap">{text}</p>;
  }

  return (
    <p className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        // Optimization: checking if part matches any highlight word.
        // Since we split by the regex of highlight words, the parts that match are exactly the separators (captured groups)
        // OR the parts between them.
        // However, because we use capturing groups `(...)` in split, the captured separators are included in the result array.
        // We can check if `part` exists in highlightWords (case insensitive).
        const isHighlight = highlightWords.some(hWord => hWord.toLowerCase() === part.toLowerCase());

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
