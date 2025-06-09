import { defineConfig } from 'vite'

export default defineConfig({
  // ...outros configs
  server: {
    host: true,
    allowedHosts: ['kanban.flavio.space'],
  },
});