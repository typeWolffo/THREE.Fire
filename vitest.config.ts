import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    setupFiles: ['./test/setup.ts'],
    globals: true,
    coverage: {
      provider: 'istanbul',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['examples/**', 'test/**', 'dist/**'],
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        lines: 70,
        statements: 70,
        functions: 85,
        branches: 90
      }
    }
  }
})
