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
    dedupe: ['three', '@types/three'],
    alias: {
      'three': resolve(__dirname, 'node_modules/three'),
      '@wolffo/three-fire/react-tsl': resolve(__dirname, '../src/react-tsl.ts'),
      '@wolffo/three-fire/vanilla-tsl': resolve(__dirname, '../src/vanilla-tsl.ts'),
      '@wolffo/three-fire/react': resolve(__dirname, '../src/react.ts'),
      '@wolffo/three-fire/vanilla': resolve(__dirname, '../src/vanilla.ts'),
      '@wolffo/three-fire/tsl': resolve(__dirname, '../src/tsl.ts'),
      '@wolffo/three-fire': resolve(__dirname, '../src/index.ts')
    }
  },
  optimizeDeps: {
    include: ['three'],
    exclude: ['@wolffo/three-fire']
  }
})