import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { AdminCareersTable } from '@/components/admin-careers-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

export default async function AdminCareersPage() {
  const items = await prisma.careerOpening.findMany({
    orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    select: {
      id: true,
      title: true,
      slug: true,
      location: true,
      type: true,
      published: true,
      sortOrder: true,
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Karier</h1>
          <p className="text-muted-foreground">Lowongan di halaman /career.</p>
        </div>
        <Button asChild>
          <Link href="/admin/careers/new">
            <Plus className="h-4 w-4 mr-2" />
            Lowongan baru
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar lowongan</CardTitle>
          <CardDescription>{items.length} item</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminCareersTable items={items} />
        </CardContent>
      </Card>
    </div>
  );
}
