import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { AdminPortfolioTable } from '@/components/admin-portfolio-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

export default async function AdminPortfolioPage() {
  const items = await prisma.portfolioProject.findMany({
    orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    select: {
      id: true,
      title: true,
      slug: true,
      clientType: true,
      published: true,
      sortOrder: true,
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Portfolio</h1>
          <p className="text-muted-foreground">Project yang tampil di blok portfolio beranda.</p>
        </div>
        <Button asChild>
          <Link href="/admin/portfolio/new">
            <Plus className="h-4 w-4 mr-2" />
            Project baru
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar project</CardTitle>
          <CardDescription>{items.length} item</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminPortfolioTable items={items} />
        </CardContent>
      </Card>
    </div>
  );
}
