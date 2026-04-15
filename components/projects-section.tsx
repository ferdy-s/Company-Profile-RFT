'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { PortfolioItem } from '@/lib/marketing-data';

export function ProjectsSection({ projects }: { projects: PortfolioItem[] }) {
  return (
    <section
      id="portofolio"
      className="py-24 lg:py-32 bg-gradient-to-b from-card/25 via-background to-background scroll-mt-24 border-y border-border/30"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-sm font-medium text-primary mb-2 tracking-wide uppercase">
            Portfolio
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Yang sudah kami bantu bangun
          </h2>
          <p className="text-lg text-muted-foreground">
            Dari website perusahaan sampai aplikasi dan kampanye digital — satu tim end-to-end.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((item, index) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
            >
              <Card className="h-full border-border/40 bg-card/40 hover:bg-card/70 hover:border-primary/15 transition-all duration-300 overflow-hidden">
                {item.image && (
                  <div className="relative h-48 w-full border-b border-border/30 bg-muted/20">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {item.services.map((s) => (
                      <span
                        key={s}
                        className="text-xs rounded-md bg-secondary px-2 py-0.5 text-secondary-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <CardTitle className="text-lg leading-snug">{item.title}</CardTitle>
                  <CardDescription>
                    {item.clientType} · {item.focus}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Button asChild size="lg" variant="outline">
            <Link href="/contact">Diskusikan project Anda</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
