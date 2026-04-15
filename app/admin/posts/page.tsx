import { prisma } from '@/lib/prisma';
import { PostsTable } from '@/components/posts-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Blogs</h1>
          <p className="text-muted-foreground">Buat, edit, publikasikan, atau hapus artikel blog</p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new">
            <Plus className="h-4 w-4 mr-2" />
            Artikel baru
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar blog</CardTitle>
          <CardDescription>{posts.length} artikel</CardDescription>
        </CardHeader>
        <CardContent>
          <PostsTable posts={posts} />
        </CardContent>
      </Card>
    </div>
  );
}
