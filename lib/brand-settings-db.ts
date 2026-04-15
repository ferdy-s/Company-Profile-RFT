import { prisma } from '@/lib/prisma';
import { normalizePublicUrlForBrowser } from '@/lib/s3';

export type BrandSettingsRow = { id: string; logoUrl: string };

export async function getBrandSettingsLogoUrl(id: string): Promise<string | null> {
  const rows = await prisma.$queryRaw<BrandSettingsRow[]>`
    SELECT "id", "logoUrl"
    FROM "BrandSettings"
    WHERE "id" = ${id}
    LIMIT 1
  `;
  const url = rows[0]?.logoUrl ?? null;
  return url ? normalizePublicUrlForBrowser(url) : null;
}

export async function upsertBrandSettingsLogoUrl(id: string, logoUrl: string) {
  // Upsert without requiring regenerated Prisma model client
  const rows = await prisma.$queryRaw<BrandSettingsRow[]>`
    INSERT INTO "BrandSettings" ("id", "logoUrl", "createdAt", "updatedAt")
    VALUES (${id}, ${logoUrl}, NOW(), NOW())
    ON CONFLICT ("id")
    DO UPDATE SET "logoUrl" = EXCLUDED."logoUrl", "updatedAt" = NOW()
    RETURNING "id", "logoUrl"
  `;
  return rows[0];
}

