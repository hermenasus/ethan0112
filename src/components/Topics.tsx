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
      <div className="grid md:grid-cols-2 gap-8">
        {topics.map((topic, index) => (
          <div
            key={topic.id}
            className="flex flex-col md:flex-row gap-6 p-6 border border-zinc-100 hover:border-zinc-900 transition-all bg-white group"
          >
            <div className="md:w-1/3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest italic block mb-4">
                  Topic 0{index + 1}
                </span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-zinc-50 border border-zinc-100 px-3 py-1.5 rounded-sm">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">
                      {t('services.online')}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-zinc-900">
                      {topic.priceOnline}
                    </span>
                  </div>
                  {topic.hasMeetup && (
                    <div className="flex items-center justify-between bg-zinc-50 border border-zinc-100 px-3 py-1.5 rounded-sm">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">
                        {t('services.meetup')}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-zinc-900">
                        {topic.priceMeetup}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="md:w-2/3 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-medium text-zinc-900 leading-tight mb-2 group-hover:text-zinc-600 transition-colors">
                  {topic.title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-light mb-4">
                  {topic.desc}
                </p>
                <ul className="space-y-2">
                  {Array.isArray(topic.bullets) && topic.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex gap-2 text-xs text-zinc-400 font-medium leading-relaxed italic">
                      <span className="text-zinc-200">/</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
