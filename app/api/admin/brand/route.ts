import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { BRAND_LOGO_FALLBACK_SRC, BRAND_SETTINGS_ID } from '@/lib/brand';
import { getBrandSettingsLogoUrl, upsertBrandSettingsLogoUrl } from '@/lib/brand-settings-db';
import { z } from 'zod';

const schema = z.object({
  logoUrl: z.string().url(),
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
  const logoUrl = await getBrandSettingsLogoUrl(BRAND_SETTINGS_ID);
  return NextResponse.json({ logoUrl: logoUrl ?? BRAND_LOGO_FALLBACK_SRC });
}

export async function PUT(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;
  try {
    const data = schema.parse(await req.json());
    const row = await upsertBrandSettingsLogoUrl(BRAND_SETTINGS_ID, data.logoUrl);
    // Ensure brand logo changes reflect everywhere (layout + page)
    revalidatePath('/', 'layout');
    revalidatePath('/', 'page');
    return NextResponse.json(row);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: e.issues }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

