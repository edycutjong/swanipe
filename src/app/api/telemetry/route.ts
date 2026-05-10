import { NextResponse } from "next/server";
import { rpcFastService } from "@/lib/rpcfast";

export async function GET() {
  try {
    const metrics = await rpcFastService.getTelemetryMetrics();
    return NextResponse.json(metrics);
  } catch {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
}
