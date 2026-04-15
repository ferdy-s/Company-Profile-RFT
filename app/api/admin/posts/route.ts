import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { invalidateBlogCaches } from '@/lib/cache';
import { z } from 'zod';

const postSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().min(1),
  image: z.string().url().optional().or(z.literal('')),
  published: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
  canonicalUrl: z.string().url().optional().or(z.literal('')),
});

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = postSchema.parse(body);

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug: data.slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        image: data.image || null,
        published: data.published,
        seoMeta: {
          create: {
            metaTitle: data.metaTitle || null,
            metaDescription: data.metaDescription || null,
            keywords: data.keywords || null,
            canonicalUrl: data.canonicalUrl || null,
          },
        },
      },
    });

    await invalidateBlogCaches([data.slug]);

    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

