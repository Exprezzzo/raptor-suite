import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure base path is correct for Firebase Hosting
  build: {
    outDir: 'dist', // Ensure output to 'dist' folder for Firebase Hosting
    sourcemap: false // Disable sourcemaps for production build (optional, saves space)
  },
  server: {
    port: 3000 // Port for local development server
  }
})