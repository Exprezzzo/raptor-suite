import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add a proxy here if you want to route /api calls to your functions locally during development
  // This is typically used to avoid CORS issues when backend is on a different domain/port.
  // However, since we're using direct Cloud Function URLs in useVoiceMode.js, this might not be strictly needed for functions.
  server: {
    proxy: {
      // Example proxy setup, uncomment if you were to use relative API paths
      // '/api': {
      //   target: 'http://localhost:5001/raptor-suite/us-central1', // Your Firebase Functions emulator URL
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, ''),
      // },
    },
  },
});