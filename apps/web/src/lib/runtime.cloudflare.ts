import { env } from 'cloudflare:workers';
export const cmsFetch: typeof fetch = (input, init) =>
  env.CMS.fetch(input, init);
export function proxyCMSRequest(
  request: Request,
): Promise<Response> | undefined {
  const pathname = new URL(request.url).pathname;
  if (
    ['/admin', '/api', '/assets', '/_serverFn'].some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
  )
    return env.CMS.fetch(request);
  return undefined;
}
