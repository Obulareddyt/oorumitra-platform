import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
  preview: {
    port: 3000,
    allowedHosts: ['localhost', '.trycloudflare.com', '.tgvctechnologies.in'],
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
