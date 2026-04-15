'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { TrustedPartnerItem } from '@/lib/marketing-data';

export function TrustedBySection({ partners }: { partners: TrustedPartnerItem[] }) {
  const duplicated = [...partners, ...partners];

  return (
    <section className="relative py-20 border-y border-border/40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-card/20 to-background" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Dipercaya & dipilih mitra
          </p>
          <p className="mt-2 text-lg font-medium text-foreground/90">
            Brand yang pernah bergerak bareng kami
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="flex gap-12 sm:gap-16 animate-scroll py-2 items-center">
            {duplicated.map((client, index) => (
              <div
                key={`${client.name}-${index}`}
                className="flex-shrink-0 flex items-center justify-center min-w-[140px] h-16 sm:h-[72px] rounded-xl border border-border/30 bg-card/30 px-4 backdrop-blur-sm"
              >
                {client.imageUrl ? (
                  <div className="relative h-10 w-[120px] sm:h-11 sm:w-[130px]">
                    <Image
                      src={client.imageUrl}
                      alt={client.name}
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <span className="text-xs sm:text-sm font-bold tracking-widest text-muted-foreground/50 text-center line-clamp-2">
                    {client.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
