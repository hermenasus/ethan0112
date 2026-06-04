import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: t('nav.profile'), href: '#profile' },
    { name: t('nav.timeline'), href: '#timeline' },
    { name: t('nav.services'), href: '#topics' },
    { name: t('nav.media'), href: '#media' },
    { name: t('nav.reviews'), href: '#reviews' },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-zinc-100 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#top" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-zinc-900 text-white flex items-center justify-center font-bold text-lg rounded-none transition-transform group-hover:scale-105">
            EC
          </div>
          <span className="font-bold text-zinc-900 tracking-tight text-xl">Ethan Chen</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <LanguageSwitcher />
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-900"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <motion.div
        initial={false}
        animate={mobileMenuOpen ? 'open' : 'closed'}
        variants={{
          open: { opacity: 1, height: 'auto', display: 'block' },
          closed: { opacity: 0, height: 0, transitionEnd: { display: 'none' } },
        }}
        className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
      >
        <div className="flex flex-col p-6 gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-gray-800 hover:text-gray-600"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 border-t border-zinc-100">
            <LanguageSwitcher />
          </div>
        </div>
      </motion.div>
    </nav>
  );
}
