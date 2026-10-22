"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  RefreshCw,
  Star,
  ArrowRight,
  Sparkles,
  Award,
  Tag,
} from "lucide-react";
import RunningText from "@/components/home/running-text";
import HeroSlider from "@/components/layout/hero-slider";
import ProductCard from "@/components/product/product-card";

// URL Base Backend (Mendukung Localhost Laragon & Env Variable)
const getApiBaseUrl = () => {
  const envUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.startsWith("http")) {
    return envUrl.replace(/\/+$/, "");
  }
  return "https://idvisionbackend-i7l6ougq.b4a.run/api";
};

export default function HomePage() {
  const [promoProducts, setPromoProducts] = useState<any[]>([]);
  const [popularProducts, setPopularProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseUrl = getApiBaseUrl();

    // 1. Fetch Produk dari Backend PHP Localhost
    fetch(`${baseUrl}/products/index.php`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData && resData.data) {
          const allProducts = resData.data;

          const promo = allProducts
            .filter((p: any) => Number(p.discount_percent || 0) > 0)
            .slice(0, 4);

          const popular = allProducts.slice(0, 4);

          setPromoProducts(promo.length > 0 ? promo : allProducts.slice(0, 4));
          setPopularProducts(popular);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil produk:", err);
        setLoading(false);
      });

    // 2. Fetch Kategori dari Backend PHP Localhost
    fetch(`${baseUrl}/categories/index.php`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData && resData.data) {
          setCategories(resData.data);
        }
      })
      .catch((err) => console.error("Gagal mengambil kategori:", err));
  }, []);

  // Ambil URL Gambar Kategori dari Backend Laragon
  const getCategoryImage = (cat: any) => {
    if (cat.image_url) return cat.image_url;
    if (cat.image_path) {
      return `http://localhost/idvision/backend/uploads/categories/${cat.image_path}`;
    }
    return null;
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900 dark:bg-black dark:text-white pb-16 space-y-12 transition-colors duration-300">
      {/* HERO SLIDER BANNER PROMO */}
      <HeroSlider />

      {/* RUNNING TEXT PROMO MARQUEE */}
      <RunningText />

      {/* KATEGORI PILIHAN (STYLE EIGER BACKGROUND BANNER) */}
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-6 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div>
            <h2 className="text-base font-extrabold uppercase tracking-wider text-zinc-900 dark:text-white md:text-lg flex items-center gap-2">
              <Sparkles
                size={18}
                className="text-emerald-500 dark:text-emerald-400"
              />{" "}
              Kategori Pilihan
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Temukan gaya kacamata ideal sesuai kebutuhan aktivitas Anda.
            </p>
          </div>
        </div>

        {/* Banner Card Grid Style Eiger */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(categories.length > 0
            ? categories
            : [
                { name: "Pria", slug: "pria" },
                { name: "Wanita", slug: "wanita" },
                { name: "Anak", slug: "anak" },
              ]
          ).map((cat, idx) => {
            const bgImage = getCategoryImage(cat);
            // Utamakan slug dari DB, jika tidak ada baru konversi dari nama
            const catSlug = cat.slug || cat.name.toLowerCase().trim();

            return (
              <Link
                key={cat.category_id || cat.id || idx}
                href={`/products?category=${encodeURIComponent(catSlug)}`}
                className="group relative h-80 w-full overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-zinc-800 block cursor-pointer"
              >
                {/* Render Gambar Asli Backend jika ada */}
                {bgImage ? (
                  <img
                    src={bgImage}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  /* Gradient Hitam Elegan Fallback */
                  <div className="h-full w-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-black transition-transform duration-700 group-hover:scale-105" />
                )}

                {/* Dark Overlay untuk legibilitas teks */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10 transition-opacity group-hover:opacity-90 pointer-events-none" />

                {/* Teks Kategori Tengah bergaya Eiger */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center pointer-events-none">
                  <h3 className="text-3xl font-black italic uppercase tracking-wider text-white drop-shadow-md group-hover:scale-105 transition-transform duration-300">
                    {cat.name}
                  </h3>

                  {/* Tombol Jelajahi saat Hover */}
                  <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-md opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
                    Jelajahi <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* PROMO SPESIAL */}
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-6 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div>
            <h2 className="text-base font-extrabold uppercase tracking-wider text-red-600 dark:text-red-400 md:text-lg flex items-center gap-2">
              <Tag size={18} className="text-red-500" /> Promo & Diskon Spesial
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Penawaran harga terbaik dengan diskon hemat terbatas.
            </p>
          </div>
          <Link
            href="/products?sort=discount_desc"
            className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
          >
            Lihat Promo <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-zinc-400">
            Memuat produk promo...
          </div>
        ) : promoProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {promoProducts.map((prod) => (
              <ProductCard key={prod.product_id || prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-zinc-400">
            Tidak ada produk promo saat ini.
          </div>
        )}
      </section>

      {/* KOLEKSI TERPOPULER */}
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-6 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div>
            <h2 className="text-base font-extrabold uppercase tracking-wider text-zinc-900 dark:text-white md:text-lg flex items-center gap-2">
              <Award
                size={18}
                className="text-emerald-500 dark:text-emerald-400"
              />{" "}
              Koleksi Kacamata Terpopuler
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Kacamata favorit paling banyak diminati dan terlaris.
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            Lihat Semua <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-zinc-400">
            Memuat produk terpopuler...
          </div>
        ) : popularProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popularProducts.map((prod) => (
              <ProductCard key={prod.product_id || prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-zinc-400">
            Belum ada produk terpopuler.
          </div>
        )}
      </section>

      {/* BANNER KEUNGGULAN */}
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="rounded-3xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-950 dark:to-black p-8 md:p-12">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-zinc-900 dark:text-white">
                  100% Original
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Lensa terproteksi UV400 penuh dengan material frame titanium &
                  acetate pilihan.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-400 border border-emerald-500/20">
                <Truck size={24} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-zinc-900 dark:text-white">
                  Kirim Cepat & COD
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Dukung metode pembayaran COD dan kurir ekspedisi instan ke
                  seluruh Indonesia.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-400 border border-emerald-500/20">
                <RefreshCw size={24} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-zinc-900 dark:text-white">
                  Garansi Kepuasan
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Jaminan ganti baru atau perbaikan jika terjadi cacat produksi
                  pada kacamata.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-400 border border-emerald-500/20">
                <Star size={24} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-zinc-900 dark:text-white">
                  Update Notifikasi WA
                </h3>
                <p className="mt-1 text-[11px] text-zinc-400 leading-relaxed">
                  Lacak resi dan status pesanan otomatis langsung terhubung ke
                  WhatsApp Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
