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
    if (highlightWords.length === 0) return [text];

    // Create regex with capturing group to preserve delimiters (the words)
    // The splitting logic guarantees that odd indices in 'parts' will be the matches
    const pattern = highlightWords
      .map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
      .join('|');

    const regex = new RegExp(`\\b(${pattern})\\b`, 'gi');
    return text.split(regex);
  }, [text, highlightWords]);

  return (
    <p className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        // With split(regexWithCaptureGroup), odd indices are always the matches
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
