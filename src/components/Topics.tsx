import Section from './Section';
import { useTranslation } from 'react-i18next';

export default function Topics() {
  const { t } = useTranslation();

  const topicIds = ['item1', 'item2', 'item3', 'item4', 'item5'];
  
  const topics = topicIds.map(id => ({
    id,
    title: t(`services.${id}.title`),
    desc: t(`services.${id}.desc`),
    bullets: t(`services.${id}.bullets`, { returnObjects: true }) as string[],
    priceOnline: t(`services.${id}.priceOnline`),
    priceMeetup: t(`services.${id}.priceMeetup`),
    hasOnline: true,
    hasMeetup: true
  }));

  return (
    <Section id="topics" title={t('services.title')} subtitle={t('services.subtitle')}>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
        {topics.map((topic, index) => (
          <div
            key={topic.id}
            className="group"
          >
            <div className="aspect-[16/10] bg-zinc-50 border border-zinc-100 flex flex-col justify-between p-8 overflow-hidden mb-8 transition-all group-hover:border-zinc-300 relative">
              <span className="text-zinc-100 text-8xl font-black italic absolute -bottom-4 -right-4 select-none">0{index + 1}</span>
              
              <div className="flex flex-col gap-2 relative z-10">
                <div className="flex items-center justify-between bg-white border border-zinc-200 px-3 py-2 rounded-sm shadow-sm">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                    {t('services.online')}
                  </span>
                  <span className="text-xs font-mono font-bold text-zinc-900 ml-4">
                    {topic.priceOnline}
                  </span>
                </div>
                {topic.hasMeetup && (
                  <div className="flex items-center justify-between bg-white border border-zinc-200 px-3 py-2 rounded-sm shadow-sm">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                      {t('services.meetup')}
                    </span>
                    <span className="text-xs font-mono font-bold text-zinc-900 ml-4">
                      {topic.priceMeetup}
                    </span>
                  </div>
                )}
              </div>

              <div className="relative z-10 text-zinc-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-medium text-zinc-900 leading-tight group-hover:text-zinc-600 transition-colors">
                {topic.title}
              </h3>
              
              <p className="text-sm text-zinc-500 leading-relaxed font-light">
                {topic.desc}
              </p>

              <ul className="pt-4 space-y-3">
                {Array.isArray(topic.bullets) && topic.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex gap-3 text-xs text-zinc-400 font-medium leading-relaxed italic">
                    <span className="text-zinc-200">/</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
