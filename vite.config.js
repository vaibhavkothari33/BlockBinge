import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'web3': 'web3/dist/web3.min.js',
    }
  },
  define: {
    'process.env': {},
    global: {}
  },
  server: {
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api/langflow': {
        target: 'https://api.langflow.astra.datastax.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/langflow/, '')
      }
    }
  },
})