import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './',
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
}); 