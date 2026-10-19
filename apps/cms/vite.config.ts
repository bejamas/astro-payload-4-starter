import { withPayload } from '@payloadcms/tanstack-start';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import rsc from '@vitejs/plugin-rsc';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig(
  withPayload(
    ({ pluginOptions }) => ({
      plugins: [
        rsc(pluginOptions.rsc),
        tanstackStart(pluginOptions.tanstackStart),
        viteReact(pluginOptions.react),
      ],
      ssr: { external: ['cloudflare:workers'] },
      environments: {
        rsc: { build: { rollupOptions: { external: ['cloudflare:workers'] } } },
        ssr: { build: { rollupOptions: { external: ['cloudflare:workers'] } } },
      },
      resolve: {
        alias: {
          '@/': fileURLToPath(new URL('./src/', import.meta.url)),
          ...(process.env.CLOUDFLARE_BUILD
            ? {
                '#platform': fileURLToPath(
                  new URL('./src/platform.cloudflare.ts', import.meta.url),
                ),
              }
            : {}),
        },
      },
      server: {
        port:
          Number(
            new URL(process.env.CMS_URL || 'http://localhost:3000').port,
          ) || 3000,
        strictPort: true,
      },
    }),
    {
      payloadConfigPath: fileURLToPath(
        new URL('./src/payload.config.ts', import.meta.url),
      ),
    },
  ),
);
