import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './',
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3003,
    open: true,
    historyApiFallback: true,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
}); 