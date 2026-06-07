import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function isAuthenticated() {
  const session = (await cookies()).get('blogforge_admin')?.value;
  return !!session;
}

export async function POST() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ ok: true, message: 'Pipeline started — check the Queue tab for progress.' });
}
