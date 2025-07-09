import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@wolffo/three-fire': '../src'
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
