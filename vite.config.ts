
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
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
    define: {
      'import.meta.env.VITE_NODE_ENV': JSON.stringify(mode),
      'import.meta.env.VITE_DEBUG_MODE': JSON.stringify(env.VITE_DEBUG_MODE || (mode === 'development' ? 'true' : 'false')),
      'import.meta.env.VITE_SHOW_COMPONENT_INFO': JSON.stringify(env.VITE_SHOW_COMPONENT_INFO || (mode === 'development' ? 'true' : 'false')),
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./tests/setup/setupTests.ts'],
      css: true,
    },
  };
});
