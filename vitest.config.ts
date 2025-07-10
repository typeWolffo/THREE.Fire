import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    setupFiles: ['./test/setup.ts'],
    globals: true,
    coverage: {
      include: ['src/**'],
      exclude: ['examples/**', 'test/**', 'dist/**'],
      reporter: ['text', 'html', 'lcov']
    }
  },
  esbuild: {
    target: 'node14'
  }
})
