import Link from 'next/link';
import Image from 'next/image';
import { BRAND_LOGO_ALT, BRAND_LOGO_FALLBACK_SRC } from '@/lib/brand';
import { agencyName } from '@/lib/marketing-data';

export function Footer({ brandLogoUrl }: { brandLogoUrl?: string }) {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { href: '/#tentang', label: 'Tentang kami' },
      { href: '/#layanan', label: 'Layanan' },
      { href: '/#portofolio', label: 'Portfolio' },
      { href: '/#artikel', label: 'Artikel' },
      { href: '/career', label: 'Karier' },
      { href: '/blog', label: 'Blog' },
      { href: '/contact', label: 'Kontak' },
    ],
    legal: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
    ],
  };

  return (
    <footer className="border-t border-border/40 bg-card/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src={brandLogoUrl || BRAND_LOGO_FALLBACK_SRC}
                alt={BRAND_LOGO_ALT}
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
                unoptimized
              />
              <span className="text-lg font-bold text-foreground">{agencyName}</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bikin website, develop apps, urus SEO, branding, dan social media — semuanya dari satu tim.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: info@rfttech.com</li>
              <li>Phone: hubungi via email dulu</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} {agencyName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
