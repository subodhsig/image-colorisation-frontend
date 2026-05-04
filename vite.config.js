import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Use '/' locally, '/frontend/' only in production (for GitHub Pages)
  base: mode === 'production' ? '/frontend/' : '/',
  server: {
    port: 5173,
    strictPort: true,
    watch: {
      ignored: (path) =>
        path.endsWith('/src/index.css') || path.endsWith('/src/App.css'),
    },
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
  },
}));
