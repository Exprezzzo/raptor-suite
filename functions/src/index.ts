// functions/src/index.ts - ULTRA-MINIMAL VERSION FOR DEPLOYMENT
import * as functions from 'firebase-functions';

// Just one simple HTTP function
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Raptor Suite is Live!");
});