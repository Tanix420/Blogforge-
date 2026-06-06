import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const SESSION_COOKIE = "blogforge_admin";

async function requireAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === "1";
}

const jobs: any[] = [];

export async function GET() {
  if (!(await requireAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(jobs.slice(0, 50));
}

export async function POST(req: NextRequest) {
  if (!(await requireAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const job = { id: `job-${Date.now()}`, ...body, status: "queued", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  jobs.unshift(job);
  return NextResponse.json(job, { status: 201 });
}
