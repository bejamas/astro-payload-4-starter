// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  server: {
    port:
      Number(new URL(process.env.SITE_URL || 'http://localhost:4321').port) ||
      4321,
  },
  integrations: [],
  vite: {
    plugins: [tailwindcss()],
  },
});
