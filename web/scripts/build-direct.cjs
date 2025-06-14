// scripts/build-direct.cjs
// This script is explicitly CommonJS (.cjs) to use require() and child_process.spawn.
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting direct build (no explicit pre-cleaning here)...');

const webpack = spawn('npx', [
  'cross-env',
  'NODE_ENV=production',
  'webpack',
  '--mode',
  'production',
  '--config',
  path.resolve(__dirname, '../webpack.config.js')
], {
  stdio: 'inherit', // Inherit stdio from parent process (show Webpack output)
  shell: true,     // Run command inside a shell
  cwd: path.resolve(__dirname, '..') // Set current working directory for webpack
});

webpack.on('close', (code) => {
  if (code !== 0) {
    console.error(`Build failed with code ${code}`);
    process.exit(code); // Exit with failure code if webpack failed
  } else {
    console.log('Build completed successfully!');
  }
});