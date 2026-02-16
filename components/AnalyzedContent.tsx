/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useMemo } from 'react';

interface AnalyzedContentProps {
  text: string;
  highlightWords: string[];
  onWordClick: (word: string) => void;
}

const AnalyzedContent: React.FC<AnalyzedContentProps> = React.memo(({ text, highlightWords, onWordClick }) => {
  // Memoize the regex and splitting to prevent expensive re-calculation on every render.
  const parts = useMemo(() => {
    if (highlightWords.length === 0) {
      return [text];
    }
    // Escape special characters in words to prevent invalid regex or unexpected behavior
    const escapedWords = highlightWords.map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    // Create a regex that captures the words as groups.
    // The 'gi' flag ensures global and case-insensitive matching.
    const regex = new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'gi');
    return text.split(regex);
  }, [text, highlightWords]);

  return (
    <p className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        // Optimization: When using split with a capturing group regex like \b(word)\b,
        // the capturing groups (matches) are always at odd indices in the result array.
        // This avoids the O(M) check highlightWords.some(...) for each part, making it O(1).
        // If highlightWords is empty, parts has only 1 element (index 0), so this is false.
        const isHighlight = index % 2 === 1;

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
