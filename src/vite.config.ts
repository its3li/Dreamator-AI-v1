import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import postcssConfig from './postcss.config.cjs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: postcssConfig,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});