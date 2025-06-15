// functions/src/index.ts

// Always use strict mode for better code quality
// This file will be compiled into functions/lib/index.js

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors'; // Import cors for HTTP functions

// Initialize the Firebase Admin SDK
admin.initializeApp();

// Create a CORS handler
const corsHandler = cors({ origin: true }); // Allows all origins; restrict for production

// 1. HTTP Callable Function: helloWorld
// This is a basic HTTP-triggered function accessible via a URL.
exports.helloWorld = functions.https.onRequest((request, response) => {
  corsHandler(request, response, () => {
    response.send("Hello from Firebase Functions!");
  });
});

// 2. HTTP Callable Function: universalAPI (Actual implementation will be in ./universalAI)
// This exports the actual universalAI callable function from a separate file.
export { universalAI } from './universalAI';

// 3. HTTP Callable Function: getUserRole (Simplified version for compilation)
// This function is also a callable endpoint.
exports.getUserRole = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new new functions.https.HttpsError('unauthenticated', 'Authentication required to get user role.');
  }
  const userId = context.auth.uid;
  // In a real app, you'd fetch the user's role from Firestore or custom claims
  console.log(`Getting role for user: ${userId}`);
  return { role: 'defaultUser', userId: userId }; // Mock role for now
});

// 4. HTTP Callable Function: assignDefaultUserRole (Simplified for compilation)
// This function demonstrates updating user roles, likely via custom claims.
exports.assignDefaultUserRole = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.token.admin) { // Example: check if user is admin
    throw new new functions.https.HttpsError('permission-denied', 'Admin access required to assign roles.');
  }
  const targetUserId = data.userId;
  const roleToAssign = data.role;
  if (!targetUserId || !roleToAssign) {
    throw new new functions.https.HttpsError('invalid-argument', 'User ID and role are required.');
  }
  try {
    await admin.auth().setCustomUserClaims(targetUserId, { role: roleToAssign });
    return { status: 'success', message: `Role ${roleToAssign} assigned to user ${targetUserId}` };
  } catch (error) {
    console.error("Error assigning role:", error);
    throw new new functions.https.HttpsError('internal', 'Failed to assign role.', error);
  }
});

// 5. Firestore Trigger (Example: onCreate for 'users/{userId}')
// This function will run whenever a new document is created in the 'users' collection.
// Note: This is for v1 compatible syntax.
exports.onUserCreate = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snapshot, context) => {
    const userData = snapshot.data();
    const userId = context.params.userId;
    console.log(`New user created: ${userId}`, userData);
    return null;
  });

// Export all functions from voiceMode.ts
export * from './voiceMode';