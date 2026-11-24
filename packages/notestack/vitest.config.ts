import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    server: {
      deps: {
        // Fumadocs imports `next/navigation` without an extension, which only Next.js
        // and Vite resolve. Let Vite load Fumadocs so a test can import the whole package.
        inline: [/fumadocs-/],
      },
    },
  },
});
