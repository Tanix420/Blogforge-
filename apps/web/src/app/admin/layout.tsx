import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('blogforge_admin')?.value;

  // Allow the login page itself to render without a session
  if (!session) {
    return children as any;
  }

  return children as any;
}
