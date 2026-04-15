import type { PrismaClient } from '@prisma/client';
import {
  aboutContent,
  careerOpenings,
  coreServices,
  portfolioProjects,
} from '../lib/marketing-data';
import { ABOUT_PAGE_ID } from '../lib/public-content';
import { BRAND_LOGO_FALLBACK_SRC, BRAND_SETTINGS_ID } from '../lib/brand';

/**
 * Seed / upsert: About (satu dokumen), Layanan, Portfolio, Karier.
 * Dipakai oleh `prisma/seed.ts` dan skrip `npm run db:seed:marketing`.
 */
export async function seedMarketingContent(prisma: PrismaClient) {
  await prisma.brandSettings.upsert({
    where: { id: BRAND_SETTINGS_ID },
    create: { id: BRAND_SETTINGS_ID, logoUrl: BRAND_LOGO_FALLBACK_SRC },
    update: {},
  });

  await prisma.aboutPage.upsert({
    where: { id: ABOUT_PAGE_ID },
    create: {
      id: ABOUT_PAGE_ID,
      headline: aboutContent.headline,
      intro: aboutContent.intro,
      body: aboutContent.body,
      values: aboutContent.values,
    },
    update: {
      headline: aboutContent.headline,
      intro: aboutContent.intro,
      body: aboutContent.body,
      values: aboutContent.values,
    },
  });

  let sort = 0;
  for (const s of coreServices) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      create: {
        slug: s.slug,
        title: s.title,
        titleEn: s.titleEn,
        summary: s.summary,
        details: s.details,
        sortOrder: sort++,
        published: true,
      },
      update: {
        title: s.title,
        titleEn: s.titleEn,
        summary: s.summary,
        details: s.details,
        sortOrder: sort - 1,
        published: true,
      },
    });
  }

  sort = 0;
  for (const p of portfolioProjects) {
    await prisma.portfolioProject.upsert({
      where: { slug: p.slug },
      create: {
        slug: p.slug,
        title: p.title,
        clientType: p.clientType,
        focus: p.focus,
        description: p.description,
        image: null,
        services: p.services,
        sortOrder: sort++,
        published: true,
      },
      update: {
        title: p.title,
        clientType: p.clientType,
        focus: p.focus,
        description: p.description,
        services: p.services,
        sortOrder: sort - 1,
        published: true,
      },
    });
  }

  sort = 0;
  for (const c of careerOpenings) {
    await prisma.careerOpening.upsert({
      where: { slug: c.slug },
      create: {
        slug: c.slug,
        title: c.title,
        location: c.location,
        type: c.type,
        description: c.description,
        responsibilities: c.responsibilities,
        sortOrder: sort++,
        published: true,
      },
      update: {
        title: c.title,
        location: c.location,
        type: c.type,
        description: c.description,
        responsibilities: c.responsibilities,
        sortOrder: sort - 1,
        published: true,
      },
    });
  }
}
