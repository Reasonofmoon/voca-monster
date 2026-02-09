import React, { useMemo } from 'react';

interface AnalyzedContentProps {
  text: string;
  highlightWords: string[];
  onWordClick: (word: string) => void;
}

const AnalyzedContent: React.FC<AnalyzedContentProps> = React.memo(({ text, highlightWords, onWordClick }) => {
  // Memoize the normalized highlights set to avoid recreating it on every render
  const normalizedHighlights = useMemo(() => {
    return new Set(highlightWords.map(w => w.toLowerCase()));
  }, [highlightWords]);

  // Memoize regex to prevent expensive recompilation
  // Return null if no highlight words to avoid invalid regex or expensive operations
  const regex = useMemo(() => {
    if (highlightWords.length === 0) return null;
    return new RegExp(`\\b(${highlightWords.map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})\\b`, 'gi');
  }, [highlightWords]);

  // Memoize the split operation as it can be expensive for large texts
  const parts = useMemo(() => {
    if (!regex) return [text];
    return text.split(regex);
  }, [text, regex]);

  return (
    <p className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        // Use Set.has for O(1) lookup instead of Array.some which is O(N)
        const isHighlight = normalizedHighlights.has(part.toLowerCase());
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
