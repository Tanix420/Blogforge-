import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    services: {
      frontend: "running",
      api: "running",
      agents: "ready",
      database: "filesystem",
      search: "duckduckgo",
    },
    features: {
      trending: true,
      research: true,
      writing: true,
      seo: true,
      affiliate: true,
      qualityGate: true,
    },
  };
  return NextResponse.json(health, { status: 200 });
}
