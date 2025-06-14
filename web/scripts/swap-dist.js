import fs from 'fs'; // Use ES Module import
import path from 'path'; // Use ES Module import
import { fileURLToPath } from 'url'; // For __dirname equivalent

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.resolve(__dirname, '../dist');
const distNewPath = path.resolve(__dirname, '../dist-new');
const distOldPath = path.resolve(__dirname, '../dist-old');

console.log('Swapping distribution folders...');

try {
  // If dist exists, rename it to dist-old
  if (fs.existsSync(distPath)) {
    if (fs.existsSync(distOldPath)) {
      fs.rmSync(distOldPath, { recursive: true, force: true });
    }
    fs.renameSync(distPath, distOldPath);
  }
  
  // Rename dist-new to dist
  if (fs.existsSync(distNewPath)) {
    fs.renameSync(distNewPath, distPath);
    console.log('Successfully swapped dist folders');
  }
  
  // Clean up old dist
  setTimeout(() => {
    if (fs.existsSync(distOldPath)) {
      try {
        fs.rmSync(distOldPath, { recursive: true, force: true });
        console.log('Cleaned up old dist folder');
      } catch (e) {
        console.log('Could not clean old dist folder - will retry on next build');
      }
    }
  }, 1000);
  
} catch (error) {
  console.error('Error swapping folders:', error);
  process.exit(1);
}