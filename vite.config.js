import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@admin': path.resolve(__dirname, './admin_hotel/src'),
    },
    // Prevent Vite from treating admin_hotel as a package
    dedupe: [],
  },
  // Exclude admin_hotel from being treated as a package
  optimizeDeps: {
    exclude: ['admin_hotel'],
    esbuildOptions: {
      // Fix potential esbuild issues
      target: 'es2020',
      supported: {
        'top-level-await': true,
      },
    },
  },
  // Esbuild configuration
  esbuild: {
    target: 'es2020',
    format: 'esm',
  },
  server: {
    port: 3000,
    fs: {
      // Allow serving files from admin_hotel
      allow: ['..'],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/images': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})