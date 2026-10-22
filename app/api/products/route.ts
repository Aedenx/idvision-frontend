import { NextResponse } from "next/server";

export async function GET() {
  const targetUrl =
    "https://idvisionbackend-i7l6ougq.b4a.run/api/products/index.php";

  try {
    const res = await fetch(targetUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { status: "error", message: `HTTP Error ${res.status}`, data: [] },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Proxy Fetch Error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Gagal mengambil data produk",
        data: [],
      },
      { status: 500 },
    );
  }
}
