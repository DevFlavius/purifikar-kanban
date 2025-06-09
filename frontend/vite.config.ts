import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // ...outros configs
  server: {
    host: true,
    allowedHosts: ['kanban.flavio.space'],
  },
});