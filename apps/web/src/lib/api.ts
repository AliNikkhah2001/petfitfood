import { PRODUCTS, type Product } from "../data/catalog";

const DEFAULT_BASE = "http://127.0.0.1:8000";

function apiBase(): string {
  const fromEnv = import.meta.env.VITE_API_BASE_URL;
  return typeof fromEnv === "string" && fromEnv.trim() ? fromEnv.trim() : DEFAULT_BASE;
}

export type ApiPage = {
  id: string;
  slug: string;
  title: string;
  body?: string;
};

export type ApiPost = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  body?: string;
  published_at?: string;
};

export type CreateOrderLine = {
  product_id: string;
  grams: number;
  qty: number;
  unit_price: number;
};

export type CreateOrderPayload = {
  customer_name: string;
  phone: string;
  address: string;
  note?: string;
  lines: CreateOrderLine[];
  total_toman: number;
};

export type ApiOrder = {
  id: string;
  status: string;
  customer_name: string;
  phone: string;
  address: string;
  note?: string;
  total_toman: number;
  created_at: string;
  lines?: CreateOrderLine[];
};

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 12_000);
  try {
    const res = await fetch(`${apiBase()}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
    if (!res.ok) {
      throw new Error(`API ${res.status}: ${path}`);
    }
    return (await res.json()) as T;
  } finally {
    window.clearTimeout(timer);
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const data = await fetchJson<Product[] | { results: Product[] }>("/api/v1/products/");
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object" && Array.isArray(data.results)) return data.results;
    return PRODUCTS;
  } catch {
    return PRODUCTS;
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const product = await fetchJson<Product>(`/api/v1/products/${encodeURIComponent(slug)}/`);
    return product ?? null;
  } catch {
    return PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
}

export async function getPages(): Promise<ApiPage[]> {
  try {
    const data = await fetchJson<ApiPage[] | { results: ApiPage[] }>("/api/v1/pages/");
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object" && Array.isArray(data.results)) return data.results;
    return [];
  } catch {
    return [];
  }
}

export async function getPosts(): Promise<ApiPost[]> {
  try {
    const data = await fetchJson<ApiPost[] | { results: ApiPost[] }>("/api/v1/posts/");
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object" && Array.isArray(data.results)) return data.results;
    return [];
  } catch {
    return [];
  }
}

export async function createOrder(payload: CreateOrderPayload): Promise<ApiOrder> {
  return fetchJson<ApiOrder>("/api/v1/orders/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getOrders(): Promise<ApiOrder[]> {
  try {
    const data = await fetchJson<ApiOrder[] | { results: ApiOrder[] }>("/api/v1/orders/");
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object" && Array.isArray(data.results)) return data.results;
    return [];
  } catch {
    return [];
  }
}
