import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '^/(auth|clientes|fornecedores|pratos|avaliacoes|blog|admin|pedidos|upload|api)': {
        target: 'http://localhost:3333',
        changeOrigin: true,
      },
    }
  }
})
