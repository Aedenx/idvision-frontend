"use client";

import { LogOut, Package, MapPin, UserCheck } from "lucide-react";

interface AccountHeaderProps {
  user: any;
  ordersCount: number;
  addressesCount: number;
  onLogout: () => void;
}

export default function AccountHeader({
  user,
  ordersCount,
  addressesCount,
  onLogout,
}: AccountHeaderProps) {
  const initial = (user?.name || user?.full_name || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/80 shadow-sm">
      {/* GLOW DEKORASI */}
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-5">
          {/* AVATAR INISIAL DENGAN RING GRADIENT */}
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-300 text-2xl font-black text-black shadow-lg shadow-emerald-500/20">
            {initial}
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 border-2 border-white dark:border-zinc-900 text-[10px] text-emerald-400">
              <UserCheck size={11} />
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                {user?.name || user?.full_name || "Pelanggan IDVISION"}
              </h1>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono flex flex-wrap items-center gap-2">
              <span>{user?.email}</span>
              <span className="text-zinc-300 dark:text-zinc-700">&bull;</span>
              <span>{user?.phone || "No. HP Belum Diset"}</span>
            </p>
          </div>
        </div>

        {/* STATS & TOMBOL LOGOUT */}
        <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-4 text-center">
            <div className="px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
              <p className="text-[10px] font-extrabold uppercase text-zinc-400 flex items-center justify-center gap-1">
                <Package size={11} /> Pesanan
              </p>
              <p className="text-sm font-black text-zinc-900 dark:text-white font-mono">
                {ordersCount}
              </p>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
              <p className="text-[10px] font-extrabold uppercase text-zinc-400 flex items-center justify-center gap-1">
                <MapPin size={11} /> Alamat
              </p>
              <p className="text-sm font-black text-zinc-900 dark:text-white font-mono">
                {addressesCount}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-black uppercase text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white transition cursor-pointer"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
