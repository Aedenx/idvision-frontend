"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, CheckCircle2, MapPin, X } from "lucide-react";

export interface Address {
  id: string;
  label: string;
  recipient_name: string;
  phone: string;
  full_address: string;
  is_primary: boolean;
}

interface AddressesTabProps {
  addresses: Address[];
  onSave: (addresses: Address[]) => void;
  user: any;
}

export default function AddressesTab({
  addresses,
  onSave,
  user,
}: AddressesTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddr, setEditingAddr] = useState<Address | null>(null);
  const [form, setForm] = useState({
    label: "Rumah",
    recipient_name: "",
    phone: "",
    full_address: "",
    is_primary: false,
  });

  const openModal = (addr?: Address) => {
    if (addr) {
      setEditingAddr(addr);
      setForm({ ...addr });
    } else {
      setEditingAddr(null);
      setForm({
        label: "Rumah",
        recipient_name: user?.name || user?.full_name || "",
        phone: user?.phone || "",
        full_address: "",
        is_primary: addresses.length === 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    let updated = [...addresses];

    if (form.is_primary) {
      updated = updated.map((a) => ({ ...a, is_primary: false }));
    }

    if (editingAddr) {
      updated = updated.map((a) =>
        a.id === editingAddr.id ? { ...form, id: editingAddr.id } : a,
      );
    } else {
      updated.push({
        ...form,
        id: `addr_${Date.now()}`,
        is_primary: addresses.length === 0 ? true : form.is_primary,
      });
    }

    onSave(updated);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Hapus alamat ini?")) return;
    const filtered = addresses.filter((a) => a.id !== id);
    if (filtered.length > 0 && !filtered.some((a) => a.is_primary)) {
      filtered[0].is_primary = true;
    }
    onSave(filtered);
  };

  const handleSetPrimary = (id: string) => {
    const updated = addresses.map((a) => ({ ...a, is_primary: a.id === id }));
    onSave(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
            Buku Alamat Pengiriman
          </h2>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Alamat utama akan otomatis terpilih saat checkout.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-500 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-black hover:bg-emerald-400 transition cursor-pointer shadow-lg shadow-emerald-500/10"
        >
          <Plus size={16} /> Tambah Alamat
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`relative flex flex-col justify-between rounded-3xl border p-6 transition bg-white dark:bg-zinc-900/60 shadow-sm ${
              addr.is_primary
                ? "border-emerald-500 ring-2 ring-emerald-500/20"
                : "border-zinc-200 dark:border-zinc-800"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-block rounded-lg bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-[10px] font-extrabold uppercase text-zinc-700 dark:text-zinc-300">
                  {addr.label}
                </span>

                {addr.is_primary && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase text-emerald-500">
                    <CheckCircle2 size={12} /> Alamat Utama
                  </span>
                )}
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-black text-zinc-900 dark:text-white text-sm">
                  {addr.recipient_name}
                </p>
                <p className="text-zinc-500 dark:text-zinc-400 text-[11px] font-mono">
                  {addr.phone}
                </p>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-[11px] pt-2">
                  {addr.full_address}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 pt-4 text-[11px]">
              {!addr.is_primary ? (
                <button
                  onClick={() => handleSetPrimary(addr.id)}
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Set Jadi Utama
                </button>
              ) : (
                <span className="text-zinc-400 italic">Alamat Default</span>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal(addr)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white cursor-pointer transition"
                  title="Edit Alamat"
                >
                  <Edit2 size={15} />
                </button>
                {addresses.length > 1 && (
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:bg-rose-500/10 hover:text-rose-500 cursor-pointer transition"
                    title="Hapus Alamat"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL FORM ALAMAT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3 dark:border-zinc-800">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                <MapPin size={16} className="text-emerald-500" />
                {editingAddr ? "Edit Alamat Pengiriman" : "Tambah Alamat Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-[10px] font-black uppercase text-zinc-500 mb-1">
                  Label Alamat
                </label>
                <select
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-3 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Rumah">Rumah</option>
                  <option value="Kantor">Kantor</option>
                  <option value="Apartemen">Apartemen</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-zinc-500 mb-1">
                  Nama Penerima
                </label>
                <input
                  type="text"
                  required
                  value={form.recipient_name}
                  onChange={(e) =>
                    setForm({ ...form, recipient_name: e.target.value })
                  }
                  className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-3 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500"
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
                  className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-3 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-zinc-500 mb-1">
                  Alamat Lengkap & Patokan
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.full_address}
                  onChange={(e) =>
                    setForm({ ...form, full_address: e.target.value })
                  }
                  className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-3 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="is_primary"
                  checked={form.is_primary}
                  onChange={(e) =>
                    setForm({ ...form, is_primary: e.target.checked })
                  }
                  className="rounded border-zinc-300 accent-emerald-500 h-4 w-4"
                />
                <label
                  htmlFor="is_primary"
                  className="text-xs text-zinc-600 dark:text-zinc-400 cursor-pointer font-medium"
                >
                  Jadikan sebagai alamat utama
                </label>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-emerald-500 py-3 text-xs font-black uppercase tracking-wider text-black hover:bg-emerald-400 transition cursor-pointer"
                >
                  Simpan Alamat
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 px-5 py-3 text-xs font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
