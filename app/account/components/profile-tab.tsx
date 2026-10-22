"use client";

import { useState } from "react";
import { CheckCircle2, Save } from "lucide-react";

interface ProfileTabProps {
  user: any;
  onUpdate: (updatedUser: any) => void;
}

export default function ProfileTab({ user, onUpdate }: ProfileTabProps) {
  const [form, setForm] = useState({
    name: user?.name || user?.full_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [msg, setMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...user,
      name: form.name,
      full_name: form.name,
      email: form.email,
      phone: form.phone,
    };
    onUpdate(updated);
    setMsg("Profil akun berhasil diperbarui!");
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60 p-6 shadow-sm space-y-6">
      <div>
        <h2 className="text-sm font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
          Pengaturan Informasi Profil
        </h2>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
          Perbarui informasi kontak dan identitas akun IDVISION Anda.
        </p>
      </div>

      {msg && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{msg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-black uppercase text-zinc-500 mb-1">
            Nama Lengkap Pelanggan
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-3 text-xs text-zinc-900 dark:text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-[10px] font-black uppercase text-zinc-500 mb-1">
              Alamat Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-3 text-xs text-zinc-900 dark:text-white focus:border-emerald-500 focus:outline-none font-mono"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-zinc-500 mb-1">
              Nomor WhatsApp / HP
            </label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-3 text-xs text-zinc-900 dark:text-white focus:border-emerald-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-xs font-black uppercase tracking-wider text-black hover:bg-emerald-400 transition cursor-pointer shadow-lg shadow-emerald-500/10"
          >
            <Save size={15} /> Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
