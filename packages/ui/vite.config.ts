import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      'next/navigation': resolve(__dirname, './.storybook/mocks/next-navigation.ts'),
    },
  },
  css: {
    postcss: resolve(__dirname, '../../apps/web/postcss.config.js')
  }
});