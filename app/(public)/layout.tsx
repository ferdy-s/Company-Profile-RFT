import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { getPublicBrandLogoUrl } from '@/lib/public-content';

export const dynamic = 'force-dynamic';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const brandLogoUrl = await getPublicBrandLogoUrl();
  return (
    <>
      <Navbar brandLogoUrl={brandLogoUrl} />
      <main className="min-h-screen pt-20">
        {children}
      </main>
      <Footer brandLogoUrl={brandLogoUrl} />
    </>
  );
}

