import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../backend/dist/public',
    emptyOutDir: true,
  },
  server: {
    host: true,
    allowedHosts: ['kanban.flavio.space'],
    proxy: {
      '/op': 'http://localhost:3001',
      '/webhook': 'http://localhost:3001'
    }
  },
});