import Swal from "sweetalert2";

export const showSuccessAlert = (title: string, text?: string) => {
  return Swal.fire({
    icon: "success",
    title,
    text,
    background: "#09090b", // zinc-950
    color: "#ffffff",
    confirmButtonColor: "#10b981", // emerald-500
    confirmButtonText: "Selesai",
    customClass: {
      popup: "rounded-3xl border border-zinc-800 shadow-2xl",
      confirmButton:
        "rounded-2xl text-black font-black uppercase text-xs px-6 py-3",
    },
  });
};

export const showErrorAlert = (title: string, text?: string) => {
  return Swal.fire({
    icon: "error",
    title,
    text,
    background: "#09090b",
    color: "#ffffff",
    confirmButtonColor: "#f43f5e", // rose-500
    confirmButtonText: "Tutup",
    customClass: {
      popup: "rounded-3xl border border-zinc-800 shadow-2xl",
      confirmButton:
        "rounded-2xl text-white font-black uppercase text-xs px-6 py-3",
    },
  });
};

export const showConfirmAlert = async (
  title: string,
  text: string,
  confirmText = "Ya, Lanjutkan",
) => {
  const result = await Swal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    background: "#09090b",
    color: "#ffffff",
    confirmButtonColor: "#10b981",
    cancelButtonColor: "#27272a", // zinc-800
    confirmButtonText: confirmText,
    cancelButtonText: "Batal",
    customClass: {
      popup: "rounded-3xl border border-zinc-800 shadow-2xl",
      confirmButton:
        "rounded-2xl text-black font-black uppercase text-xs px-5 py-2.5",
      cancelButton:
        "rounded-2xl text-zinc-400 font-bold uppercase text-xs px-5 py-2.5",
    },
  });

  return result.isConfirmed;
};
