import type { APIRoute } from 'astro';
import { siteURL } from '@/lib/cms';

export const GET: APIRoute = () =>
  new Response(
    `User-agent: *\nAllow: /\nDisallow: /preview/\nSitemap: ${siteURL}/sitemap.xml\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
