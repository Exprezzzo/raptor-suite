// Voice Mode Component
// File: /src/components/VoiceModePanel.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceMode } from '../hooks/useVoiceMode'; // Path to your hook

const VoiceModePanel = ({ projectId }) => {
  const {
    isActive,
    isListening,
    isProcessing,
    currentActivity,
    conversation,
    startVoiceMode,
    stopVoiceMode,
    toggleListening,
    changeActivity,
    canUseVoiceMode
  } = useVoiceMode(projectId);

  const activities = [
    { id: 'brainstorming', label: 'Brainstorming', icon: '💡', color: 'purple' },
    { id: 'building', label: 'Building', icon: '🔨', color: 'blue' },
    { id: 'reviewing', label: 'Reviewing', icon: '👀', color: 'green' },
    { id: 'teaching', label: 'Teaching', icon: '🎓', color: 'orange' }
  ];

  if (!canUseVoiceMode) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 text-center">
        <p className="text-gray-400">Voice Mode requires microphone access</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🦅</span>
          <h3 className="text-xl font-semibold text-white">Raptor Voice Mode</h3>
        </div>

        <div className="flex items-center gap-2">
          {isActive && (
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Active
            </div>
          )}
        </div>
      </div>

      {/* Quick Start */}
      {!isActive ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <p className="text-gray-400">
            Start a hands-free conversation with Raptor
          </p>
          <button
            onClick={startVoiceMode}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 
                     text-white font-medium rounded-lg hover:shadow-lg 
                     transition-all duration-200"
          >
            🎤 Start Voice Mode
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {/* Activity Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Current Activity
            </label>
            <div className="grid grid-cols-2 gap-2">
              {activities.map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => changeActivity(activity.id)}
                  className={`p-3 rounded-lg border transition-all ${
                    currentActivity === activity.id
                      ? 'bg-purple-600 border-purple-500 text-white'
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="text-lg mb-1">{activity.icon}</div>
                  <div className="text-xs font-medium">{activity.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Controls */}
          <div className="flex items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleListening}
              disabled={isProcessing}
              className={`w-16 h-16 rounded-full flex items-center justify-center 
                        text-2xl transition-all duration-200 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isProcessing ? '⏳' : isListening ? '⏹️' : '🎤'}
            </motion.button>

            <button
              onClick={stopVoiceMode}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 
                       rounded-lg transition-colors"
            >
              End Session
            </button>
          </div>

          {/* Status */}
          <div className="text-center text-sm text-gray-400">
            {isProcessing && "🧠 Raptor is thinking..."}
            {isListening && !isProcessing && "🎤 Listening..."}
            {!isListening && !isProcessing && "Ready to listen"}
          </div>
        </div>
      )}

      {/* Conversation History */}
      <AnimatePresence>
        {conversation.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 max-h-64 overflow-y-auto"
          >
            <h4 className="text-sm font-medium text-gray-300">Recent Conversation</h4>
            {conversation.slice(-3).map((entry) => (
              <div key={entry.id} className="bg-gray-700 rounded-lg p-3 space-y-2">
                <div className="text-xs text-gray-400">
                  {entry.timestamp.toLocaleTimeString()} • {entry.activity}
                </div>
                <div className="text-sm text-blue-400">
                  You: "{entry.transcription}"
                </div>
                <div className="text-sm text-green-400">
                  Raptor: {entry.response.substring(0, 100)}...
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceModePanel;