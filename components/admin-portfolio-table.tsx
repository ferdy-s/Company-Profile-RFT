'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

type Row = {
  id: string;
  title: string;
  slug: string;
  clientType: string;
  published: boolean;
  sortOrder: number;
};

export function AdminPortfolioTable({ items }: { items: Row[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus project ini?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, { method: 'DELETE' });
      if (res.ok) router.refresh();
      else alert('Gagal menghapus');
    } finally {
      setDeleting(null);
    }
  };

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        Belum ada portfolio. Tambah dari tombol di atas.
      </p>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[720px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Klien</TableHead>
              <TableHead>Urutan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{p.clientType}</TableCell>
                <TableCell>{p.sortOrder}</TableCell>
                <TableCell>{p.published ? 'Published' : 'Draft'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/portfolio/${p.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(p.id)}
                      disabled={deleting === p.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
