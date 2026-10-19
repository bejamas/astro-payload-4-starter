import { cmsFetch } from '#runtime';
import { PayloadSDK } from '@payloadcms/sdk';
import type { Config, Media } from '@starter/content';

export const cmsURL = new URL(process.env.CMS_URL || 'http://localhost:3000')
  .origin;
export const siteURL = new URL(process.env.SITE_URL || 'http://localhost:4321')
  .origin;
export function createCMS(token?: string) {
  return new PayloadSDK<Config>({
    baseURL: `${cmsURL}/api`,
    baseInit: {
      cache: 'no-store',
      headers: token ? { Authorization: `JWT ${token}` } : {},
    },
    fetch: (url, init) =>
      cmsFetch(url, { ...init, signal: AbortSignal.timeout(15_000) }),
  });
}
export const cms = createCMS();
export async function getPage(slug: string, client = cms, draft = false) {
  const result = await client.find({
    collection: 'pages',
    limit: 1,
    depth: 1,
    draft,
    where: draft
      ? { slug: { equals: slug } }
      : {
          and: [
            { slug: { equals: slug } },
            { _status: { equals: 'published' } },
          ],
        },
  });
  return result.docs[0];
}
export async function getPost(slug: string, client = cms, draft = false) {
  const result = await client.find({
    collection: 'posts',
    limit: 1,
    depth: 1,
    draft,
    where: draft
      ? { slug: { equals: slug } }
      : {
          and: [
            { slug: { equals: slug } },
            { _status: { equals: 'published' } },
          ],
        },
  });
  return result.docs[0];
}
export function mediaImage(media: number | Media | null | undefined) {
  if (!media || typeof media === 'number') return undefined;
  const variant = media.variants?.card;
  const url = variant?.url || media.url;
  if (!url) return undefined;
  return {
    src: new URL(url, cmsURL).href,
    alt: media.alt,
    width: variant?.width || media.width || 1200,
    height: variant?.height || media.height || 900,
  };
}
export function safeHref(value: string) {
  if (/^\/(?!\/)/.test(value) && !value.includes('\\')) return value;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '#';
  } catch {
    return '#';
  }
}
export const dateLabel = (value: string) =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));
