import { FetchError } from "./fetchError.mjs";

/**
 * Fetches a URL and returns the response as a promise
 *
 * @param url The URL to fetch
 * @param request The request options
 * @returns A promise that resolves to the response { data: json(); status }
 * @throws {FetchError} If the response status is not OK
 */
export async function sdkFetch<TResult extends { data: unknown; status: number }>(
  url: string,
  request: RequestInit & { baseUrl?: string },
): Promise<TResult> {
  let fullUrl = url;
  if (url.startsWith("/")) {
    fullUrl = new URL(url.substring(1), request.baseUrl).toString(); // Validate the URL
  }

  const response = await FetchError.fetchOk(fullUrl, request);
  return Promise.resolve({
    data: response.status === 204 ? null : await response.json(),
    status: response.status,
  }) as unknown as TResult;
}
