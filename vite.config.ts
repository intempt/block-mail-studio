
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Aggressively exclude dummy folder from all processing
  build: {
    rollupOptions: {
      external: (id) => {
        // Exclude any import that references dummy folder
        return id.includes('dummy/') || 
               id.startsWith('dummy/') || 
               id.includes('/dummy/') ||
               id.endsWith('/dummy') ||
               id === 'dummy';
      },
    }
  },
  // Completely exclude dummy folder from dependency optimization
  optimizeDeps: {
    exclude: ['dummy', 'dummy/**', 'dummy/*'],
  },
  // Define to help with module resolution
  define: {
    'process.env.EXCLUDE_DUMMY': 'true'
  },
  // Exclude dummy files from being watched
  esbuild: {
    exclude: ['dummy/**/*', 'dummy/*'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup/setupTests.ts'],
    css: true,
  },
}));
