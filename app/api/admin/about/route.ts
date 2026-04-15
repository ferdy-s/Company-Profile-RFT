import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { aboutContent } from '@/lib/marketing-data';
import { ABOUT_PAGE_ID } from '@/lib/public-content';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const aboutSchema = z.object({
  headline: z.string().min(1),
  intro: z.string().min(1),
  body: z.array(z.string()),
  values: z.array(
    z.object({
      title: z.string().min(1),
      text: z.string().min(1),
    })
  ),
});

async function requireAdmin() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return null;
}

export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  const row = await prisma.aboutPage.findUnique({ where: { id: ABOUT_PAGE_ID } });
  if (!row) {
    return NextResponse.json({
      id: null,
      headline: aboutContent.headline,
      intro: aboutContent.intro,
      body: aboutContent.body,
      values: aboutContent.values,
    });
  }
  return NextResponse.json({
    id: row.id,
    headline: row.headline,
    intro: row.intro,
    body: row.body,
    values: row.values,
  });
}

export async function PUT(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;
  try {
    const data = aboutSchema.parse(await req.json());
    const row = await prisma.aboutPage.upsert({
      where: { id: ABOUT_PAGE_ID },
      create: {
        id: ABOUT_PAGE_ID,
        headline: data.headline,
        intro: data.intro,
        body: data.body,
        values: data.values,
      },
      update: {
        headline: data.headline,
        intro: data.intro,
        body: data.body,
        values: data.values,
      },
    });
    revalidatePath('/');
    return NextResponse.json(row);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: e.issues }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
