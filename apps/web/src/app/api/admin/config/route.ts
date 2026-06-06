import { NextRequest, NextResponse } from "next/server";
import { loadConfig, saveConfig } from "@/lib/config-types";

export const dynamic = "force-dynamic";

export async function GET() {
  try { const c = await loadConfig(); return NextResponse.json({ config: c }); }
  catch { return NextResponse.json({ config: {} }); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const current = await loadConfig();
    const next = { ...current, ...body } as any;
    await saveConfig(next);
    return NextResponse.json({ config: next, ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "save_failed" }, { status: 500 });
  }
}
