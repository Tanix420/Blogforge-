import { NextRequest, NextResponse } from "next/server";
import { getArticles } from "@/lib/articles";

export async function GET() {
  const articles = getArticles();
  return NextResponse.json(articles);
}
