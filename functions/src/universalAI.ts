// universalAI: AI Router for Raptor Suite
// File: /functions/src/universalAI.ts

import * as functions from 'firebase-functions';
import { GoogleGenerativeAI } from '@google/generative-ai'; // For Gemini
import OpenAI from 'openai'; // For OpenAI
import Anthropic from '@anthropic-ai/sdk'; // For Anthropic Claude

// Make sure your API keys are securely stored in Firebase Functions environment config
// To set: firebase functions:config:set openai.key="YOUR_OPENAI_KEY" anthropic.key="YOUR_ANTHROPIC_KEY" gemini.key="YOUR_GEMINI_KEY"
// To get: firebase functions:config:get
// NOTE: For security, never hardcode API keys in your code.
const config = functions.config();

const openai = new OpenAI({
  apiKey: config.openai?.key,
});

const anthropic = new Anthropic({
  apiKey: config.anthropic?.key,
});

// Initialize Gemini (Google Generative AI)
const genAI = new GoogleGenerativeAI(config.gemini?.key);

export interface AIProcessOptions {
  prompt: string;
  provider?: 'openai' | 'anthropic' | 'gemini'; // Default to gemini if not specified
  context?: { [key: string]: any };
  model?: string;
}

export interface AIProcessResult {
  result: string;
  provider: string;
  model: string;
  usage?: any; // For token counts etc.
}

export class UniversalAI {
  static async process(options: AIProcessOptions): Promise<AIProcessResult> {
    const { prompt, provider = 'gemini', context, model } = options;

    let aiResponse: string = '';
    let usedProvider: string = provider;
    let usedModel: string = model || 'default';
    let usageData: any = {};

    functions.logger.log(`UniversalAI: Processing with provider: ${provider}, context:`, context);

    try {
      switch (provider) {
        case 'openai':
          usedModel = model || 'gpt-4o'; // Default to gpt-4o for best results
          const openaiCompletion = await openai.chat.completions.create({
            model: usedModel,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          });
          aiResponse = openaiCompletion.choices[0].message?.content || 'No response from OpenAI.';
          usageData = openaiCompletion.usage;
          break;

        case 'anthropic':
          usedModel = model || 'claude-3-opus-20240229'; // Default to Claude 3 Opus
          const anthropicMessage = await anthropic.messages.create({
            model: usedModel,
            max_tokens: 1000,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
          });
          aiResponse = typeof anthropicMessage.content === 'string' ? anthropicMessage.content : anthropicMessage.content[0]?.text || 'No response from Anthropic.';
          // Anthropic usage is typically in the message object or response headers.
          // For simplicity, direct token usage isn't always readily available here without parsing.
          usageData = anthropicMessage.usage; // Example, depends on SDK version.
          break;

        case 'gemini':
        default:
          usedModel = model || 'gemini-pro'; // Default to Gemini Pro
          const geminiModel = genAI.getGenerativeModel({ model: usedModel });
          const result = await geminiModel.generateContent(prompt);
          const geminiResponse = await result.response;
          aiResponse = geminiResponse.text() || 'No response from Gemini.';
          // Gemini usage is typically in the response metadata.
          usageData = geminiResponse.usageMetadata; // Example, depends on SDK version.
          break;
      }
    } catch (error: any) {
      functions.logger.error(`Error processing AI request for provider ${provider}:`, error);
      aiResponse = `I'm sorry, I encountered an error with the AI: ${error.message}. Please try again.`;
    }

    return {
      result: aiResponse,
      provider: usedProvider,
      model: usedModel,
      usage: usageData
    };
  }
}

// Firebase Cloud Function for Universal AI (HTTP Callable)
// This defines universalAI as a 1st Gen Cloud Function to avoid 2nd Gen upgrade issues.
export const universalAI = functions.https.onCall(async (data, context) => {
  // Ensure the user is authenticated if necessary
  // if (!context.auth) {
  //   throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  // }

  const options: AIProcessOptions = data;

  try {
    const result = await UniversalAI.process(options);
    return { success: true, result: result.result, provider: result.provider, model: result.model };
  } catch (error: any) {
    functions.logger.error('Error calling UniversalAI function:', error);
    throw new functions.https.HttpsError('internal', error.message, error.details);
  }
});