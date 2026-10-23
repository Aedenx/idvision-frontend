const DEFAULT_BACKEND_ORIGIN = "https://idvisionbackend-i7l6ougq.b4a.run";

export function getBackendOrigin(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    DEFAULT_BACKEND_ORIGIN;

  return String(raw)
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/api$/i, "");
}

export function getApiBaseUrl(): string {
  return `${getBackendOrigin()}/api`;
}

export function apiUrl(path: string, query?: Record<string, string | number | undefined>): string {
  const clean = String(path || "").replace(/^\/+/, "");
  const url = `${getApiBaseUrl()}/${clean}`;

  if (!query) return url;

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

export function parseApiList(payload: unknown): any[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  const obj = payload as Record<string, unknown>;
  if (Array.isArray(obj.data)) return obj.data;
  if (Array.isArray(obj.products)) return obj.products;
  if (Array.isArray(obj.categories)) return obj.categories;
  if (Array.isArray(obj.banners)) return obj.banners;
  if (Array.isArray(obj.items)) return obj.items;
  if (Array.isArray(obj.reviews)) return obj.reviews;
  return [];
}

export function parseApiItem(payload: unknown): any | null {
  if (!payload || typeof payload !== "object") return null;

  const obj = payload as Record<string, any>;
  if (obj.data && !Array.isArray(obj.data) && typeof obj.data === "object") {
    return obj.data;
  }
  if (obj.product && typeof obj.product === "object") return obj.product;
  if (obj.product_id || obj.id || obj.slug) return obj;
  return null;
}

export function isApiSuccess(payload: unknown): boolean {
  if (!payload || typeof payload !== "object") return false;
  const obj = payload as Record<string, unknown>;
  return (
    obj.success === true ||
    obj.status === "success" ||
    obj.data !== undefined
  );
}

export function rewriteAssetUrl(
  value?: string | null,
  folder = "products",
  fallback = "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600",
): string {
  if (!value) return fallback;

  const origin = getBackendOrigin();
  let url = String(value).trim();

  url = url.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i, origin);
  url = url.replace(/\/idvision\/backend\/uploads\//i, "/uploads/");
  url = url.replace(/\/idvision\/uploads\//i, "/uploads/");
  url = url.replace(/\/backend\/uploads\//i, "/uploads/");
  url = url.replace(/^http:\/\/idvisionbackend-/i, "https://idvisionbackend-");

  if (/^https?:\/\//i.test(url) || url.startsWith("/")) {
    return url;
  }

  return `${origin}/uploads/${folder}/${url.replace(/^\//, "")}`;
}
