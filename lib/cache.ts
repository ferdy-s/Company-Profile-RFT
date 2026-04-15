import { getRedisClient, isRedisConfigured } from './redis';

const CACHE_TTL = 60; // 60 seconds

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = CACHE_TTL
): Promise<T> {
  if (!isRedisConfigured()) {
    return fetcher();
  }
  try {
    const client = getRedisClient();
    const cached = await client.get(key);

    if (cached) {
      return JSON.parse(cached) as T;
    }

    const data = await fetcher();
    await client.setex(key, ttl, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Cache error:', error);
    // Fallback to direct fetch if cache fails
    return fetcher();
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  if (!isRedisConfigured()) {
    return;
  }
  try {
    const client = getRedisClient();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
    }
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
}

/** Redis key for published post list (see blog listing page). */
export const BLOG_LIST_CACHE_KEY = 'blog:posts:published';

export function blogPostCacheKey(slug: string): string {
  return `blog:post:${slug}`;
}

/** Invalidate blog list and one or more single-post caches (by slug). */
export async function invalidateBlogCaches(slugs: string[]): Promise<void> {
  await invalidateCache(BLOG_LIST_CACHE_KEY);
  const unique = [...new Set(slugs.filter(Boolean))];
  for (const slug of unique) {
    await invalidateCache(blogPostCacheKey(slug));
  }
}

