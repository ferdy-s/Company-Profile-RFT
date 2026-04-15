import { MotionFadeIn } from '@/components/motion-fade-in';
import { BlogListWithLoadMore } from '@/components/blog-list-with-load-more';
import { getPublishedPostSummaries, countPublishedPosts } from '@/lib/blog-public';

const PAGE_SIZE = 6;

export default async function BlogPage() {
  const [posts, total] = await Promise.all([
    getPublishedPostSummaries({ skip: 0, take: PAGE_SIZE }),
    countPublishedPosts(),
  ]);

  const initialHasMore = posts.length < total;
  const serialized = posts.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <MotionFadeIn className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 tracking-tight">Blog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Artikel singkat seputar website, aplikasi, SEO, branding, dan social media dari tim digital agency kami.
        </p>
      </MotionFadeIn>

      <BlogListWithLoadMore
        initialPosts={serialized}
        initialHasMore={initialHasMore}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
}
