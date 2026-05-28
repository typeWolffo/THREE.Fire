import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

const src = (p: string) => fileURLToPath(new URL(`../src/${p}`, import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Dedupe so the aliased ../src resolves these from examples/node_modules.
    // Netlify installs only the examples deps (no repo-root node_modules), and
    // since the library marks react/@react-three/fiber as OPTIONAL peers, Vite
    // would otherwise stub them ("__vite-optional-peer-dep") and the build fails
    // with "useFrame is not exported by @react-three/fiber".
    dedupe: ['three', '@react-three/fiber', 'react', 'react-dom'],
    alias: [
      { find: '@wolffo/three-fire/tsl/react', replacement: src('tsl/react.ts') },
      { find: '@wolffo/three-fire/tsl/vanilla', replacement: src('tsl/vanilla.ts') },
      { find: '@wolffo/three-fire/tsl', replacement: src('tsl/index.ts') },
      { find: '@wolffo/three-fire/react', replacement: src('react.ts') },
      { find: '@wolffo/three-fire/vanilla', replacement: src('vanilla.ts') },
      { find: '@wolffo/three-fire', replacement: src('index.ts') },
    ],
  },
  optimizeDeps: {
    include: ['three', 'three/webgpu', 'three/tsl'],
  },
  server: {
    port: 3000,
    open: true,
  },
})
