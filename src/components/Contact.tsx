import Section from './Section';
import { Linkedin, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();

  return (
    <Section id="contact" title={t('nav.profile')} subtitle="Connect via LinkedIn or book a session on Zaih">
      <div className="grid md:grid-cols-2 gap-12">
        <a
          href="https://www.linkedin.com/in/ethanchen1/"
          target="_blank"
          rel="noopener noreferrer"
          className="group p-12 bg-white border border-zinc-100 rounded-none hover:border-zinc-900 transition-all flex flex-col justify-between aspect-[16/10]"
        >
          <div>
            <div className="w-12 h-12 bg-zinc-100 text-zinc-900 flex items-center justify-center rounded-none mb-10 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
              <Linkedin size={20} />
            </div>
            <h3 className="text-3xl font-medium text-zinc-900 mb-4 tracking-tight">LinkedIn</h3>
            <p className="text-zinc-500 mb-8 leading-relaxed font-light">
              Connect to professional network and view full career details.
            </p>
          </div>
          <span className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 group-hover:text-zinc-900 transition-colors">
            Profile <ExternalLink size={12} />
          </span>
        </a>

        <a
          href="https://www.zaih.com/falcon/mentors/2bllbjjbq3k"
          target="_blank"
          rel="noopener noreferrer"
          className="group p-12 bg-zinc-50 border border-zinc-100 rounded-none hover:border-zinc-900 transition-all flex flex-col justify-between aspect-[16/10]"
        >
          <div>
            <div className="w-12 h-12 bg-zinc-900 text-white flex items-center justify-center rounded-none mb-10 group-hover:scale-105 transition-transform">
              <span className="text-xs font-bold font-mono">ZH</span>
            </div>
            <h3 className="text-3xl font-medium text-zinc-900 mb-4 tracking-tight">在行 / Advisory</h3>
            <p className="text-zinc-500 mb-8 leading-relaxed font-light">
              {t('reviews.subtitle')} & {t('reviews.stats.total')} {t('reviews.loadMore').slice(-2)}.
            </p>
          </div>
          <span className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 group-hover:text-zinc-900 transition-colors">
            Book Now <ExternalLink size={12} />
          </span>
        </a>
      </div>
    </Section>
  );
}
