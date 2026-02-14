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

  const parts = useMemo(() => {
    // Escape special regex characters in the highlight words
    const escapedWords = highlightWords.map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    // Create the regex with word boundaries and global + case-insensitive flags
    const regex = new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'gi');
    return text.split(regex);
  }, [text, highlightWords]);

  return (
    <p className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        // Since we split by a capturing group, the matched words are included in the parts array.
        // We still need to verify if the part matches one of the highlight words (case-insensitive)
        // to determine if it should be highlighted.
        const isHighlight = highlightWords.some(hWord => hWord.toLowerCase() === part.toLowerCase());

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
