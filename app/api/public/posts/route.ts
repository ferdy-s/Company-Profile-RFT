import { NextResponse } from 'next/server';
import { getPublishedPostSummaries, countPublishedPosts } from '@/lib/blog-public';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const offset = Math.max(0, parseInt(searchParams.get('offset') ?? '0', 10) || 0);
  const limit = Math.min(12, Math.max(1, parseInt(searchParams.get('limit') ?? '6', 10) || 6));

  const [posts, total] = await Promise.all([
    getPublishedPostSummaries({ skip: offset, take: limit }),
    countPublishedPosts(),
  ]);

  const serialized = posts.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return NextResponse.json({
    posts: serialized,
    hasMore: offset + posts.length < total,
  });
}
