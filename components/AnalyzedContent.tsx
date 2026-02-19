/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useMemo } from 'react';

export interface AnalyzedContentProps {
  text: string;
  highlightWords: string[];
  onWordClick: (word: string) => void;
}

const AnalyzedContent: React.FC<AnalyzedContentProps> = ({ text, highlightWords, onWordClick }) => {
  // Optimization: Memoize the regex creation.
  // We sort by length (descending) to ensure longer words match first in case of overlaps.
  const regex = useMemo(() => {
    if (highlightWords.length === 0) return null;
    const sortedWords = [...highlightWords].sort((a, b) => b.length - a.length);
    const pattern = sortedWords.map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|');
    return new RegExp(`\\b(${pattern})\\b`, 'gi');
  }, [highlightWords]);

  if (!regex || highlightWords.length === 0) {
    return <p className="whitespace-pre-wrap">{text}</p>;
  }

  const parts = text.split(regex);

  return (
    <p className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        // Optimization: Since we use a capturing group (pattern) in the split regex,
        // odd indices in the result array are always the matches.
        // This avoids the O(N) `highlightWords.some(...)` check for every part.
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

export default React.memo(AnalyzedContent);
