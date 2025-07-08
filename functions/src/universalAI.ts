/**
 * Phoenix Universal AI Endpoint (v3+)
 * - Multi-provider: Anthropic, Gemini, OpenAI
 * - Circuit breaker, retries, timeouts, cost tracking
 * - Health check, Zod validation, rate limiting
 */

import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { logger } from 'firebase-functions/v2';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import * as express from 'express';
import * as corsModule from 'cors';
import { v4 as uuidv4 } from 'uuid';

import { SafeOperation } from '../lib/safeOperation';
import { CostTracker } from '../lib/costTracker';
import { RateLimiter } from '../lib/rateLimiter';
import {
  UniversalAIRequestSchema,
  UniversalAIResponse,
  AIProvider,
  MODEL_CONFIGS,
  AIError,
  AIErrorType,
} from '../lib/types';

const app = express();
const cors = corsModule({ origin: true });
app.use(cors);
app.use(express.json({ limit: '1mb' })); // Prevent large payload attacks

// Secrets (set these in Firebase CLI, NOT in code)
const anthropicKey = defineSecret('ANTHROPIC_API_KEY');
const geminiKey = defineSecret('GEMINI_API_KEY');
const openaiKey = defineSecret('OPENAI_API_KEY');

// Per-provider rate limiters
const rateLimiters = {
  anthropic: new RateLimiter(MODEL_CONFIGS.anthropic.rateLimit),
  gemini: new RateLimiter(MODEL_CONFIGS.gemini.rateLimit),
  openai: new RateLimiter(MODEL_CONFIGS.openai.rateLimit),
};

/**
 * Main AI endpoint
 */
app.post('*', async (req, res) => {
  const startTime = Date.now();
  const requestId = uuidv4();

  try {
    // 1. Validate request (Zod)
    const validationResult = UniversalAIRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
        details: validationResult.error.flatten(),
        metadata: { requestId },
      });
    }

    const request = validationResult.data;
    const { prompt, provider, maxTokens, temperature, userId } = request;

    // 2. Rate limiting (per provider + user/ip)
    const rateLimiter = rateLimiters[provider];
    const limiterKey = userId || req.ip;
    if (!(await rateLimiter.checkLimit(limiterKey))) {
      throw new AIError(
        AIErrorType.RATE_LIMIT,
        `Rate limit exceeded for ${provider}`,
        provider,
        true
      );
    }

    // 3. SafeOperation (circuit breaker, retries, timeouts)
    const result = await SafeOperation.execute(`ai-${provider}-${requestId}`, {
      operation: async () => {
        switch (provider) {
          case 'anthropic':
            return await callAnthropic(prompt, maxTokens, temperature);
          case 'gemini':
            return await callGemini(prompt, maxTokens, temperature);
          case 'openai':
            return await callOpenAI(prompt, maxTokens, temperature);
        }
      },
      maxRetries: 3,
      timeout: 30000,
      costLimit: 0.10,
      onError: (error) => logger.error(`Provider ${provider} error:`, error),
    });

    // 4. Track cost in Firestore
    const cost = await CostTracker.trackUsage(
      provider,
      result.usage.promptTokens,
      result.usage.completionTokens,
      userId
    );

    // 5. Warn if expensive
    if (cost > 0.05) {
      logger.warn(`High cost request: $${cost.toFixed(4)} for ${requestId}`);
    }

    // 6. Build and send response
    const response: UniversalAIResponse = {
      success: true,
      provider,
      result: result.text,
      usage: {
        ...result.usage,
        estimatedCost: cost,
      },
      metadata: {
        requestId,
        processingTime: Date.now() - startTime,
        retries: 0,
      },
    };
    res.json(response);

  } catch (error) {
    logger.error('UniversalAI Error:', error);

    const aiError = error instanceof AIError ? error : new AIError(
      AIErrorType.PROVIDER_ERROR,
      error.message || 'Unknown error',
      undefined,
      false
    );

    const response: UniversalAIResponse = {
      success: false,
      provider: req.body.provider || 'unknown',
      error: aiError.message,
      metadata: {
        requestId,
        processingTime: Date.now() - startTime,
        retries: 0,
      },
    };
    const statusCode = aiError.type === AIErrorType.RATE_LIMIT ? 429 : 500;
    res.status(statusCode).json(response);
  }
});

/**
 * Provider implementations
 */
async function callAnthropic(
  prompt: string,
  maxTokens?: number,
  temperature?: number
): Promise<{ text: string; usage: any }> {
  const key = await anthropicKey.value();
  const client = new Anthropic({ apiKey: key });

  const message = await client.messages.create({
    model: MODEL_CONFIGS.anthropic.model,
    max_tokens: maxTokens || MODEL_CONFIGS.anthropic.maxTokens,
    temperature: temperature || 0.7,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('\n');

  return {
    text,
    usage: {
      promptTokens: message.usage.input_tokens,
      completionTokens: message.usage.output_tokens,
      totalTokens: message.usage.input_tokens + message.usage.output_tokens,
    },
  };
}

async function callGemini(
  prompt: string,
  maxTokens?: number,
  temperature?: number
): Promise<{ text: string; usage: any }> {
  const key = await geminiKey.value();
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: MODEL_CONFIGS.gemini.model,
  });

  const result = await model.generateContent({
    contents: [{
      role: 'user',
      parts: [{ text: prompt }],
    }],
    generationConfig: {
      maxOutputTokens: maxTokens || MODEL_CONFIGS.gemini.maxTokens,
      temperature: temperature || 0.7,
    },
  });

  const text = result.response.text();
  const estimatedPromptTokens = Math.ceil(prompt.length / 4);
  const estimatedCompletionTokens = Math.ceil(text.length / 4);

  return {
    text,
    usage: {
      promptTokens: estimatedPromptTokens,
      completionTokens: estimatedCompletionTokens,
      totalTokens: estimatedPromptTokens + estimatedCompletionTokens,
    },
  };
}

async function callOpenAI(
  prompt: string,
  maxTokens?: number,
  temperature?: number
): Promise<{ text: string; usage: any }> {
  const key = await openaiKey.value();

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL_CONFIGS.openai.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens || MODEL_CONFIGS.openai.maxTokens,
      temperature: temperature || 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new AIError(
      AIErrorType.PROVIDER_ERROR,
      `OpenAI API error: ${errorText}`,
      'openai',
      response.status >= 500
    );
  }

  const data = await response.json();
  return {
    text: data.choices?.[0]?.message?.content || '',
    usage: data.usage || {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
    },
  };
}

// Health check endpoint
app.get('/health', async (req, res) => {
  const stats = await CostTracker.getUsageStats(undefined, 'hour');
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    hourlyStats: stats,
    prediction: {
      dailyCost: stats.totalCost * 24,
      monthlyCost: stats.totalCost * 24 * 30,
    },
  });
});

export const universalAI = onRequest(
  {
    secrets: ['ANTHROPIC_API_KEY', 'GEMINI_API_KEY', 'OPENAI_API_KEY'],
    minInstances: 1,
    maxInstances: 100,
    timeoutSeconds: 60,
    memory: '512MiB',
  },
  app
);