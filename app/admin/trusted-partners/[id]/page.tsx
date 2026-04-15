import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AdminTrustedPartnerEditor } from '@/components/admin-trusted-partner-editor';

export default async function AdminEditTrustedPartnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const partner = await prisma.trustedPartner.findUnique({ where: { id } });
  if (!partner) notFound();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Edit mitra</h1>
        <p className="text-muted-foreground">{partner.name}</p>
      </div>
      <AdminTrustedPartnerEditor partner={partner} />
    </div>
  );
}
