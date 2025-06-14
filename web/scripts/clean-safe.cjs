// scripts/clean-safe.cjs
// This script is explicitly CommonJS (.cjs) to use require() and Node.js built-in modules.
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf'); // Using rimraf for robust deletion

const distPath = path.resolve(__dirname, '../dist');

function emptyDirectoryContents(dirPath, retries = 5, delay = 100) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory ${dirPath} does not exist. Creating...`);
    fs.mkdirSync(dirPath, { recursive: true });
    return;
  }

  console.log(`Starting aggressive clean of: ${dirPath}`);
  
  for (let i = 0; i < retries; i++) {
    try {
      // Use rimraf with aggressive options for Windows
      rimraf.sync(dirPath, {
        impl: 'windows', // Force Windows-specific deletion
        maxRetries: 5,   // Retries if locked
        retryDelay: 200, // Delay between retries for rimraf itself
        preserveRoot: false, // Allows deleting the root of the path
        glob: false // Treat path as literal, not a glob pattern
      });
      console.log(`Successfully deleted directory for re-creation: ${dirPath}`);
      break; // Successfully deleted, exit retry loop
    } catch (error) {
      // CORRECTED: Logical OR (||) is now correctly on a single line
      if (error.code === 'EPERM' || error.code === 'EBUSY' || error.code === 'ENOTEMPTY') {
        if (i === retries - 1) {
          console.warn(`Warning: Could not fully delete ${dirPath} after ${retries} attempts (Error: ${error.code}). Proceeding anyway by ensuring content is gone.`);
          // If outright deletion fails, try a desperate last-ditch attempt to empty contents
          try {
            const files = fs.readdirSync(dirPath);
            for (const file of files) {
              const filePath = path.join(dirPath, file);
              try {
                rimraf.sync(filePath, { impl: 'windows', maxRetries: 3, retryDelay: 100, preserveRoot: false, glob: false });
              } catch (e) {
                console.log(`Could not unlink file ${filePath}: ${e.message}`);
              }
            }
          } catch (e) {
            console.log(`Could not read directory contents ${dirPath}: ${e.message}`);
          }
        } else {
          console.log(`Retry ${i + 1}/${retries} for deleting ${dirPath} (Error: ${error.code})`);
          // Wait before retry using busy wait
          const waitTime = delay * Math.pow(2, i);
          const end = Date.now() + waitTime;
          while (Date.now() < end) { /* busy wait */ }
        }
      } else {
        // Re-throw other types of errors that rimraf couldn't handle
        console.error(`Unexpected error during clean process for ${dirPath}:`, error);
        throw error;
      }
    }
  }

  // Ensure the directory exists after attempted deletion (or content emptying)
  if (!fs.existsSync(dirPath)) {
    console.log(`Re-creating directory: ${dirPath}`);
    fs.mkdirSync(dirPath, { recursive: true });
  }
  console.log('Clean process completed.');
}

// Run the cleaning function for the dist path
emptyDirectoryContents(distPath);