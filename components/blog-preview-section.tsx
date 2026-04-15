import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BlogPostCard, type BlogPostCardData } from '@/components/blog-post-card';
import { ArrowRight } from 'lucide-react';

export function BlogPreviewSection({ posts }: { posts: BlogPostCardData[] }) {
  return (
    <section
      id="artikel"
      className="relative py-24 lg:py-32 overflow-hidden border-t border-border/40 scroll-mt-24"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-card/40 via-background to-background pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary mb-2 tracking-wide uppercase">
              Blog & insight
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Ide praktis untuk digital bisnis Anda
            </h2>
            <p className="text-lg text-muted-foreground">
              Cuplikan artikel terbaru dari tim kami — dari website & aplikasi sampai SEO dan sosial media.
            </p>
          </div>
          <Button asChild size="lg" variant="outline" className="shrink-0 gap-2">
            <Link href="/blog">
              Lihat semua artikel
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground py-12 rounded-2xl border border-dashed border-border/60">
            Belum ada artikel yang dipublikasikan. Kunjungi lagi nanti.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
