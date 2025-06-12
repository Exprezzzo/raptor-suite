import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAI } from '../hooks/useAI';

const AIPlayground = () => {
  const { generateWithAI, loading, error, AIProvider } = useAI();
  const [prompt, setPrompt] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [results, setResults] = useState([]);
  const [activeTab, setActiveTab] = useState('playground');

  const providers = [
    {
      id: AIProvider.OPENAI,
      name: 'OpenAI GPT-4',
      icon: '🤖',
      color: 'from-green-500 to-emerald-600',
      description: 'Best for code generation and technical tasks'
    },
    {
      id: AIProvider.ANTHROPIC,
      name: 'Claude 3',
      icon: '🧠',
      color: 'from-purple-500 to-pink-600',
      description: 'Best for analysis and creative writing'
    },
    {
      id: AIProvider.GEMINI,
      name: 'Google Gemini',
      icon: '✨',
      color: 'from-blue-500 to-cyan-600',
      description: 'Best for visual concepts and multimodal tasks'
    }
  ];

  const handleGenerate = async (provider) => {
    if (!prompt.trim()) return;

    const result = await generateWithAI({
      prompt,
      provider: provider.id,
      temperature: 0.7,
      maxTokens: 1000
    });

    if (result.success) {
      setResults(prev => [{
        id: Date.now(),
        provider: provider,
        prompt: prompt,
        response: result.result,
        timestamp: new Date()
      }, ...prev]);
    }
  };

  const handleGenerateAll = async () => {
    if (!prompt.trim()) return;
    
    // Generate with all providers simultaneously
    const promises = providers.map(provider => handleGenerate(provider));
    await Promise.all(promises);
  };

  const examplePrompts = [
    "Create a React component for a todo list with local storage",
    "Write a story about a dragon who loves programming",
    "Design a futuristic UI for a space exploration app",
    "Explain quantum computing to a 10-year-old",
    "Generate a game concept about time travel"
  ];

  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            🎮 AI Playground
          </h1>
          <p className="text-gray-400 text-lg">
            Test your Universal AI Router with all available models
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 inline-flex">
            <button
              onClick={() => setActiveTab('playground')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'playground'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Playground
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              History ({results.length})
            </button>
          </div>
        </div>

        {activeTab === 'playground' ? (
          <>
            {/* Prompt Input */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <div className="bg-gray-800 rounded-xl p-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Enter your prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask the AI anything..."
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg 
                           text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 
                           focus:ring-1 focus:ring-purple-500 transition-colors resize-none"
                  rows={4}
                />
                
                {/* Example Prompts */}
                <div className="mt-4">
                  <p className="text-xs text-gray-400 mb-2">Try an example:</p>
                  <div className="flex flex-wrap gap-2">
                    {examplePrompts.map((example, i) => (
                      <button
                        key={i}
                        onClick={() => setPrompt(example)}
                        className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 
                                 text-gray-300 rounded-full transition-colors"
                      >
                        {example.substring(0, 40)}...
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate All Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerateAll}
                  disabled={loading || !prompt.trim()}
                  className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 
                           text-white font-medium rounded-lg shadow-lg shadow-purple-500/25 
                           hover:shadow-xl hover:shadow-purple-500/30 transition-all 
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Generating...' : 'Generate with All AIs'}
                </motion.button>
              </div>
            </motion.div>

            {/* AI Providers */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-6">
                Or choose a specific AI:
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {providers.map((provider, index) => (
                  <motion.div
                    key={provider.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="relative group"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${provider.color} 
                                   opacity-0 group-hover:opacity-20 transition-opacity 
                                   duration-300 rounded-xl blur-xl`}></div>
                    <div className="relative bg-gray-800 border border-gray-700 rounded-xl p-6 
                                  hover:border-gray-600 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{provider.icon}</span>
                        <h3 className="text-lg font-semibold text-white">{provider.name}</h3>
                      </div>
                      <p className="text-sm text-gray-400 mb-4">{provider.description}</p>
                      <button
                        onClick={() => handleGenerate(provider)}
                        disabled={loading || !prompt.trim()}
                        className={`w-full px-4 py-2 bg-gradient-to-r ${provider.color} 
                                 text-white font-medium rounded-lg transition-all 
                                 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        Generate
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-4 bg-red-900/20 border border-red-700 rounded-lg"
              >
                <p className="text-red-400">Error: {error}</p>
              </motion.div>
            )}
          </>
        ) : (
          /* History Tab */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {results.length === 0 ? (
              <div className="text-center py-12 bg-gray-800/50 rounded-xl">
                <p className="text-gray-400">No generations yet. Try a prompt!</p>
              </div>
            ) : (
              <AnimatePresence>
                {results.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{result.provider.icon}</span>
                        <div>
                          <h4 className="font-semibold text-white">{result.provider.name}</h4>
                          <p className="text-xs text-gray-400">
                            {result.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm text-gray-400 mb-1">Prompt:</p>
                      <p className="text-white bg-gray-700 rounded p-3 text-sm">
                        {result.prompt}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Response:</p>
                      <div className="bg-gray-900 rounded p-3 text-sm text-gray-300 
                                    whitespace-pre-wrap max-h-64 overflow-y-auto">
                        {result.response}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AIPlayground;