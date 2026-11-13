/**
 * Public URL under Vite `base`.
 * Locally: `/…`. On GitHub Pages, vite-plugin-singlefile may rewrite BASE_URL to `./`,
 * so prefer VITE_ROUTER_BASE for absolute asset roots when set.
 */
export function asset(path: string): string {
  const clean = path.replace(/^\//, "");
  const routerBase = import.meta.env.VITE_ROUTER_BASE;
  if (typeof routerBase === "string" && routerBase.trim()) {
    const root = routerBase.trim().endsWith("/")
      ? routerBase.trim()
      : `${routerBase.trim()}/`;
    return `${root}${clean}`;
  }
  const base = import.meta.env.BASE_URL;
  return `${base}${clean}`;
}

/** Router basename without trailing slash (empty string at site root). */
export function routerBasename(): string {
  // vite-plugin-singlefile rewrites import.meta.env.BASE_URL to "./" — do not use that as basename.
  const explicit = import.meta.env.VITE_ROUTER_BASE;
  if (typeof explicit === "string" && explicit.trim()) {
    return explicit.trim().replace(/\/$/, "");
  }
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  if (!base || base === "." || base === "./") return "";
  return base;
}
