export async function sdkFetch<TResult>(url: string, request: RequestInit): TResult {
  console.log(`Fetching ${url}`, request);
  return {} as TResult;
}
