import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// base: './' → relative asset paths so a dumb static server can serve dist/.
export default defineConfig({
  base: './',
  plugins: [svelte()],
  // $glyphs → the shared mark resolver (toolkits/glyphs). One alias, no copy.
  resolve: {
    alias: {
      $glyphs: path.resolve(__dirname, '../../../toolkits/glyphs/dist/glyphs.js'),
    },
  },
});
