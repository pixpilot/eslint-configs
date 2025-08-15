import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    watch: false,
    environment: 'node',
    include: ['**/*.test.ts', 'test/**/*.test.ts', 'packages/**/test/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    coverage: {
      reporter: ['text-summary', 'json', 'html'],
      include: ['packages/*/src/**/*.ts'], // Match all src files in all packages
    },
  },
});
