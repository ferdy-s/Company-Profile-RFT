import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AuthProvider } from '@/components/auth-provider';
import { AdminShell } from '@/components/admin-shell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  if (session.user.role !== 'admin') {
    redirect('/forbidden');
  }

  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}

