// raptor-suite/web/vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Specify the root directory for the project, relative to where vite.config.js is.
  // In this case, 'web' is the root of our web app.
  root: './',
  build: {
    // Output directory for production build, relative to 'root'.
    outDir: 'dist',
    // Empty the output directory before building.
    emptyOutDir: true,
  },
  server: {
    // Configure the development server
    port: 5173, // Standard Vite dev server port
    open: true, // Open browser automatically on server start
  },
  define: {
    // Define process.env for client-side environment variables if needed
    // This is often used for Firebase config or other public keys
    // For sensitive keys, use Firebase Functions env or server-side rendering
    'process.env': {} // Placeholder, populate as needed.
  }
});