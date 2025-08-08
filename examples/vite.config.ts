import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    dedupe: ['three', '@types/three', '@react-three/fiber', 'react', 'react-dom'],
    alias: {
      'three': resolve(__dirname, 'node_modules/three'),
      '@react-three/fiber': resolve(__dirname, 'node_modules/@react-three/fiber'),
      '@wolffo/three-fire/react': resolve(__dirname, '../src/react.ts'),
      '@wolffo/three-fire/vanilla': resolve(__dirname, '../src/vanilla.ts'),
      '@wolffo/three-fire': resolve(__dirname, '../src/react.ts') // Use react version for examples
    }
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei', 'react', 'react-dom'],
    exclude: ['@wolffo/three-fire']
  },
  build: {
    commonjsOptions: {
      include: [/three/, /node_modules/]
    },
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          three: ['three'],
          fiber: ['@react-three/fiber', '@react-three/drei']
        }
      }
    }
  }
})
