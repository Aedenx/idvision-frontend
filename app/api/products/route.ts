import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://idvisionbackend-kulry6wj.b4a.run";

  try {
    // Tembak langsung ke root URL Back4app
    const res = await fetch(`${baseUrl}/`, {
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
      return NextResponse.json(
        {
          status: "error",
          message: "Response bukan JSON valid",
          raw: responseText,
        },
        { status: 500 },
      );
    }
  } catch (error: any) {
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
