import { asset } from "./asset";

function apiOrigin(): string {
  const fromEnv = import.meta.env.VITE_API_BASE_URL;
  if (typeof fromEnv === "string") {
    const trimmed = fromEnv.trim();
    if (trimmed === "") return "";
    return trimmed.replace(/\/$/, "");
  }
  if (import.meta.env.VITE_ROUTER_BASE || import.meta.env.BASE_URL !== "/") {
    return "";
  }
  return "http://127.0.0.1:8000";
}

/** Resolve CMS media (/media/…) or local public paths for <img src>. */
export function mediaUrl(path: string | undefined | null): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/media/")) {
    const origin = apiOrigin();
    return origin ? `${origin}${path}` : "";
  }
  return asset(path);
}
