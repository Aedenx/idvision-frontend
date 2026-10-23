import {
  apiUrl,
  parseApiList,
  rewriteAssetUrl,
} from "@/lib/api-config";

const FETCH_HEADERS = {
  Accept: "application/json",
};

export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  cta_label: string;
  cta_link: string;
  sort_order: number;
  is_active: boolean;
}

function mapProduct(item: any) {
  const image = rewriteAssetUrl(
    item.image_url || item.image || item.image_path,
    "products",
  );

  return {
    id: item.product_id || item.id,
    product_id: item.product_id || item.id,
    name: item.name,
    slug: item.slug,
    sku: item.sku_base || item.sku,
    description: item.description,
    price: Number(item.base_price || item.price || 0),
    base_price: Number(item.base_price || item.price || 0),
    discount_percent: Number(item.discount_percent || 0),
    discount_price: item.discount_price ? Number(item.discount_price) : null,
    gender: item.category_name || "Unisex",
    category_name: item.category_name || "Unisex",
    category_slug: item.category_slug || "",
    image,
    image_url: image,
    stock: Number(item.total_stock || item.stock || 0),
    is_featured: Boolean(item.is_featured),
    average_rating: Number(item.average_rating || 0),
    total_reviews: Number(item.total_reviews || 0),
    variants: item.variants || [],
  };
}

export async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    return {
      site_name: "IDVISION",
      address: "Jl. Pahlawan No. 15, Magelang, Jawa Tengah 56111",
      phone: "0858-7766-9323",
      email: "support@idvision.com",
    };
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return {};
  }
}

export async function getBanners(): Promise<Banner[]> {
  try {
    const res = await fetch(apiUrl("banners/index.php"), {
      cache: "no-store",
      headers: FETCH_HEADERS,
    });
    if (!res.ok) return [];

    const result = await res.json();
    return parseApiList(result).map((item: any) => ({
      ...item,
      image: rewriteAssetUrl(item.image || item.image_url || item.image_path, "banners"),
    }));
  } catch (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
}

export async function getCategories() {
  try {
    const res = await fetch(apiUrl("categories/index.php"), {
      cache: "no-store",
      headers: FETCH_HEADERS,
    });
    if (!res.ok) return [];

    const result = await res.json();
    return parseApiList(result).map((cat: any) => ({
      ...cat,
      image_url: rewriteAssetUrl(
        cat.image_url || cat.image_path || cat.image,
        "categories",
        "",
      ),
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getProducts(params?: {
  category?: string;
  gender?: string;
  search?: string;
  sort?: string;
  material_id?: string;
  shape_id?: string;
  page?: number;
}) {
  try {
    const queryParams = new URLSearchParams();

    const categoryParam = params?.category || params?.gender;
    if (categoryParam) {
      queryParams.append("category", categoryParam.toLowerCase().trim());
    }

    if (params?.sort) {
      queryParams.append("sort", params.sort);
    }

    if (params?.search) {
      queryParams.append("search", params.search);
    }

    const qs = queryParams.toString();
    const url = `${apiUrl("products/index.php")}${qs ? `?${qs}` : ""}`;
    const res = await fetch(url, {
      cache: "no-store",
      headers: FETCH_HEADERS,
    });

    if (!res.ok) return { data: [] };

    const result = await res.json();
    const rawData = parseApiList(result);
    let mappedData = rawData.map(mapProduct);

    if (params?.search && Array.isArray(mappedData)) {
      let q = params.search.toLowerCase().trim();
      if (q === "anak" || q === "anak-anak") q = "kids";

      mappedData = mappedData.filter((p: any) => {
        const nameMatch = p.name ? p.name.toLowerCase().includes(q) : false;
        const skuMatch = p.sku ? p.sku.toLowerCase().includes(q) : false;
        const categoryMatch = p.category_name
          ? p.category_name.toLowerCase().includes(q)
          : false;
        const categorySlugMatch = p.category_slug
          ? p.category_slug.toLowerCase().includes(q)
          : false;
        const genderMatch = p.gender ? p.gender.toLowerCase().includes(q) : false;

        return (
          nameMatch || skuMatch || categoryMatch || categorySlugMatch || genderMatch
        );
      });
    }

    return { data: mappedData };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { data: [] };
  }
}
