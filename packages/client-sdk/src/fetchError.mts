/**
 * Custom error class for fetch errors
 *
 * @example
 * (async () => {
 *   try {
 *     const response = await FetchError.fetchOk('https://api.example.com/data');
 *     const data = await response.json();
 *     console.log(data);
 *   } catch (error) {
 *     if (error instanceof FetchError) {
 *       console.error(`Fetch failed: ${error.message}`);
 *     } else {
 *       console.error('An unexpected error occurred:', error);
 *     }
 *   }
 * })();
 */
export class FetchError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly request: { url: string } & RequestInit,
    public readonly response?: Response,
    public readonly details?: ErrorOptions,
  ) {
    super(`FetchError: ${status} ${statusText}`, details);
    this.name = "FetchError";
  }

  // Static method to assert response.ok and throw if false
  static assert(url: string, request: RequestInit | undefined, response: Response): Response {
    if (!response.ok) {
      throw new FetchError(response.status, response.statusText, { url, ...request }, response);
    }
    return response;
  }

  // Static method to call fetch and perform assertion
  static async fetchOk(url: string, request?: RequestInit): Promise<Response> {
    return FetchError.assert(
      url,
      request,
      await fetch(url, request).catch((error) => {
        throw new FetchError(0, error.message, { url, ...request }, undefined, { cause: error });
      }),
    );
  }
}
