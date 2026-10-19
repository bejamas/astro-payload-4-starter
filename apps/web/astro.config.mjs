// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import cloudflare from '@astrojs/cloudflare';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  output: 'server',
  adapter: process.env.CLOUDFLARE_BUILD
    ? cloudflare({ imageService: 'passthrough' })
    : node({ mode: 'standalone' }),
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
