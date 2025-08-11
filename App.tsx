/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useCallback } from 'react';
import { streamDefinition, generateAsciiArt, analyzeTextForVocabulary, generateWorksheetData, setApiKey, AsciiArtData, WorksheetData } from './services/geminiService';
import ContentDisplay from './components/ContentDisplay';
import InputArea from './components/SearchBar';
import LoadingSkeleton from './components/LoadingSkeleton';
import AsciiArtDisplay from './components/AsciiArtDisplay';
import WorksheetDisplay from './components/WorksheetDisplay';
import ApiKeyManager from './components/ApiKeyManager';
import ProgressTracker from './components/ProgressTracker';

const SAMPLE_TOPICS = [ 
  'Quantum Computing and Future Technology', 
  'Sustainable Energy and Environmental Science', 
  'Neuroscience and Cognitive Psychology', 
  'Blockchain Technology and Cryptocurrency', 
  'Artificial Intelligence and Machine Learning',
  'Space Exploration and Astrophysics',
  'Biotechnology and Genetic Engineering',
  'Climate Change and Global Warming',
  'Philosophy of Mind and Consciousness',
  'Economic Theory and Financial Markets',
  'Cultural Anthropology and Social Sciences',
  'Modern Architecture and Urban Planning'
];

const WELCOME_TEXT = `🎓 Welcome to the AI-Powered Vocabulary Builder!

This intelligent learning tool helps you master challenging English vocabulary through:

✨ AI-powered text analysis to identify difficult words
🔍 Interactive word exploration with detailed definitions  
📝 Custom worksheet generation for structured learning
🎯 Korean translations for enhanced comprehension

To get started:
1. Set up your Gemini API key using the manager above
2. Paste any English text or generate a sample article
3. Click "Analyze Text" to discover challenging vocabulary
4. Explore words by clicking on highlighted terms
5. Generate custom worksheets for focused study

Ready to expand your vocabulary? Let's begin! 🚀`;

const createFallbackArt = (topic: string): AsciiArtData => {
  const displayableTopic = topic.length > 20 ? topic.substring(0, 17) + '...' : topic;
  const paddedTopic = ` ${displayableTopic} `;
  const topBorder = `┌${'─'.repeat(paddedTopic.length)}┐`;
  const middle = `│${paddedTopic}│`;
  const bottomBorder = `└${'─'.repeat(paddedTopic.length)}┘`;
  return { art: `${topBorder}\n${middle}\n${bottomBorder}` };
};

// == Sub-Components defined within App.tsx ==

interface AnalyzedContentProps {
  text: string;
  highlightWords: string[];
  onWordClick: (word: string) => void;
}

const AnalyzedContent: React.FC<AnalyzedContentProps> = ({ text, highlightWords, onWordClick }) => {
  if (highlightWords.length === 0) {
    return <p className="whitespace-pre-wrap">{text}</p>;
  }
  
  const regex = new RegExp(`\\b(${highlightWords.map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})\\b`, 'gi');
  const parts = text.split(regex);

  return (
    <p className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        const isHighlight = highlightWords.some(hWord => hWord.toLowerCase() === part.toLowerCase());
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
};


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


// == Main App Component ==

const App: React.FC = () => {
  type View = 'analyzer' | 'definition' | 'worksheet';
  type LoadingState = 'idle' | 'analyzing' | 'generating_worksheet' | 'loading_definition';

  const [view, setView] = useState<View>('analyzer');
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [mainText, setMainText] = useState<string>(WELCOME_TEXT);
  const [analyzedWords, setAnalyzedWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean>(false);
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const [progressSteps, setProgressSteps] = useState<any[]>([]);
  const [currentProgressStep, setCurrentProgressStep] = useState<string>('');

  // State for definition view
  const [definitionTopic, setDefinitionTopic] = useState<string>('');
  const [definitionContent, setDefinitionContent] = useState<string>('');
  const [asciiArt, setAsciiArt] = useState<AsciiArtData | null>(null);
  const [generationTime, setGenerationTime] = useState<number | null>(null);

  // State for worksheet view
  const [worksheetData, setWorksheetData] = useState<WorksheetData | null>(null);

  // API Key management
  const handleApiKeyChange = useCallback((apiKey: string | null) => {
    setApiKey(apiKey);
    setApiKeyConfigured(!!apiKey);
    if (apiKey) {
      setError(null);
    }
  }, []);

  // Progress tracking helper
  const createProgressSteps = (type: 'analyze' | 'worksheet' | 'definition') => {
    switch (type) {
      case 'analyze':
        return [
          { id: 'preprocessing', label: 'Preprocessing text content', completed: false, active: true, icon: '📝' },
          { id: 'analysis', label: 'AI analyzing vocabulary complexity', completed: false, active: false, icon: '🧠' },
          { id: 'ranking', label: 'Ranking words by difficulty', completed: false, active: false, icon: '📊' },
          { id: 'finalizing', label: 'Preparing results', completed: false, active: false, icon: '✨' }
        ];
      case 'worksheet':
        return [
          { id: 'setup', label: 'Setting up worksheet structure', completed: false, active: true, icon: '📋' },
          { id: 'definitions', label: 'Generating definitions and translations', completed: false, active: false, icon: '📚' },
          { id: 'questions', label: 'Creating test questions', completed: false, active: false, icon: '❓' },
          { id: 'formatting', label: 'Formatting final worksheet', completed: false, active: false, icon: '✏️' }
        ];
      case 'definition':
        return [
          { id: 'research', label: 'Researching term definition', completed: false, active: true, icon: '🔍' },
          { id: 'ascii', label: 'Generating ASCII art visualization', completed: false, active: false, icon: '🎨' },
          { id: 'content', label: 'Streaming definition content', completed: false, active: false, icon: '📖' }
        ];
      default:
        return [];
    }
  };

  const updateProgressStep = (stepId: string, completed: boolean = true) => {
    setProgressSteps(prev => {
      const newSteps = prev.map(step => ({ ...step }));
      const currentIndex = newSteps.findIndex(s => s.id === stepId);
      
      if (currentIndex >= 0) {
        newSteps[currentIndex].completed = completed;
        newSteps[currentIndex].active = false;
        
        // Activate next step
        if (completed && currentIndex + 1 < newSteps.length) {
          newSteps[currentIndex + 1].active = true;
          setCurrentProgressStep(newSteps[currentIndex + 1].id);
        }
      }
      
      return newSteps;
    });
  };


  useEffect(() => {
    if (view !== 'definition' || !definitionTopic) return;

    let isCancelled = false;
    const fetchDefinition = async () => {
      setLoadingState('loading_definition');
      setError(null);
      setDefinitionContent('');
      setAsciiArt(null);
      setGenerationTime(null);
      const startTime = performance.now();

      generateAsciiArt(definitionTopic)
        .then(art => !isCancelled && setAsciiArt(art))
        .catch(() => !isCancelled && setAsciiArt(createFallbackArt(definitionTopic)));
      
      let accumulatedContent = '';
      try {
        for await (const chunk of streamDefinition(definitionTopic)) {
          if (isCancelled) break;
          accumulatedContent += chunk;
          if (!isCancelled) setDefinitionContent(accumulatedContent);
        }
      } catch (e: unknown) {
        if (!isCancelled) setError(e instanceof Error ? e.message : 'An unknown error occurred');
      } finally {
        if (!isCancelled) {
          const endTime = performance.now();
          setGenerationTime(endTime - startTime);
          setLoadingState('idle');
        }
      }
    };
    fetchDefinition();
    return () => { isCancelled = true; };
  }, [view, definitionTopic]);


  const handleAnalyze = useCallback(async (text: string) => {
    if (!apiKeyConfigured) {
      setError('Please configure your Gemini API key first.');
      return;
    }

    setLoadingState('analyzing');
    setError(null);
    setMainText(text);
    setAnalyzedWords([]);
    setSelectedWords([]);
    
    // Setup progress tracking
    const steps = createProgressSteps('analyze');
    setProgressSteps(steps);
    setCurrentProgressStep('preprocessing');
    setShowProgress(true);
    
    try {
      // Simulate progress updates
      setTimeout(() => updateProgressStep('preprocessing'), 500);
      setTimeout(() => updateProgressStep('analysis'), 1500);
      setTimeout(() => updateProgressStep('ranking'), 2500);
      
      const words = await analyzeTextForVocabulary(text);
      
      updateProgressStep('finalizing');
      setTimeout(() => {
        setAnalyzedWords(words);
        setShowProgress(false);
      }, 500);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to analyze text.');
      setShowProgress(false);
    } finally {
      setLoadingState('idle');
    }
  }, [apiKeyConfigured]);

  const handleRandom = useCallback(async () => {
    if (!apiKeyConfigured) {
      setError('Please configure your Gemini API key first.');
      return;
    }

    setLoadingState('analyzing');
    setError(null);
    setMainText('🤖 AI is generating an educational article...');
    setAnalyzedWords([]);
    setSelectedWords([]);
    
    try {
      const randomTopic = SAMPLE_TOPICS[Math.floor(Math.random() * SAMPLE_TOPICS.length)];
      let articleText = '';
      
      setMainText(`✨ Generating article about: ${randomTopic}\n\nPlease wait while our AI creates educational content...`);
      
      for await (const chunk of streamDefinition(randomTopic)) {
        articleText += chunk;
        setMainText(`✨ Generated article about: ${randomTopic}\n\n${articleText}`);
      }
      
      // Auto-analyze the generated content
      const words = await analyzeTextForVocabulary(articleText);
      setAnalyzedWords(words);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate a random article.');
      setMainText(WELCOME_TEXT);
    } finally {
      setLoadingState('idle');
    }
  }, [apiKeyConfigured]);

  const handleWordClick = useCallback((word: string) => {
    const cleanedWord = word.trim().replace(/[.,!?;:()"']/g, '');
    if (!cleanedWord) return;
    setDefinitionTopic(cleanedWord);
    setView('definition');
    window.scrollTo(0, 0);
  }, []);

  const handleSelectionChange = useCallback((word: string) => {
    setSelectedWords(prev => 
      prev.includes(word) ? prev.filter(w => w !== word) : [...prev, word]
    );
  }, []);

  const handleGenerateWorksheet = useCallback(async () => {
    if (selectedWords.length === 0) return;
    
    setLoadingState('generating_worksheet');
    setError(null);
    
    // Setup progress tracking
    const steps = createProgressSteps('worksheet');
    setProgressSteps(steps);
    setCurrentProgressStep('setup');
    setShowProgress(true);
    
    try {
      // Simulate progress updates
      setTimeout(() => updateProgressStep('setup'), 800);
      setTimeout(() => updateProgressStep('definitions'), 2000);
      setTimeout(() => updateProgressStep('questions'), 4000);
      
      const data = await generateWorksheetData(mainText, selectedWords);
      
      updateProgressStep('formatting');
      setTimeout(() => {
        setWorksheetData(data);
        setView('worksheet');
        setShowProgress(false);
        window.scrollTo(0, 0);
      }, 800);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate worksheet.');
      setShowProgress(false);
    } finally {
      setLoadingState('idle');
    }
  }, [mainText, selectedWords]);

  const handleBackToAnalyzer = () => {
    setView('analyzer');
    setDefinitionTopic('');
    setWorksheetData(null);
    setError(null);
    setShowProgress(false);
    window.scrollTo(0, 0);
  };

  const handleClear = useCallback(() => {
    setMainText('');
    setAnalyzedWords([]);
    setSelectedWords([]);
    setError(null);
  }, []);

  const isLoading = loadingState !== 'idle';

  const renderAnalyzerView = () => (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">AI Vocabulary Builder</span>
        </h1>
        <p className="mt-2 text-lg text-gray-600">Master challenging English vocabulary with AI-powered analysis</p>
      </header>
      
      <main className="max-w-4xl mx-auto">
        <ApiKeyManager onApiKeyChange={handleApiKeyChange} />
        
        {apiKeyConfigured && (
          <InputArea 
            onAnalyze={handleAnalyze} 
            onRandom={handleRandom}
            onClear={handleClear}
            isLoading={isLoading} 
            initialText={mainText}
          />
        )}
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4 rounded-md" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}
        
        {showProgress && (
          <ProgressTracker 
            steps={progressSteps}
            currentStep={currentProgressStep}
            estimatedTime={30}
          />
        )}
        
        {!showProgress && (loadingState === 'analyzing' || loadingState === 'generating_worksheet') && (
          <LoadingSkeleton 
            showText={true} 
            text={loadingState === 'generating_worksheet' ? '🔧 Generating your custom worksheet...' : '🔍 Analyzing text for vocabulary...'} 
            type={loadingState === 'generating_worksheet' ? 'worksheet' : 'vocabulary'}
          />
        )}
        
        {!isLoading && !showProgress && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <div className="prose max-w-none">
              <AnalyzedContent 
                text={mainText}
                highlightWords={analyzedWords}
                onWordClick={handleWordClick}
              />
            </div>
            
            {analyzedWords.length > 0 && (
              <VocabularyList 
                words={analyzedWords}
                selectedWords={selectedWords}
                onWordClick={handleWordClick}
                onSelectionChange={handleSelectionChange}
              />
            )}
            
            {selectedWords.length > 0 && (
              <div className="mt-6 text-center">
                <button onClick={handleGenerateWorksheet} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200" disabled={isLoading}>
                  📝 Generate Worksheet ({selectedWords.length} words)
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );

  const renderDefinitionView = () => (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <button onClick={handleBackToAnalyzer} className="text-indigo-600 hover:underline no-print">
          &larr; Back to Analyzer
        </button>
        <AsciiArtDisplay artData={asciiArt} topic={definitionTopic} />
      </header>
      <main className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-4 capitalize">
            {definitionTopic}
          </h2>
          {error && <p className="text-red-500">Error: {error}</p>}
          <ContentDisplay content={definitionContent} isLoading={loadingState === 'loading_definition'} onWordClick={() => {}} />
        </div>
      </main>
    </div>
  );

  const renderWorksheetView = () => (
    <WorksheetDisplay 
      data={worksheetData!} 
      onBack={handleBackToAnalyzer}
    />
  );

  const renderContent = () => {
    switch(view) {
      case 'analyzer': return renderAnalyzerView();
      case 'definition': return renderDefinitionView();
      case 'worksheet': return renderWorksheetView();
      default: return renderAnalyzerView();
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto">
        {renderContent()}
      </div>
      <footer className="sticky bottom-0 bg-white border-t border-gray-200 p-4 text-center text-sm text-gray-500 no-print">
        <p>
          {view === 'definition' && generationTime ? `⚡ Generated in ${Math.round(generationTime)}ms` : `💎 Powered by Gemini AI • Built with ❤️ for learners`}
        </p>
      </footer>
    </div>
  );
};

export default App;
