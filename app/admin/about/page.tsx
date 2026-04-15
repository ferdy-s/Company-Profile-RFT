import { prisma } from '@/lib/prisma';
import { aboutContent } from '@/lib/marketing-data';
import { ABOUT_PAGE_ID } from '@/lib/public-content';
import { AdminAboutEditor } from '@/components/admin-about-editor';

export default async function AdminAboutPage() {
  const row = await prisma.aboutPage.findUnique({ where: { id: ABOUT_PAGE_ID } });

  const initial = row
    ? {
        headline: row.headline,
        intro: row.intro,
        body: Array.isArray(row.body)
          ? (row.body as unknown[]).filter((x): x is string => typeof x === 'string')
          : [],
        values: Array.isArray(row.values)
          ? (row.values as { title: string; text: string }[]).filter(
              (v) => v && typeof v.title === 'string' && typeof v.text === 'string'
            )
          : [],
      }
    : {
        headline: aboutContent.headline,
        intro: aboutContent.intro,
        body: [...aboutContent.body],
        values: aboutContent.values.map((v) => ({ ...v })),
      };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Tentang kami</h1>
        <p className="text-muted-foreground">
          Satu set konten untuk section &quot;Tentang&quot; di halaman utama.
        </p>
      </div>
      <AdminAboutEditor initial={initial} />
    </div>
  );
}
