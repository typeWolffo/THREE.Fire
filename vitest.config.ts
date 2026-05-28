import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    setupFiles: ['./test/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      exclude: ['examples/**', 'test/**', 'dist/**'],
      reporter: ['text', 'html', 'lcov'],
      // FireShaderTSL's node-graph closures only execute when a WebGPU backend
      // compiles the shader, so their bodies aren't line-coverable without a GPU.
      // Thresholds sit safely below current coverage to guard against regressions.
      thresholds: {
        lines: 80,
        statements: 80,
        functions: 85,
        branches: 75
      }
    }
  },
  esbuild: {
    target: 'node14'
  }
})
