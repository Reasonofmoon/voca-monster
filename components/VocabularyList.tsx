import React from 'react';

interface VocabularyListProps {
  words: string[];
  selectedWords: string[];
  onWordClick: (word: string) => void;
  onSelectionChange: (word: string) => void;
}

const VocabularyList: React.FC<VocabularyListProps> = ({ words, selectedWords, onWordClick, onSelectionChange }) => {
  if (words.length === 0) return null;

  return (
    <div className="my-4">
      <h2 className="text-2xl font-bold mb-2">Key Vocabulary (by difficulty)</h2>
      <p className="text-gray-500 mb-4">Select words to generate a worksheet.</p>
      <ol className="list-decimal list-inside space-y-2">
        {words.map((word, index) => (
          <li key={index} className="flex items-center">
            <input
              type="checkbox"
              id={`vocab-checkbox-${index}`}
              checked={selectedWords.includes(word)}
              onChange={() => onSelectionChange(word)}
              aria-labelledby={`vocab-label-${index}`}
              className="mr-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor={`vocab-checkbox-${index}`} id={`vocab-label-${index}`}>
              <button onClick={() => onWordClick(word)} className="text-indigo-600 hover:underline">{word}</button>
            </label>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default React.memo(VocabularyList);
