import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/renderer/src/**/*.{test,spec}.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@renderer': resolve(__dirname, 'src/renderer/src'),
      '@/pages': resolve(__dirname, 'src/renderer/src/pages'),
      '@/components': resolve(__dirname, 'src/renderer/src/components'),
      '@/assets': resolve(__dirname, 'src/renderer/src/assets'),
    },
  },
})
