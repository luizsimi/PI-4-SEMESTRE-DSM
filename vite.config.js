import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redireciona todas as chamadas para /api do front para o Laravel
      '/api': 'http://127.0.0.1:8000',
    }
  }
})
