import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// BASE_PATH задаётся в GitHub Actions как /<имя-репозитория>/.
// Локально и в кастомном домене — '/'.
const basePath = process.env.BASE_PATH || '/';

export default defineConfig({
  plugins: [react()],
  base: basePath,
  server: { port: 5173, open: true },
  build: { outDir: 'dist', sourcemap: false },
});
