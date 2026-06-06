'use client';

import { motion, useInView } from 'framer-motion';
import { type ReactNode, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useMediaQuery';

export function FadeUp({
 children,
 delay = 0,
 className,
 y = 24,
 style,
}: {
 children: ReactNode;
 delay?: number;
 className?: string;
 y?: number;
 style?: React.CSSProperties;
}) {
 const ref = useRef<HTMLDivElement>(null);
 const inView = useInView(ref, { once: true, margin: '-60px 0px' });
 const reduced = useReducedMotion();

 return (
  <motion.div
   ref={ref}
   initial={{ opacity: 0, y: reduced ? 0 : y }}
   animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: reduced ? 0 : y }}
   transition={{ duration: reduced ? 0 : 0.6, delay }}
   className={className}
   style={style}
  >
   {children}
  </motion.div>
 );
}

export function StaggerChildren({
 children,
 className,
 stagger = 0.07,
 style,
}: {
 children: ReactNode;
 className?: string;
 stagger?: number;
 style?: React.CSSProperties;
}) {
 const reduced = useReducedMotion();

 return (
  <motion.div
   className={className}
   style={style}
   initial="hidden"
   whileInView="show"
   viewport={{ once: true, margin: '-40px' }}
   transition={{ staggerChildren: reduced ? 0 : stagger }}
  >
   {Array.isArray(children)
    ? (children as ReactNode[]).map((child, i) => (
       <motion.div
        key={i}
        variants={{
         hidden: { opacity: 0, y: 20 },
         show: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : 0.5 } },
        }}
       >
        {child}
       </motion.div>
      ))
    : (
       <motion.div
        variants={{
         hidden: { opacity: 0, y: 20 },
         show: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : 0.5 } },
        }}
       >
        {children}
       </motion.div>
     )}
  </motion.div>
 );
}

export function PageTransition({ children }: { children: ReactNode }) {
 return (
  <motion.div
   initial={{ opacity: 0, filter: 'blur(8px)' }}
   animate={{ opacity: 1, filter: 'blur(0px)' }}
   transition={{ duration: 0.25 }}
  >
   {children}
  </motion.div>
 );
}

export function PulseIcon({
 children,
 className,
}: {
 children: ReactNode;
 className?: string;
}) {
 return (
  <motion.div
   animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
   transition={{ repeat: Infinity, duration: 2.2 }}
   className={className}
  >
   {children}
  </motion.div>
 );
}

export function AnimatedCounter({
 value,
 duration = 1.2,
 suffix = '',
}: {
 value: number;
 duration?: number;
 suffix?: string;
}) {
 return (
  <motion.span
   initial={{ opacity: 0, scale: 0.6 }}
   animate={{ opacity: 1, scale: 1 }}
   transition={{ duration: 0.4 }}
  >
   {value}{suffix}
  </motion.span>
 );
}
