import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loadConfig } from "@/lib/config-types";
import { runFullPipeline } from "@/lib/agents/pipeline";

const SESSION_COOKIE = "blogforge_admin";

async function requireAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === "1";
}

export async function POST(req: NextRequest) {
  if (!(await requireAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
   const body = await req.json().catch(() => ({}));
   const config = await loadConfig();
   const result = await runFullPipeline(config, {
    forceTopic: body.topic || null,
    maxArticles: body.count || 1,
   });
   return NextResponse.json({
    ok: true,
    jobId: result.jobId,
    status: result.status,
    article: result.article,
    qualityScore: result.qualityScore,
    logs: result.logs,
   });
  } catch (err: any) {
   console.error("Pipeline error:", err);
   return NextResponse.json({ ok: false, error: err.message || "Pipeline failed" }, { status: 500 });
  }
}
