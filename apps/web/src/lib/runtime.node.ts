export const cmsFetch: typeof fetch = (input, init) => fetch(input, init);
export function proxyCMSRequest(
  _request: Request,
): Promise<Response> | undefined {
  return undefined;
}
