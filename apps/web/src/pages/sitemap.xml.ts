import type { APIRoute } from 'astro';
import { cms, siteURL } from '@/lib/cms';

async function entries(collection: 'pages' | 'posts') {
  const items: { path: string; updatedAt: string }[] = [];
  let page = 1;
  let hasNextPage = true;
  while (hasNextPage) {
    const result = await cms.find({
      collection,
      page,
      limit: 100,
      depth: 0,
      where: { _status: { equals: 'published' } },
    });
    items.push(
      ...result.docs.map((doc) => ({
        path:
          collection === 'posts'
            ? `/journal/${doc.slug}`
            : doc.slug === 'home'
              ? '/'
              : `/${doc.slug}`,
        updatedAt: doc.updatedAt,
      })),
    );
    hasNextPage = result.hasNextPage;
    page++;
  }
  return items;
}
export const GET: APIRoute = async () => {
  const [pages, posts] = await Promise.all([
    entries('pages'),
    entries('posts'),
  ]);
  const urls = [{ path: '/journal', updatedAt: undefined }, ...pages, ...posts];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((item) => `<url><loc>${new URL(item.path, siteURL).href}</loc>${item.updatedAt ? `<lastmod>${new Date(item.updatedAt).toISOString()}</lastmod>` : ''}</url>`).join('')}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
