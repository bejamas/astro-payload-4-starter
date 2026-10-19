import { proxyCMSRequest } from '#runtime';
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const proxied = proxyCMSRequest(context.request);
  if (proxied) return proxied;
  let response: Response;
  try {
    response = await next();
  } catch (error) {
    console.error('The site could not load content from Payload.', error);
    response = new Response(
      '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Temporarily unavailable</title><body style="font:1.2rem system-ui;max-width:40rem;margin:15vh auto;padding:2rem"><h1>Back in a moment.</h1><p>The notebook is temporarily unavailable. Please try again shortly.</p></body></html>',
      {
        status: 503,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Retry-After': '30',
        },
      },
    );
  }
  response.headers.set('Cache-Control', 'no-store');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (context.url.pathname.startsWith('/preview/'))
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
});
