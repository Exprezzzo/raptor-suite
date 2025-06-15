// functions/src/universalAI.ts

import * as functions from 'firebase-functions';
import { getSecret } from 'firebase-functions/v2/secrets';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// This is the actual implementation of your universal AI router
export const universalAI = functions.https.onCall(async (data, context) => {
    // Authentication check (as in your previous universalAPI)
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required for universalAI.');
    }

    const textInput = data.textInput;
    const model = data.model || 'openai'; // Default to openai
    const temperature = data.temperature || 0.7;
    const maxTokens = data.maxTokens || 150;
    const modelEngine = data.modelEngine; // e.g., 'gpt-4', 'claude-3-opus-20240229', 'gemini-pro'

    if (!textInput || typeof textInput !== 'string') {
        throw new functions.https.HttpsError('invalid-argument', 'Text input is required.');
    }

    let aiResponse = "I'm sorry, I couldn't process that request.";

    try {
        switch (model) {
            case 'openai':
                const openaiApiKey = await getSecret('OPENAI_API_KEY').then(secret => secret.value());
                if (!openaiApiKey) throw new Error('OpenAI API key not found.');
                const openai = new OpenAI({ apiKey: openaiApiKey });
                const openaiChatCompletion = await openai.chat.completions.create({
                    model: modelEngine || 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: textInput }],
                    max_tokens: maxTokens,
                    temperature: temperature,
                });
                aiResponse = openaiChatCompletion.choices[0].message.content;
                break;
            case 'anthropic':
                const anthropicApiKey = await getSecret('ANTHROPIC_API_KEY').then(secret => secret.value());
                if (!anthropicApiKey) throw new Error('Anthropic API key not found.');
                const anthropic = new Anthropic({ apiKey: anthropicApiKey });
                const anthropicMessage = await anthropic.messages.create({
                    model: modelEngine || 'claude-3-opus-20240229',
                    max_tokens: maxTokens,
                    temperature: temperature,
                    messages: [{ role: 'user', content: textInput }],
                });
                aiResponse = anthropicMessage.content[0].text;
                break;
            case 'gemini':
                const geminiApiKey = await getSecret('GEMINI_API_KEY').then(secret => secret.value());
                if (!geminiApiKey) throw new Error('Gemini API key not found.');
                const genAI = new GoogleGenerativeAI(geminiApiKey);
                const geminiModel = genAI.getGenerativeModel({ model: modelEngine || 'gemini-pro' });
                const result = await geminiModel.generateContent(textInput);
                const geminiResponse = await result.response;
                aiResponse = geminiResponse.text();
                break;
            default:
                throw new functions.https.HttpsError('invalid-argument', 'Invalid AI model specified.');
        }

        return { aiResponse: aiResponse };

    } catch (error) {
        console.error('Universal AI function error:', error);
        throw new functions.https.HttpsError('internal', 'Universal AI processing failed', error.message);
    }
});