'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useUIStore } from '@/store/useUIStore';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND_LOGO_ALT, BRAND_LOGO_FALLBACK_SRC } from '@/lib/brand';
import { agencyName } from '@/lib/marketing-data';

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function smoothScrollToHash(hash: string) {
  if (!hash.startsWith('#')) return false;
  const id = hash.slice(1);
  const el = document.getElementById(id);
  if (!el) return false;

  const navbarOffset = 96; // px: fixed navbar height + spacing
  const startY = window.scrollY;
  const targetY = Math.max(0, startY + el.getBoundingClientRect().top - navbarOffset);
  const distance = targetY - startY;

  const duration = Math.min(900, Math.max(300, Math.abs(distance) * 0.6));
  const start = performance.now();

  function step(now: number) {
    const t = Math.min(1, (now - start) / duration);
    const y = startY + distance * easeInOutCubic(t);
    window.scrollTo(0, y);
    if (t < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
  return true;
}

export function Navbar({ brandLogoUrl }: { brandLogoUrl?: string }) {
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();

  const navItems = [
    { href: '/#beranda', label: 'Beranda' },
    { href: '/#layanan', label: 'Layanan' },
    { href: '/#portofolio', label: 'Portfolio' },
    { href: '/#tentang', label: 'Tentang' },
    { href: '/career', label: 'Karier' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Kontak' },
  ];

  const handleNavClick = (href: string) => (e: React.MouseEvent) => {
    if (href.startsWith('/#')) {
      const hash = href.slice(1); // "/#id" -> "#id"
      const did = smoothScrollToHash(hash);
      if (did) {
        e.preventDefault();
        closeMobileMenu();
        // keep URL in sync for share/back button
        history.pushState(null, '', href);
      }
    } else {
      closeMobileMenu();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/75 backdrop-blur-xl border-b border-border/40 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/"
            className="flex items-center gap-3 group"
            onClick={closeMobileMenu}
          >
            <span className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-border/50 bg-card/50 shadow-sm group-hover:border-primary/25 transition-colors">
              <Image
                src={brandLogoUrl || BRAND_LOGO_FALLBACK_SRC}
                alt={BRAND_LOGO_ALT}
                width={36}
                height={36}
                className="h-8 w-8 object-contain"
                unoptimized
                priority
              />
            </span>
            <span className="hidden sm:flex flex-col leading-tight">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Digital agency
              </span>
              <span className="text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors max-w-[200px] md:max-w-none truncate md:whitespace-normal">
                {agencyName}
              </span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick(item.href)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Button asChild className="ml-2 rounded-full">
              <Link href="/contact">Mulai project</Link>
            </Button>
          </div>

          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors rounded-lg"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl"
          >
            <div className="container mx-auto px-4 py-6 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick(item.href)}
                  className="block text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-3 border-b border-border/30 last:border-0"
                >
                  {item.label}
                </Link>
              ))}
              <Button asChild className="w-full mt-4 rounded-full">
                <Link href="/contact" onClick={closeMobileMenu}>
                  Mulai project
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
