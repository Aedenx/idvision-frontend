"use client";

import Link from "next/link";
import {
  ShoppingBag,
  ArrowRight,
  Truck,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface OrdersTabProps {
  orders: any[];
  loading: boolean;
}

export default function OrdersTab({ orders, loading }: OrdersTabProps) {
  const getStatusBadge = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "completed" || s === "selesai") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={12} /> Selesai
        </span>
      );
    }
    if (s === "shipped" || s === "dikirim") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
          <Truck size={12} /> Dikirim
        </span>
      );
    }
    if (s === "cancelled" || s === "dibatalkan") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
          <AlertCircle size={12} /> Dibatalkan
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
        <Clock size={12} /> Diproses
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const ps = (paymentStatus || "").toLowerCase();
    if (ps === "paid") {
      return <span className="font-bold text-emerald-500 uppercase">Paid</span>;
    }
    if (ps === "refund_pending" || ps === "ref_pending") {
      return (
        <span className="font-bold text-amber-500 uppercase">
          Refund Pending
        </span>
      );
    }
    if (ps === "refunded") {
      return (
        <span className="font-bold text-blue-500 uppercase">Refunded</span>
      );
    }
    return (
      <span className="font-bold text-zinc-400 uppercase">
        {paymentStatus || "Pending"}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
            Riwayat Transaksi & Belanja
          </h2>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Lacak pengiriman kacamata Anda dan lihat rincian pesanan sebelumnya.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60 p-12 text-center text-xs text-zinc-500 space-y-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent mx-auto" />
          <p className="font-bold uppercase tracking-wider text-[10px]">
            Memuat Pesanan...
          </p>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 p-12 text-center space-y-4 bg-white dark:bg-zinc-900/40">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 mx-auto text-zinc-400">
            <ShoppingBag size={32} />
          </div>
          <div>
            <p className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">
              Belum Ada Riwayat Pesanan
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mt-1">
              Temukan koleksi kacamata eksklusif IDVISION dan lakukan pemesanan
              pertama Anda.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-xs font-black uppercase tracking-wider text-black hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20"
          >
            Mulai Jelajah Katalog <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord: any, idx: number) => {
            const orderNum = ord.order_number || ord.id;
            const itemsList = ord.items || [];

            return (
              <div
                key={idx}
                className="rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60 p-6 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition space-y-4"
              >
                {/* HEADER KARTU PESANAN */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-4 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-sm text-zinc-900 dark:text-white">
                      #{orderNum}
                    </span>
                    <span className="text-zinc-400 text-[11px]">
                      {new Date(
                        ord.created_at || Date.now(),
                      ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div>{getStatusBadge(ord.order_status || ord.status)}</div>
                </div>

                {/* RINCIAN PRODUK JIKA TERSEDIA */}
                {itemsList.length > 0 && (
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 py-1">
                    {itemsList.map((item: any, itemIdx: number) => (
                      <div
                        key={itemIdx}
                        className="py-2.5 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-white">
                            {item.product_name}
                          </p>
                          <p className="text-[11px] text-zinc-500">
                            {item.quantity} x Rp{" "}
                            {Number(item.price || 0).toLocaleString("id-ID")}
                          </p>
                        </div>
                        <p className="font-extrabold text-zinc-800 dark:text-zinc-200">
                          Rp{" "}
                          {Number(item.subtotal || 0).toLocaleString("id-ID")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* RINGKASAN HARGA & STATUS BAYAR */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-xs">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">
                      Metode / Status Bayar
                    </p>
                    <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      <span className="uppercase">
                        {ord.payment_method || "Midtrans"}
                      </span>{" "}
                      &bull; {getPaymentBadge(ord.payment_status)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">
                      Total Bayar
                    </p>
                    <p className="font-black text-emerald-600 dark:text-emerald-400 text-base font-mono">
                      Rp{" "}
                      {Number(
                        ord.total_amount || ord.price || ord.total_price || 0,
                      ).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                {/* FOOTER KARTU & ACTION TRACKING */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px]">
                  <span className="text-zinc-500 dark:text-zinc-400 font-mono">
                    Resi:{" "}
                    <strong className="text-zinc-800 dark:text-zinc-200">
                      {ord.tracking_number || "Belum Diterbitkan"}
                    </strong>
                  </span>

                  <Link
                    href={`/checkout/success/${orderNum}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-black transition cursor-pointer"
                  >
                    <Truck size={14} />
                    Lacak / Faktur
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
