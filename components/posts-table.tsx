'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface PostsTableProps {
  posts: Post[];
}

export function PostsTable({ posts }: PostsTableProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to delete post');
      }
    } catch {
      alert('An error occurred');
    } finally {
      setDeleting(null);
    }
  };

  const handleTogglePublish = async (id: string, published: boolean) => {
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !published }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch {
      alert('An error occurred');
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[720px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
        {posts.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
              No posts yet. Create your first post!
            </TableCell>
          </TableRow>
        ) : (
          posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell className="text-muted-foreground">{post.slug}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    post.published
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-yellow-500/10 text-yellow-500'
                  }`}
                >
                  {post.published ? 'Published' : 'Draft'}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(post.updatedAt).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTogglePublish(post.id, post.published)}
                    title={post.published ? 'Unpublish' : 'Publish'}
                  >
                    {post.published ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/posts/${post.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    disabled={deleting === post.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

