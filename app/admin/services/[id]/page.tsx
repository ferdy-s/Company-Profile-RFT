import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AdminServiceEditor } from '@/components/admin-service-editor';

export default async function AdminEditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Edit layanan</h1>
        <p className="text-muted-foreground">{service.title}</p>
      </div>
      <AdminServiceEditor service={service} />
    </div>
  );
}
