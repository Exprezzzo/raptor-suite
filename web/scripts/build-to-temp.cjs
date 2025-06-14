// scripts/build-to-temp.cjs
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const tempDir = path.resolve(__dirname, `../dist-temp-${Date.now()}`);
const finalDir = path.resolve(__dirname, '../dist');

console.log('Building to temporary directory...');

try {
  // Build to temp directory
  execSync(`npx cross-env NODE_ENV=production webpack --mode production --output-path "${tempDir}"`, {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
  
  console.log('Build successful! Moving files...');
  
  // Create dist if it doesn't exist
  if (!fs.existsSync(finalDir)) {
    fs.mkdirSync(finalDir, { recursive: true });
  }
  
  // Copy files from temp to dist (overwriting)
  const copyRecursive = (src, dest) => {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      fs.readdirSync(src).forEach(file => {
        copyRecursive(path.join(src, file), path.join(dest, file));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  };
  
  copyRecursive(tempDir, finalDir);
  
  // Try to clean up temp directory (don't fail if we can't)
  setTimeout(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
      console.log('Cleaned up temp directory');
    } catch (e) {
      console.log('Could not clean temp directory - manual cleanup may be needed');
    }
  }, 1000);
  
  console.log('Build completed successfully!');
  console.log(`Output directory: ${finalDir}`);
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}