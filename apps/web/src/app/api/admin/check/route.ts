import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('blogforge_admin');
    if (session?.value) {
      return NextResponse.json({ authenticated: true });
    }
  } catch {
    // ignore cookie read errors
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}
