/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';

interface InputAreaProps {
  onAnalyze: (text: string) => void;
  onRandom: () => void;
  onClear: () => void;
  isLoading: boolean;
  initialText: string;
}

const InputArea: React.FC<InputAreaProps> = ({ onAnalyze, onRandom, onClear, isLoading, initialText }) => {
  const [text, setText] = useState(initialText);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setText(initialText);
    setCharCount(initialText.length);
  }, [initialText]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setCharCount(newText.length);
  };

  const handleAnalyzeClick = () => {
    if (text.trim() && !isLoading) {
      onAnalyze(text.trim());
    }
  };

  const handleClearClick = () => {
    setText('');
    setCharCount(0);
    onClear();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === 'Enter' && text.trim() && !isLoading) {
      handleAnalyzeClick();
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText.trim()) {
        setText(clipboardText);
        setCharCount(clipboardText.length);
      }
    } catch (error) {
      console.warn('Could not access clipboard:', error);
    }
  };

  const sampleTexts = [
    "Artificial intelligence represents one of the most transformative technologies of our era, fundamentally altering how we process information, make decisions, and interact with digital systems.",
    "Quantum mechanics elucidates the enigmatic behavior of subatomic particles, revealing phenomena that contradict our intuitive understanding of reality and demonstrate the probabilistic nature of the universe.",
    "Neuroplasticity, the brain's remarkable capacity for reorganization and adaptation, exemplifies the dynamic nature of neural networks and their ability to form new synaptic connections throughout life."
  ];

  const insertSampleText = () => {
    const randomSample = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setText(randomSample);
    setCharCount(randomSample.length);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="relative">
        <textarea
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Paste any English text here to analyze... \n\nTip: Press Ctrl+Enter to analyze quickly!"
          className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
          aria-label="Text to analyze"
          disabled={isLoading}
          maxLength={10000}
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
          {charCount.toLocaleString()}/10,000
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex gap-2">
          <button 
            onClick={pasteFromClipboard} 
            className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50" 
            disabled={isLoading}
            title="Paste from clipboard"
          >
            📋 Paste
          </button>
          <button 
            onClick={insertSampleText} 
            className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50" 
            disabled={isLoading}
            title="Insert sample text"
          >
            🎲 Sample
          </button>
          <button 
            onClick={handleClearClick} 
            className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50" 
            disabled={isLoading || !text.trim()}
            title="Clear text"
          >
            🗑️ Clear
          </button>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={onRandom} 
            className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50" 
            disabled={isLoading}
            title="Generate random article with AI"
          >
            ✨ Generate Article
          </button>
          <button 
            onClick={handleAnalyzeClick} 
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50" 
            disabled={isLoading || !text.trim()}
            title="Analyze text for vocabulary (Ctrl+Enter)"
          >
            {isLoading ? '⏳ Analyzing...' : '🔍 Analyze Text'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputArea;
