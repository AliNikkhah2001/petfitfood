import { PRODUCTS, type Product } from "../data/catalog";

const DEFAULT_BASE = "http://127.0.0.1:8000";
const AUTH_TOKEN_KEY = "petfit-auth-token";

function apiBase(): string {
  const fromEnv = import.meta.env.VITE_API_BASE_URL;
  // Explicit empty disables API (e.g. static GitHub Pages build).
  if (typeof fromEnv === "string") {
    const trimmed = fromEnv.trim();
    if (trimmed === "") return "";
    return trimmed;
  }
  // Static hosting without a CMS — use catalog fallback only.
  if (import.meta.env.BASE_URL !== "/") return "";
  return DEFAULT_BASE;
}

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch {
    /* ignore quota */
  }
}

export function clearAuthToken(): void {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export type ApiCustomer = {
  id?: string;
  phone: string;
  name?: string;
  city?: string;
  address?: string;
  postal_code?: string;
  is_admin?: boolean;
};

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
  city?: string;
  postal_code?: string;
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
  city?: string;
  postal_code?: string;
  note?: string;
  total_toman: number;
  cost_toman?: number;
  profit_toman?: number;
  created_at: string;
  lines?: CreateOrderLine[];
};

export type IngredientPlanRow = {
  slug: string;
  name_fa: string;
  need_kg: number;
  stock_kg: number;
  shortfall_kg: number;
  cost_per_kg_toman: number;
  planned_spend_toman: number;
};

export type AdminStats = {
  orders_count: number;
  revenue_toman: number;
  spent_toman: number;
  net_profit_toman: number;
  open_orders_count: number;
  ingredient_plan_spend_toman: number;
  by_status: Record<string, number>;
  ingredient_plan: IngredientPlanRow[];
};

export type OtpRequestResponse = {
  ok: boolean;
  phone: string;
  debug_code?: string;
};

export type OtpVerifyResponse = {
  token: string;
  customer: ApiCustomer;
};

export type UpdateMePayload = Partial<
  Pick<ApiCustomer, "name" | "city" | "address" | "postal_code">
>;

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const base = apiBase();
  if (!base) {
    throw new Error("API unavailable");
  }
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 12_000);
  try {
    const res = await fetch(`${base}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...authHeaders(),
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

function unwrapList<T>(data: T[] | { results: T[] }): T[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray((data as { results: T[] }).results)) {
    return (data as { results: T[] }).results;
  }
  return [];
}

export async function requestOtp(phone: string): Promise<OtpRequestResponse> {
  return fetchJson<OtpRequestResponse>("/api/v1/auth/otp/request/", {
    method: "POST",
    body: JSON.stringify({ phone }),
  });
}

export async function verifyOtp(
  phone: string,
  code: string,
  name?: string,
): Promise<OtpVerifyResponse> {
  return fetchJson<OtpVerifyResponse>("/api/v1/auth/otp/verify/", {
    method: "POST",
    body: JSON.stringify({ phone, code, ...(name ? { name } : {}) }),
  });
}

export async function getMe(): Promise<ApiCustomer> {
  return fetchJson<ApiCustomer>("/api/v1/auth/me/");
}

export async function updateMe(payload: UpdateMePayload): Promise<ApiCustomer> {
  return fetchJson<ApiCustomer>("/api/v1/auth/me/", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function getProducts(): Promise<Product[]> {
  try {
    const data = await fetchJson<Product[] | { results: Product[] }>("/api/v1/products/");
    const list = unwrapList(data);
    return list.length ? list : PRODUCTS;
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
    return unwrapList(data);
  } catch {
    return [];
  }
}

export async function getPosts(): Promise<ApiPost[]> {
  try {
    const data = await fetchJson<ApiPost[] | { results: ApiPost[] }>("/api/v1/posts/");
    return unwrapList(data);
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
    return unwrapList(data);
  } catch {
    return [];
  }
}

export type OrderStatus = "new" | "confirmed" | "shipped" | "cancelled";

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<ApiOrder> {
  return fetchJson<ApiOrder>(`/api/v1/orders/${encodeURIComponent(id)}/`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function getAdminStats(): Promise<AdminStats> {
  return fetchJson<AdminStats>("/api/v1/admin/stats/");
}
