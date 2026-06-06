import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('blogforge_admin')?.value;

  if (!session) {
    redirect('/admin/login');
  }

  return children as any;
}
