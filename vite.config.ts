/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import { coverageConfigDefaults } from 'vitest/config'
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests',
    coverage: {
      ...coverageConfigDefaults,
      exclude: [...coverageConfigDefaults.exclude, '**/index.ts']
    }
  }
});
