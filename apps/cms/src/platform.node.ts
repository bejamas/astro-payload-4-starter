import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { sharpTransformer } from '@payloadcms/transformer-sharp';
import path from 'node:path';
import type { Config } from 'payload';
const appRoot = process.cwd();
export const platform = {
  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URL || 'file:./data/payload.db' },
    migrationDir: path.join(appRoot, 'src/migrations'),
  }),
  upload: {
    transformers: [
      sharpTransformer({
        collections: {
          media: {
            variants: [
              {
                name: 'card',
                width: 960,
                height: 720,
                formatOptions: { format: 'webp' },
              },
            ],
          },
        },
      }),
    ],
  },
} satisfies Pick<Config, 'db' | 'upload'>;
