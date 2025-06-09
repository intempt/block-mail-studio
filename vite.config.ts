
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Completely bypass dummy folder imports
      'dummy': path.resolve(__dirname, './src/types/dummy-stub.ts')
    },
  },
  esbuild: {
    // Ignore TypeScript errors in dummy files
    include: /\.(ts|tsx)$/,
    exclude: [/dummy\/.*\.ts$/]
  },
  build: {
    rollupOptions: {
      external: (id) => {
        // Externalize all dummy imports
        return id.includes('dummy/') || id.startsWith('dummy/');
      }
    }
  }
})
