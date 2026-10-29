import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

// BASE_PATH задаётся в GitHub Actions как /<имя-репозитория>/.
// Локально и в кастомном домене — '/'.
const basePath = process.env.BASE_PATH || '/';

export default defineConfig({
  plugins: [
    react(),
    {
      // GitHub Pages отдаёт 404.html для неизвестных адресов.
      // Копия index.html позволяет открывать /tours, /contacts и т.д.
      // напрямую — без «#» в URL.
      name: 'spa-404-fallback',
      apply: 'build',
      closeBundle() {
        copyFileSync(resolve('dist/index.html'), resolve('dist/404.html'));
      },
    },
  ],
  base: basePath,
  server: { port: 5173, open: true },
  build: { outDir: 'dist', sourcemap: false },
});
