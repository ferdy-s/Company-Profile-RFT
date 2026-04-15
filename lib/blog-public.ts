import { prisma } from '@/lib/prisma';

export type BlogPostSummary = {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const select = {
  id: true,
  title: true,
  slug: true,
  image: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function getPublishedPostSummaries(options: {
  skip?: number;
  take?: number;
}): Promise<BlogPostSummary[]> {
  const skip = Math.max(0, options.skip ?? 0);
  const take = Math.min(24, Math.max(1, options.take ?? 6));

  return prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    skip,
    take,
    select,
  });
}

export async function countPublishedPosts(): Promise<number> {
  return prisma.post.count({ where: { published: true } });
}
