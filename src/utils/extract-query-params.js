export function extractQueryParams(query) {
  return Object.fromEntries(new URLSearchParams(query).entries());
}
