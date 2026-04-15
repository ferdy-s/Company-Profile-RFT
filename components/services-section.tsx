'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Smartphone, Search, Palette, Share2 } from 'lucide-react';
import type { ServiceItem } from '@/lib/marketing-data';

const icons = [Globe, Smartphone, Search, Palette, Share2] as const;
const colors = [
  'text-blue-400',
  'text-cyan-400',
  'text-emerald-400',
  'text-purple-400',
  'text-pink-400',
] as const;

export function ServicesSection({ services }: { services: ServiceItem[] }) {
  const remainderLg = services.length % 3;
  return (
    <section id="layanan" className="py-24 lg:py-32 bg-card/30 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-primary mb-3 tracking-wide uppercase">Layanan</p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            Apa yang kami kerjakan
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Website, aplikasi mobile, SEO, branding, dan social media — dari ngobrol soal kebutuhan sampai semuanya live.
          </p>
        </motion.div>

        {/* 
          Layout trick (LG+): use 6 columns, each card spans 2.
          This lets us center the last row when items don't fill 3 columns:
          - remainder 1: last item starts at col 3 (center)
          - remainder 2: last row starts at col 2 and 4 (centered pair)
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 max-w-6xl mx-auto place-items-stretch">
          {services.map((service, index) => {
            const Icon = icons[index] ?? Globe;
            const color = colors[index % colors.length];
            const isLast = index === services.length - 1;
            const isSecondLast = index === services.length - 2;

            const lgColStart =
              remainderLg === 1 && isLast
                ? 'lg:col-start-3'
                : remainderLg === 2 && isSecondLast
                  ? 'lg:col-start-2'
                  : remainderLg === 2 && isLast
                    ? 'lg:col-start-4'
                    : '';
            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className={`w-full lg:col-span-2 ${lgColStart}`}
              >
                <Card className="h-full border-border/40 bg-card/50 hover:bg-card/80 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors ${color}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl mb-1">{service.title}</CardTitle>
                    <CardDescription className="text-base text-muted-foreground/90">
                      {service.titleEn}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{service.summary}</p>
                    <a
                      href="/#layanan"
                      className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Detail layanan
                      <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
