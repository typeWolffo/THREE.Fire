import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    open: true
  },
  resolve: {
    dedupe: ['three', '@types/three']
  },
  optimizeDeps: {
    include: ['three'],
    exclude: ['@wolffo/three-fire']
  }
})