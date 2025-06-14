// functions/src/universalAI.ts (Simplified for compilation)

import * as functions from 'firebase-functions';
// Assuming you have your AI models initialized elsewhere and imported here
// import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai'; // Example import if using Gemini JS SDK

// Define simple interfaces to avoid TypeScript errors for now.
// You might have more complex interfaces defined in another file (e.g., types.ts)
interface AIRequest {
  prompt: string; // Assuming a 'prompt' property
  // Add other properties if your AI request expects them (e.g., modelConfig, safetySettings)
}

interface AIResponse {
  generatedText: string;
  tokensUsed: number;
  // Add other properties as needed based on your actual AI model's response
}

// Placeholder for your actual AI model interaction logic
async function callGenerativeAI(prompt: string): Promise<AIResponse> {
  // --- Replace this with your actual Gemini API call logic ---
  // Example using fetch for Gemini API (assuming gemini-2.0-flash model)
  // Ensure you have an API key (e.g., from environment variables)
  const API_KEY = functions.config().gemini?.api_key || ""; // Get API key from Firebase config
  if (!API_KEY) {
    throw new Error("Gemini API key not configured in Firebase Functions environment.");
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
  const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
  const payload = { contents: chatHistory };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error response:', errorData);
      throw new Error(`Gemini API returned error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();

    // Safely access properties as per Gemini API response structure
    const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const totalTokenCount = result.usageMetadata?.totalTokenCount || 0; // Directly use totalTokenCount if available

    return {
      generatedText: generatedText,
      tokensUsed: totalTokenCount,
    };
  } catch (error) {
    console.error("Error calling Generative AI:", error);
    throw new Error(`Failed to call Generative AI: ${error}`);
  }
  // --- End of actual Gemini API call logic ---
}


// Firebase Callable Function: universalAI
// This function handles AI requests from your client.
exports.universalAI = functions.https.onCall(async (data: AIRequest, context) => {
  // Ensure the user is authenticated if required for this function
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required for AI requests.');
  }

  // Validate incoming data
  if (!data.prompt || typeof data.prompt !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'The request must contain a "prompt" string.');
  }

  try {
    const aiResponse = await callGenerativeAI(data.prompt);

    return {
      status: 'success',
      generatedText: aiResponse.generatedText,
      tokensUsed: aiResponse.tokensUsed,
      // You can add more data from aiResponse if your AIResponse interface expands
    } as AIResponse; // Cast to AIResponse type if needed
  } catch (error: any) {
    console.error("Error in universalAI function:", error);
    throw new functions.https.HttpsError('internal', 'Failed to process AI request.', error.message);
  }
});