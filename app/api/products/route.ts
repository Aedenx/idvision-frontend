import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://idvisionbackend-kulry6wj.b4a.run";
  const targetUrl = `${baseUrl}/api/products/index.php`;

  try {
    const res = await fetch(targetUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const responseText = await res.text();

    try {
      const jsonResponse = JSON.parse(responseText);
      return NextResponse.json(jsonResponse);
    } catch {
      console.error("Non-JSON Response from backend:", responseText);
      return NextResponse.json(
        {
          status: "error",
          message: "Gagal memproses data dari backend",
          data: [],
        },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error("Proxy Fetch Error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Gagal menghubungi server",
        data: [],
      },
      { status: 500 },
    );
  }
}
