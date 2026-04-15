import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AdminCareerEditor } from '@/components/admin-career-editor';

export default async function AdminEditCareerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const opening = await prisma.careerOpening.findUnique({ where: { id } });
  if (!opening) notFound();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Edit lowongan</h1>
        <p className="text-muted-foreground">{opening.title}</p>
      </div>
      <AdminCareerEditor opening={opening} />
    </div>
  );
}
