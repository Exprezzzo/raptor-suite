// C:\Users\Owner\OneDrive\Desktop\raptor-suite\mobile\metro.config.js

const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for @react-native-firebase modules
config.resolver.extraNodeModules = {
  'react-native-firebase': path.resolve(__dirname, 'node_modules/@react-native-firebase'),
};

// Ensure all @react-native-firebase modules are symlinked and correctly resolved
// This part is crucial for making the native modules work properly
config.resolver.nodeModulesPaths = [
  path.resolve(path.join(__dirname, 'node_modules')),
  path.resolve(path.join(__dirname, '../../node_modules')), // Adjust if your monorepo structure is different
];

// Workaround for direct module imports from common/index.js if needed (less common with recent SDKs)
// You might not need this if the above fixes it, but keeping it here for advanced cases.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('@react-native-firebase/') && moduleName.includes('/common/index.js')) {
    return context.resolveRequest(context, moduleName.replace('/common/index.js', '/lib/common/index.js'), platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;