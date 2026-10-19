import { env } from 'cloudflare:workers';
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite';
import { r2Storage } from '@payloadcms/storage-r2';
import type { Config } from 'payload';

export const platform = {
  db: sqliteD1Adapter({ binding: env.D1, push: false }),
  storage: [r2Storage({ bucket: env.MEDIA, collections: { media: true } })],
} satisfies Pick<Config, 'db' | 'storage'>;
