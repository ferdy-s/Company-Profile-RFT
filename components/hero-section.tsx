'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { agencyPositioning } from '@/lib/marketing-data';
import { BRAND_LOGO_ALT, BRAND_LOGO_FALLBACK_SRC } from '@/lib/brand';

export function HeroSection({ brandLogoUrl }: { brandLogoUrl?: string }) {
  return (
    <section
      id="beranda"
      className="relative min-h-[92vh] flex items-center overflow-hidden scroll-mt-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,color-mix(in_oklch,var(--primary)_18%,transparent),transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,var(--background)_88%)]" />

      <div className="absolute inset-0 opacity-[0.35] dark:opacity-[0.2]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.14'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center max-w-7xl mx-auto">
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm mb-8"
            >
              <Sparkles className="h-4 w-4 text-primary" aria-hidden />
              <span>Digital agency untuk website, apps & growth</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.08] mb-6"
            >
              <span className="block text-foreground">
                Yuk, bikin bisnis Anda{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 text-primary">kedengeran</span>
                  <span
                    className="absolute left-0 right-0 bottom-1 h-3 bg-primary/15 -rotate-1 rounded-sm -z-0"
                    aria-hidden
                  />
                </span>{' '}
                di dunia digital.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              {agencyPositioning}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button asChild size="lg" className="text-base px-8 h-12 rounded-full group shadow-lg shadow-primary/10">
                <Link href="/contact">
                  Ngobrol santai dulu
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8 h-12 rounded-full border-border/80 bg-background/50 backdrop-blur-sm">
                <Link href="/#layanan">Lihat apa yang kami kerjakan</Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md aspect-square">
              <div className="absolute inset-6 rounded-[2rem] bg-gradient-to-br from-primary/20 via-transparent to-primary/5 blur-2xl" />
              <div className="absolute inset-0 rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-md shadow-2xl shadow-black/5 flex flex-col items-center justify-center p-10 gap-6">
                <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-2xl bg-background/80 border border-border/40 flex items-center justify-center shadow-inner">
                  <Image
                    src={brandLogoUrl || BRAND_LOGO_FALLBACK_SRC}
                    alt={BRAND_LOGO_ALT}
                    width={112}
                    height={112}
                    className="h-16 w-16 sm:h-20 sm:w-20 object-contain text-foreground"
                    unoptimized
                    priority
                  />
                </div>
                <p className="text-center text-sm text-muted-foreground max-w-[220px] leading-relaxed">
                  Satu tim untuk desain, engineering, dan strategi — biar Anda fokus ke bisnis.
                </p>
                <div className="flex gap-2 flex-wrap justify-center">
                  {['Web', 'Apps', 'SEO', 'Brand', 'Sosmed'].map((label) => (
                    <span
                      key={label}
                      className="text-xs font-medium px-3 py-1 rounded-full bg-secondary/80 text-secondary-foreground"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
        aria-hidden
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-muted-foreground/25 rounded-full flex justify-center pt-2"
        >
          <span className="w-1 h-2 bg-muted-foreground/40 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
