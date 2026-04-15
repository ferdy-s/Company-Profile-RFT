import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export type BlogPostCardData = {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  createdAt: Date | string;
};

function formatPostDate(value: Date | string) {
  const d = typeof value === 'string' ? new Date(value) : value;
  return d.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function BlogPostCard({
  post,
  ctaLabel = 'Baca selengkapnya',
}: {
  post: BlogPostCardData;
  ctaLabel?: string;
}) {
  return (
    <Card className="h-full border-border/40 bg-card/50 hover:bg-card/80 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group overflow-hidden">
      {post.image && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </CardTitle>
        <CardDescription>{formatPostDate(post.createdAt)}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link
          href={`/blog/${post.slug}`}
          className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
        >
          {ctaLabel}
          <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
        </Link>
      </CardContent>
    </Card>
  );
}
