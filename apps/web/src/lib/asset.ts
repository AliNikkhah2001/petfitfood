/** Public URL under Vite `base` (e.g. `/` locally, `/petfitfood/` on GitHub Pages). */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL;
  const clean = path.replace(/^\//, "");
  return `${base}${clean}`;
}

/** Router basename without trailing slash (empty string at site root). */
export function routerBasename(): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return base || "";
}
