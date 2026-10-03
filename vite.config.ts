import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { sitePlugin } from './scripts/vite-plugin-site'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), sitePlugin()],
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
