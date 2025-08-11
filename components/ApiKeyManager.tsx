/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';

interface ApiKeyManagerProps {
  onApiKeyChange: (apiKey: string | null) => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onApiKeyChange }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isKeySet, setIsKeySet] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showKey, setShowKey] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Check for existing API key in localStorage
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey && savedKey.trim()) {
      setIsKeySet(true);
      setApiKey(savedKey);
      onApiKeyChange(savedKey);
    } else {
      // Check if there's an environment API key
      if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'PLACEHOLDER_API_KEY') {
        setIsKeySet(true);
        onApiKeyChange(process.env.GEMINI_API_KEY);
      } else {
        setIsExpanded(true); // Auto-expand if no key is available
      }
    }
  }, [onApiKeyChange]);

  const handleSaveKey = () => {
    const trimmedKey = apiKey.trim();
    
    if (!trimmedKey) {
      setMessage({ type: 'error', text: 'Please enter a valid API key' });
      return;
    }

    if (!trimmedKey.startsWith('AI') || trimmedKey.length < 20) {
      setMessage({ type: 'error', text: 'Invalid Gemini API key format' });
      return;
    }

    try {
      localStorage.setItem('gemini_api_key', trimmedKey);
      setIsKeySet(true);
      setIsExpanded(false);
      setMessage({ type: 'success', text: 'API key saved successfully!' });
      onApiKeyChange(trimmedKey);
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save API key' });
    }
  };

  const handleRemoveKey = () => {
    try {
      localStorage.removeItem('gemini_api_key');
      setApiKey('');
      setIsKeySet(false);
      setIsExpanded(true);
      setShowKey(false);
      setMessage({ type: 'success', text: 'API key removed successfully!' });
      onApiKeyChange(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to remove API key' });
    }
  };

  const handleToggleExpanded = () => {
    setIsExpanded(prev => !prev);
    setMessage(null);
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md mb-6 ${isKeySet ? 'border-green-500' : 'border-yellow-500'} border-l-4`}>
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">🔑 Gemini API Key</h3>
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${isKeySet ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {isKeySet ? 'Configured' : 'Not Set'}
          </span>
          {isKeySet && (
            <button
              onClick={handleToggleExpanded}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              type="button"
            >
              {isExpanded ? 'Hide' : 'Manage'}
            </button>
          )}
        </div>
      </div>

      {!isKeySet && (
        <p className="text-gray-600 mt-4">
          You need a Gemini API key to use this application. 
          <a 
            href="https://makersuite.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline font-semibold ml-1"
          >
            Get your free API key here →
          </a>
        </p>
      )}

      {isKeySet && !isExpanded && (
        <div className="mt-4 flex items-center gap-4">
          <span className="font-mono text-gray-500">
            {showKey ? apiKey : maskApiKey(apiKey)}
          </span>
          <button
            onClick={() => setShowKey(!showKey)}
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            {showKey ? '🙈' : '👁️'}
          </button>
        </div>
      )}

      {(isExpanded || !isKeySet) && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-2">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key..."
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              onKeyDown={(e) => e.key === 'Enter' && handleSaveKey()}
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="p-2 text-gray-500 hover:text-gray-700"
              type="button"
              title={showKey ? 'Hide API key' : 'Show API key'}
            >
              {showKey ? '🙈' : '👁️'}
            </button>
          </div>
          <div className="flex items-center justify-end gap-4">
            {isKeySet && (
              <button
                onClick={handleRemoveKey}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                type="button"
              >
                🗑️ Remove
              </button>
            )}
            <button
              onClick={handleSaveKey}
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              type="button"
            >
              💾 Save
            </button>
          </div>
        </div>
      )}

      {message && (
        <div className={`mt-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <p>{message.text}</p>
        </div>
      )}
    </div>
  );
};

export default ApiKeyManager;
