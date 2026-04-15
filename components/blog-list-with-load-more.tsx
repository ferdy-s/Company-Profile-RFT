'use client';

import { useState } from 'react';
import { BlogPostCard, type BlogPostCardData } from '@/components/blog-post-card';
import { MotionFadeIn } from '@/components/motion-fade-in';
import { Button } from '@/components/ui/button';

type SerializablePost = BlogPostCardData;

export function BlogListWithLoadMore({
  initialPosts,
  initialHasMore,
  pageSize = 6,
}: {
  initialPosts: SerializablePost[];
  initialHasMore: boolean;
  pageSize?: number;
}) {
  const [posts, setPosts] = useState<SerializablePost[]>(initialPosts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadMore() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/public/posts?offset=${posts.length}&limit=${pageSize}`);
      if (!res.ok) throw new Error('Gagal memuat artikel');
      const data = (await res.json()) as {
        posts: SerializablePost[];
        hasMore: boolean;
      };
      setPosts((prev) => [...prev, ...data.posts]);
      setHasMore(data.hasMore);
    } catch {
      setError('Tidak bisa memuat artikel tambahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">Belum ada artikel. Cek lagi nanti.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <MotionFadeIn key={post.id} delay={Math.min(index * 0.05, 0.4)}>
            <BlogPostCard post={post} />
          </MotionFadeIn>
        ))}
      </div>

      {error && (
        <p className="text-center text-sm text-destructive mt-8" role="alert">
          {error}
        </p>
      )}

      {hasMore && (
        <div className="flex justify-center mt-12">
          <Button size="lg" variant="outline" onClick={loadMore} disabled={loading}>
            {loading ? 'Memuat…' : 'Muat lebih banyak'}
          </Button>
        </div>
      )}
    </>
  );
}
