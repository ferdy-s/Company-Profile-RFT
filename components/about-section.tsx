'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { agencyName } from '@/lib/marketing-data';
import type { AboutPublic } from '@/lib/public-content';

export function AboutSection({ about }: { about: AboutPublic }) {
  return (
    <section id="tentang" className="py-24 lg:py-32 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-14"
        >
          <p className="text-sm font-medium text-primary mb-2 tracking-wide uppercase">
            Tentang kami
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            {about.headline}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">{about.intro}</p>
        </motion.div>

        <div className="max-w-3xl space-y-4 mb-12">
          {about.body.map((paragraph, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="text-muted-foreground leading-relaxed"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mb-10">
          {about.values.map((v, i) => (
            <motion.div
              key={`${v.title}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <Card className="h-full border-border/40 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{v.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground pt-0">{v.text}</CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Button asChild size="lg">
            <Link href="/contact">Kerja sama dengan {agencyName}</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
