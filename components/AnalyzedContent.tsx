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
  if (highlightWords.length === 0) {
    return <p className="whitespace-pre-wrap">{text}</p>;
  }

  // Memoize the parts splitting to avoid recalculating on every render if props are stable
  // This is the primary optimization: avoiding regex recompilation and string splitting
  const parts = useMemo(() => {
    // Escape special regex characters in highlight words to prevent invalid regex or unintended behavior
    const escapedWords = highlightWords.map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));

    // Construct regex with a single capturing group to split text
    // The capturing group ensures that the split parts include the delimiters (the words themselves)
    const regex = new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'gi');
    return text.split(regex);
  }, [text, highlightWords]);

  return (
    <p className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        // Optimization: Instead of checking if part is in highlightWords (O(N*M)),
        // we use the property of split with capturing groups: odd indices are always matches.
        // Even indices (0, 2, 4...) are the text between matches.
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
