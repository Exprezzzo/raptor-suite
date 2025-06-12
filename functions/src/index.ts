// RAPTOR SUITE - Firebase Functions Index
// File: /functions/src/index.ts

import * as admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    initializeApp();
}

// Import and re-export your functions here
// This makes them available for deployment
// export { universalAI } from './universalAI'; // universalAI should be commented out
export { voiceModeHandler } from './voiceMode'; // voiceModeHandler should NOT be commented out
// You might also export functions related to voiceSessionManager if they become callable HTTP
// For now, voiceSessionManager functions are called internally or by voiceModeHandler.