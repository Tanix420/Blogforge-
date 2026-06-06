import { NextRequest, NextResponse } from "next/server";

const ADMIN_PW = process.env.BLOGFORGE_ADMIN_PASSWORD || "admin";
const SESSION_COOKIE = "blogforge_admin";

function getClientIp(req: NextRequest) {
 return (
 req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
 req.headers.get("x-real-ip") ||
 "127.0.0.1"
 );
}

export async function POST(req: NextRequest) {
 try {
 const { password } = await req.json();
 const ip = getClientIp(req);

 // Rate limit per IP: max 5 failures per 10 min
 const store = globalThis as any;
 if (!store._loginAttempts) store._loginAttempts = {};

 const now = Date.now();
 const attempts = store._loginAttempts[ip] || [];
 const recent = attempts.filter((t: number) => now - t < 10 * 60 * 1000);

 if (recent.length >= 5) {
 return NextResponse.json(
 { ok: false, error: "Too many attempts. Try again in 10 minutes." },
 { status: 429 }
 );
 }

 if (password !== ADMIN_PW) {
 recent.push(now);
 store._loginAttempts[ip] = recent;
 return NextResponse.json({ ok: false, error: "Invalid password" }, { status: 401 });
 }

 // Success — clear attempts
 delete store._loginAttempts[ip];

 const res = NextResponse.json({ ok: true, authenticated: true });
 res.cookies.set(SESSION_COOKIE, "1", {
 httpOnly: true,
 secure: process.env.NODE_ENV === "production",
 sameSite: "lax",
 maxAge: 60 * 60 * 24 * 7,
 path: "/",
 });
 return res;
 } catch {
 return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
 }
}

export async function GET() {
 return NextResponse.json({ ok: true, endpoint: "/admin/api/auth", method: "POST" });
}
