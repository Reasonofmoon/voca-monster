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

const AnalyzedContent: React.FC<AnalyzedContentProps> = ({ text, highlightWords, onWordClick }) => {
  // Optimization: Memoize the split parts to avoid re-calculating on every render
  // unless the text or highlightWords change.
  const parts = useMemo(() => {
    if (highlightWords.length === 0) {
      return [text];
    }

    // Create a regex that captures the highlight words.
    // The capturing group (...) ensures that split() includes the separators (the words themselves) in the result array.
    const regex = new RegExp(`\\b(${highlightWords.map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})\\b`, 'gi');
    return text.split(regex);
  }, [text, highlightWords]);

  if (highlightWords.length === 0) {
    return <p className="whitespace-pre-wrap">{text}</p>;
  }

  return (
    <p className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        // Optimization: When using split with a capturing group, the matches are always at odd indices.
        // This avoids the O(N*M) check of 'highlightWords.some(...)' for every part.
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
};

// Optimization: Use React.memo to prevent re-renders when parent state changes
// but props (text, highlightWords, onWordClick) remain the same.
export default React.memo(AnalyzedContent);
