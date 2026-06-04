import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-zinc-900 text-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white text-zinc-900 flex items-center justify-center font-bold">
                EC
              </div>
              <span className="font-bold text-2xl tracking-tighter">Ethan Chen</span>
            </div>
            <p className="text-zinc-400 max-w-sm mb-8 leading-relaxed font-light italic">
              {t('hero.description').slice(0, 80)}...
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 italic">Navigation</h4>
              <ul className="space-y-3 text-xs uppercase tracking-widest text-zinc-400">
                <li><a href="#profile" className="hover:text-white transition-colors">{t('nav.profile')}</a></li>
                <li><a href="#topics" className="hover:text-white transition-colors">{t('nav.services')}</a></li>
                <li><a href="#timeline" className="hover:text-white transition-colors">{t('nav.timeline')}</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 italic">Connect</h4>
              <ul className="space-y-3 text-xs uppercase tracking-widest text-zinc-400">
                <li><a href="https://www.zaih.com/falcon/mentors/2bllbjjbq3k" target="_blank" className="hover:text-white transition-colors">在行 / Zaih</a></li>
                <li><a href="mailto:ethan0112@163.com" className="hover:text-white transition-colors">Email</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-12 border-t border-zinc-800 flex flex-col md:flex-row justify-between gap-8 items-center">
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} ETHAN CHEN &mdash; BEIJING / TAIPEI
          </p>
        </div>
      </div>
    </footer>
  );
}
