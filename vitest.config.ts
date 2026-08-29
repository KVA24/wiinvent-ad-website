import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
      {
        find: /^next\/navigation$/,
        replacement: path.resolve(__dirname, './src/test/next-navigation.ts'),
      },
      {
        find: /^next\/link$/,
        replacement: path.resolve(__dirname, './src/test/next-link.ts'),
      },
    ],
  },
})
