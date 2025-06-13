// raptor-suite/functions/src/index.ts

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import config from '../../shared/config'; // Import shared config
import { isAdmin } from '../../shared/utils'; // Import shared utility
// import Stripe from 'stripe'; // Uncomment when setting up Stripe fully

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Initialize CORS middleware
const corsHandler = cors({ origin: true });

// --- HTTP Triggered Functions ---

/**
 * Example HTTP function: Returns a welcome message.
 * Accessible at: https://us-central1-raptor-suite.cloudfunctions.net/helloWorld
 */
export const helloWorld = functions.https.onRequest((req, res) => {
  corsHandler(req, res, () => {
    res.status(200).send("Hello from Raptor Suite Cloud Functions (TypeScript)!");
  });
});

/**
 * Universal AI Router
 * This function will act as a proxy to various AI APIs (OpenAI, Anthropic, Gemini).
 * It will handle authentication and routing based on request parameters.
 * Accessible at: https://us-central1-raptor-suite.cloudfunctions.net/universalAI
 *
 * NOTE: Actual AI integration will require specific API keys and more complex logic
 * to handle different models and their inputs/outputs. These keys should be
 * set as environment variables in Firebase Functions config (e.g., functions.config().openai.key).
 */
export const universalAI = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed. Only POST requests are accepted.');
    }

    // Basic authentication: Ensure user is logged in
    // For a robust solution, verify Firebase Auth ID token from `req.headers.authorization`
    const authToken = req.headers.authorization;
    if (!authToken || !authToken.startsWith('Bearer ')) {
      return res.status(401).send('Unauthorized: No authentication token provided or malformed.');
    }

    let decodedIdToken: admin.auth.DecodedIdToken;
    try {
      // Verify the ID token (replace with actual token verification logic)
      // This is crucial for securing your AI endpoint
      // decodedIdToken = await admin.auth().verifyIdToken(authToken.split('Bearer ')[1]);
      // For now, a placeholder:
      console.log('Authentication token received (verification placeholder)');
      decodedIdToken = { uid: 'mock_uid', email: 'mock@example.com' } as admin.auth.DecodedIdToken;


    } catch (error) {
      console.error("Error verifying authentication token:", error);
      return res.status(401).send('Unauthorized: Invalid authentication token.');
    }

    try {
      const { model, prompt, creativeProjectId } = req.body;

      if (!model || !prompt) {
        return res.status(400).send('Bad Request: "model" and "prompt" are required.');
      }

      let aiResponse: any = { message: `AI response for model: ${model} and prompt: "${prompt}"` };

      // Example: Simple "AI" response based on model
      switch (model) {
        case "gemini-pro":
          aiResponse.data = "This is a simulated response from Gemini Pro.";
          break;
        case "openai-gpt3.5":
          aiResponse.data = "This is a simulated response from OpenAI GPT-3.5.";
          break;
        default:
          aiResponse.data = "Unknown AI model.";
          break;
      }

      console.log(`AI request by ${decodedIdToken.uid} for project ${creativeProjectId}: Model: ${model}, Prompt: ${prompt}`);

      res.status(200).json(aiResponse);

    } catch (error) {
      console.error("Error in universalAI function:", error);
      res.status(500).send("Internal Server Error during AI processing.");
    }
  });
});


// --- Callable Functions ---

/**
 * Example Callable function: Get user role.
 * Client can call this using `firebase.functions().httpsCallable('getUserRole')()`
 */
export const getUserRole = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const uid = context.auth.uid;
  try {
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'User profile not found.');
    }
    const userData = userDoc.data();
    return { role: userData?.role || 'user' };
  } catch (error: any) {
    console.error("Error fetching user role:", error);
    throw new functions.https.HttpsError('internal', 'Unable to retrieve user role.', error.message);
  }
});


// --- Firestore Triggered Functions ---

/**
 * Firestore Trigger: On user creation, set a default role.
 */
export const assignDefaultUserRole = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    const newUser = snap.data();
    const userId = context.params.userId;

    if (newUser.role) {
      console.log(`User ${userId} already has role: ${newUser.role}`);
      return null;
    }

    try {
      await db.collection('users').doc(userId).update({
        role: 'user',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastLogin: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`Assigned default 'user' role to ${userId}`);
      return null;
    } catch (error) {
      console.error(`Error assigning default role to user ${userId}:`, error);
      return null;
    }
  });