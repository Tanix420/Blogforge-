import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminShell({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('blogforge_admin')?.value;
  if (!session) redirect('/admin/login');
  return children;
}
