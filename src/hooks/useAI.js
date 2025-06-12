import { useState, useCallback } from 'react';

const AI_ENDPOINT = import.meta.env.PROD 
  ? 'https://us-central1-raptor-suite.cloudfunctions.net/universalAI'
  : 'http://localhost:5001/raptor-suite/us-central1/universalAI';

export const AIProvider = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  GEMINI: 'gemini',
  FIGMA: 'figma'
};

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateWithAI = useCallback(async ({
    prompt,
    provider = null,
    projectType = null,
    context = null,
    temperature = 0.7,
    maxTokens = 2048
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(AI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          provider,
          projectType,
          context,
          temperature,
          maxTokens
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'AI generation failed');
      }

      return {
        success: true,
        result: data.result,
        provider: data.provider,
        usage: data.usage
      };
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        error: err.message
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Convenience methods for specific providers
  const generateCode = useCallback((prompt, context) => {
    return generateWithAI({
      prompt,
      provider: AIProvider.OPENAI,
      context,
      projectType: 'code'
    });
  }, [generateWithAI]);

  const generateArchitecture = useCallback((prompt, context) => {
    return generateWithAI({
      prompt,
      provider: AIProvider.ANTHROPIC,
      context,
      projectType: 'architecture'
    });
  }, [generateWithAI]);

  const generateVisual = useCallback((prompt, context) => {
    return generateWithAI({
      prompt,
      provider: AIProvider.GEMINI,
      context,
      projectType: 'visual'
    });
  }, [generateWithAI]);

  return {
    generateWithAI,
    generateCode,
    generateArchitecture,
    generateVisual,
    loading,
    error,
    AIProvider
  };
};