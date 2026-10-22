import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://idvisionbackend-kulry6wj.b4a.run";
  const targetUrl = `${baseUrl}/product/index.php`;

  try {
    const res = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Cache-Control": "no-cache",
      },
      cache: "no-store",
    });

    const responseText = await res.text();

    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data);
    } catch {
      return NextResponse.json(
        { status: "error", message: "Response bukan JSON valid", raw: responseText },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Proxy Fetch Error:", error);
    return NextResponse.json({ status: "error", data: [] }, { status: 500 });
  }
}