
import { defineConfig } from 'vitest/config';
import { mergeConfig } from 'vite';
import viteConfig from '../vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./setup/setupTests.ts'],
      css: true,
      coverage: {
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'tests/',
          '**/*.d.ts',
          '**/*.config.{js,ts}',
          'src/main.tsx',
          'src/vite-env.d.ts'
        ]
      }
    }
  })
);
