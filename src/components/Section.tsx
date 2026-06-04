import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface SectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export default function Section({ id, title, subtitle, children, className = '' }: SectionProps) {
  return (
    <section id={id} className={`py-16 md:py-20 px-6 max-w-7xl mx-auto ${className}`}>
      {title && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-12"
        >
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] italic block mb-4">{id}</span>
          <h2 className="text-3xl md:text-5xl font-medium text-zinc-900 tracking-tight mb-6">{title}</h2>
          {subtitle && <p className="text-lg text-zinc-500 max-w-2xl leading-relaxed">{subtitle}</p>}
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {children}
      </motion.div>
    </section>
  );
}
