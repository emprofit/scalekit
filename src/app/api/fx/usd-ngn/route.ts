import { NextResponse } from "next/server";

import { getUsdNgnRate } from "@/server/fx/usd-ngn";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await getUsdNgnRate();

    return NextResponse.json({
      ok: true,
      base: "USD",
      quote: "NGN",
      ...result,
    });
  } catch (error) {
    console.error("USD/NGN rate error:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to retrieve the USD/NGN rate.",
      },
      { status: 503 },
    );
  }
}