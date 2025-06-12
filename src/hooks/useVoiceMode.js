// RAPTOR VOICE MODE - CLIENT-SIDE IMPLEMENTATION
// File: /src/hooks/useVoiceMode.js

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Assuming this path is correct

export const useVoiceMode = (projectId = null) => {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [currentActivity, setCurrentActivity] = useState('brainstorming');
  const [conversation, setConversation] = useState([]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  // **** IMPORTANT: REPLACE THIS WITH YOUR ACTUAL DEPLOYED VOICE MODE HANDLER URL ****
  const VOICE_MODE_API_URL = 'https://us-central1-raptor-suite.cloudfunctions.net/voiceModeHandler'; // e.g., 'https://us-central1-raptor-suite.cloudfunctions.net/voiceModeHandler'
  // ***********************************************************************************

  // Voice Mode Configuration
  const voiceConfig = {
    sampleRate: 16000,
    channels: 1,
    mimeType: 'audio/webm;codecs=opus' // Common format for MediaRecorder and Speech-to-Text
  };

  // Start Voice Mode Session
  const startVoiceMode = useCallback(async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: voiceConfig.sampleRate,
          channelCount: voiceConfig.channels,
          echoCancellation: true, // Helps reduce echoes
          noiseSuppression: true // Helps reduce background noise
        }
      });

      streamRef.current = stream;

      // Create new voice session (simulated on client for now, or could be a dedicated endpoint)
      // For simplicity, we'll let the voiceModeHandler create/get the session on first call
      // or you could have a separate Firestore write here to signal a session start.
      // For this implementation, the first call to processAudioInput will establish the session.
      // We will set a temporary sessionId if not already set, or generate one client-side initially.
      const newSessionId = `voice_${Date.now()}_${user.uid}`; // Generate client-side session ID
      setSessionId(newSessionId);
      setIsActive(true);

      // Initialize MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: voiceConfig.mimeType
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // When recording stops, process the audio
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: voiceConfig.mimeType
        });
        audioChunksRef.current = []; // Clear chunks for next recording
        await processAudioInput(audioBlob);
      };

      console.log('Voice Mode activated');

    } catch (error) {
      console.error('Failed to start voice mode:', error);
      alert('Microphone access required for Voice Mode: ' + error.message);
    }
  }, [user.uid, projectId, VOICE_MODE_API_URL]); // CORRECTED: Using VOICE_MODE_API_URL variable here

  // Stop Voice Mode Session
  const stopVoiceMode = useCallback(async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop()); // Stop microphone
    }

    // No need for a separate 'session/end' endpoint if the main handler manages state.
    // The session will simply become inactive after a timeout if no more activity.
    // If you need explicit ending, uncomment and create a separate Cloud Function for it.
    /*
    if (sessionId) {
      await fetch(VOICE_MODE_API_URL + '/endSession', { // Example if you had a separate endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
    }
    */

    setIsActive(false);
    setIsListening(false);
    setSessionId(null);
    setConversation([]); // Clear conversation on session end
    console.log('Voice Mode deactivated');
  }, [sessionId, VOICE_MODE_API_URL]); // CORRECTED: Using VOICE_MODE_API_URL variable here

  // Start/Stop Listening
  const toggleListening = useCallback(() => {
    if (!isActive || !mediaRecorderRef.current) return;

    if (isListening) {
      // Stop recording and trigger processing
      mediaRecorderRef.current.stop();
      setIsListening(false);
    } else {
      // Start recording
      mediaRecorderRef.current.start(); // Start recording into chunks
      setIsListening(true);
    }
  }, [isActive, isListening]);

  // Process audio input through Raptor Voice Mode
  const processAudioInput = useCallback(async (audioBlob) => {
    if (!sessionId) {
      console.error("No session ID available for processing.");
      return;
    }

    setIsProcessing(true);

    try {
      // Convert audio Blob to base64 string
      const arrayBuffer = await audioBlob.arrayBuffer();
      // btoa() only works for ASCII. For binary, use Uint8Array and conversion.
      const base64Audio = Buffer.from(arrayBuffer).toString('base64'); // Node.js Buffer for browser compatibility if using bundler like Vite/Webpack

      // Send to voice mode handler (your deployed Cloud Function)
      const response = await fetch(VOICE_MODE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          audioData: base64Audio,
          context: {
            userId: user.uid,
            projectId,
            timestamp: Date.now()
          }
        })
      });

      const result = await response.json();
      console.log('Voice API response:', result);

      if (result.success) {
        // Add conversation entry
        const newEntry = {
          id: Date.now(),
          type: 'voice_exchange',
          timestamp: new Date(),
          transcription: result.transcription,
          response: result.result, // Use result.result here, not result.response
          activity: currentActivity // This activity might be updated by the AI in backend
        };

        setConversation(prev => [...prev, newEntry]);

        // Play audio response
        if (result.audioResponse) {
          await playAudioResponse(result.audioResponse);
        }
      } else {
        console.error('Voice processing failed:', result.error);
        setConversation(prev => [...prev, { id: Date.now(), type: 'error', timestamp: new Date(), response: `Raptor: I'm sorry, I encountered an error: ${result.error}` }]);
      }

    } catch (error) {
      console.error('Voice processing error:', error);
      setConversation(prev => [...prev, { id: Date.now(), type: 'error', timestamp: new Date(), response: `Raptor: There was a problem connecting or processing. Please try again.` }]);
    } finally {
      setIsProcessing(false);
    }
  }, [sessionId, user.uid, projectId, currentActivity, VOICE_MODE_API_URL]);

  // Play audio response from Raptor
  const playAudioResponse = useCallback(async (base64Audio) => {
    try {
      // Convert base64 audio string back to ArrayBuffer
      const audioArray = Buffer.from(base64Audio, 'base64');
      const audioBlob = new Blob([audioArray], { type: 'audio/mp3' }); // Ensure type matches what TTS outputs

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      await audio.play();

      // Cleanup
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };

    } catch (error) {
      console.error('Audio playback error:', error);
    }
  }, []);

  // Change activity mode
  const changeActivity = useCallback((newActivity) => {
    setCurrentActivity(newActivity);
    // Optionally, you could send this change to the backend session if strict sync is needed
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isActive) {
        stopVoiceMode();
      }
    };
  }, [isActive, stopVoiceMode]);

  return {
    // State
    isActive,
    isListening,
    isProcessing,
    currentActivity,
    conversation,

    // Actions
    startVoiceMode,
    stopVoiceMode,
    toggleListening,
    changeActivity,

    // Utilities
    canUseVoiceMode: !!navigator.mediaDevices?.getUserMedia
  };
};