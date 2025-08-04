import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
})
