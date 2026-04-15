'use client';

import { motion } from 'framer-motion';

type MotionFadeInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
};

export function MotionFadeIn({
  children,
  className,
  delay = 0,
  duration = 0.6,
}: MotionFadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
