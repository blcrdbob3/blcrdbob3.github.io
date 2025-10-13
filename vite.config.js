import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        about: path.resolve(__dirname, 'about.html'),
        projects: path.resolve(__dirname, 'projects.html'),
        mechatronics: path.resolve(__dirname, 'projects/mechatronics.html'),
        introAI: path.resolve(__dirname, 'projects/intro-to-ai.html')
      }
    }
  }
});