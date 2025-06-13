// raptor-suite/shared/config.js

// This file contains shared configuration settings for the Raptor Suite application.
// Sensitive API keys should ideally be stored in Firebase Functions environment config
// or securely fetched at runtime, not hardcoded here for client-side use.

const config = {
  // Firebase Project ID (can be fetched from Firebase config but good to have a constant)
  firebaseProjectId: 'raptor-suite',

  // Google Cloud Project ID (often same as firebaseProjectId)
  gcpProjectId: 'raptor-suite',

  // Firebase Hosting URL (live web app URL)
  webAppUrl: 'https://raptor-suite.web.app',

  // Package name for Android mobile app
  mobilePackageName: 'com.raptorsuite.mobile',

  // Cloud Function URL for Universal AI Router
  universalAiRouterUrl: 'https://us-central1-raptor-suite.cloudfunctions.net/universalAI',

  // Default project settings
  defaultProjectSettings: {
    isPublic: false,
    maxMembers: 10,
    storageLimitGB: 5
  },

  // Subscription plan details (basic structure, actual pricing and tiers
  // would often be managed in a database or through a billing provider API)
  subscriptionPlans: {
    free: {
      name: 'Free Tier',
      pricePerMonth: 0,
      features: ['Basic collaboration', '1 project', '100MB storage']
    },
    standard: {
      name: 'Standard',
      pricePerMonth: 9.99,
      features: ['Enhanced collaboration', '5 projects', '5GB storage', 'Priority support']
    },
    premium: {
      name: 'Premium',
      pricePerMonth: 19.99,
      features: ['Unlimited projects', '50GB storage', 'Advanced AI features', 'Dedicated support']
    }
  },

  // Add any other shared constants here
};

module.exports = config;