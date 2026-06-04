import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section id="top" className="min-h-screen flex flex-col justify-center px-6 relative">
      <div className="max-w-7xl mx-auto w-full pt-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 italic"
        >
          {t('hero.location')} &bull; {t('hero.role')}
        </motion.div>
        
        <div className="flex flex-col lg:flex-row lg:items-center gap-12 mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-[8rem] font-medium text-zinc-900 leading-[0.9] tracking-tighter whitespace-pre-line"
          >
            {t('hero.name').replace(' ', '\n')}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-48 h-48 md:w-64 md:h-64 grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden border border-zinc-100"
          >
            <img 
              src="/ethan_chen_professional_headshot_1780492073621.png" 
              alt="Ethan Chen" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-end">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-500 leading-relaxed max-w-xl"
          >
            {t('hero.description')}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col gap-6"
          >
            <div className="flex gap-8">
              <a href="#topics" className="text-xs font-bold uppercase tracking-widest border-b border-zinc-900 pb-1 hover:text-zinc-600 hover:border-zinc-400 transition-all">{t('nav.services')}</a>
              <a href="#profile" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-all">{t('nav.profile')}</a>
            </div>
            <div className="text-[10px] text-zinc-300 uppercase tracking-widest font-mono">
              Availability: Q4 2026
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-12 right-12 text-zinc-300 hidden lg:flex flex-col items-center gap-4"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] rotate-90 origin-right mb-8">Scroll</span>
        <div className="w-px h-24 bg-zinc-100" />
      </motion.div>
    </section>
  );
}
