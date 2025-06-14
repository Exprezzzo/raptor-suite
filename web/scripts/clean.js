import fs from 'fs'; // Use ES Module import
import path from 'path'; // Use ES Module import
import { fileURLToPath } from 'url'; // For __dirname equivalent

// Import rimraf dynamically as it's a CommonJS module
// This is a workaround for using CommonJS modules in ES Module scope
// Alternatively, ensure rimraf is installed globally or use a.cjs extension for this script
const rimraf = require('rimraf'); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.resolve(__dirname, '../dist');

function deleteRecursiveWithRimraf(dirPath, retries = 5, delay = 100) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory not found, no cleaning needed: ${dirPath}`);
    return;
  }

  for (let i = 0; i < retries; i++) {
    try {
      // Use rimraf with aggressive options for Windows
      rimraf.sync(dirPath, {
        impl: 'windows',
        maxRetries: 5, // Increased retries
        retryDelay: 200, // Increased delay
        preserveRoot: false, // Allow deleting the root of the path
        glob: false // Treat path as literal
      });
      console.log(`Successfully cleaned: ${dirPath}`);
      return;
    } catch (error) {
      // CORRECTED: Logical OR (||) is now correctly on a single line
      if (error.code === 'EPERM' |
| error.code === 'EBUSY' |
| error.code === 'ENOTEMPTY') {
        if (i === retries - 1) {
          console.warn(`Warning: Could not fully clean ${dirPath} after ${retries} attempts. Proceeding anyway...`);
        } else {
          console.log(`Retry ${i + 1}/${retries} for cleaning ${dirPath} (Error: ${error.code})`);
          const waitTime = delay * Math.pow(2, i);
          const end = Date.now() + waitTime;
          while (Date.now() < end) { /* busy wait */ }
        }
      } else {
        console.error(`Unexpected error during clean process for ${dirPath}:`, error);
        throw error;
      }
    }
  }
}

console.log('Starting custom clean process with rimraf...');
deleteRecursiveWithRimraf(distPath);
console.log('Custom clean process completed.');