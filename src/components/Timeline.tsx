import Section from './Section';
import { useTranslation } from 'react-i18next';

interface TimelineItem {
  year: string;
  title: string;
  subtitle: string;
  desc?: string;
}

export default function Timeline() {
  const { t } = useTranslation();
  const timelineItems = t('experience.items', { returnObjects: true }) as TimelineItem[];

  return (
    <Section id="timeline" title={t('experience.title')} subtitle={t('experience.subtitle')}>
      <div className="relative border-l border-zinc-100 ml-4 md:ml-0 md:before:absolute md:before:left-1/2 md:before:h-full md:before:w-px md:before:bg-zinc-100 md:border-l-0">
        {Array.isArray(timelineItems) && timelineItems.map((item, index) => (
          <div
            key={index}
            className={`mb-20 relative flex flex-col md:flex-row items-center ${
              index % 2 === 0 ? 'md:flex-row-reverse' : ''
            }`}
          >
            {/* Dot */}
            <div className="absolute left-[-5px] md:left-1/2 md:-translate-x-1/2 w-2.5 h-2.5 bg-zinc-900 rounded-none z-10" />
            
            <div className="w-full md:w-1/2 px-12 pt-1">
              <div
                className={`flex flex-col ${
                  index % 2 === 0 ? 'md:items-start text-left' : 'md:items-end md:text-right'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 italic mb-2">{item.year}</span>
                <h3 className="text-xl font-medium text-zinc-900 mb-1">{item.title}</h3>
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">{item.subtitle}</h4>
                {item.desc && (
                  <p className="text-zinc-500 text-sm leading-relaxed max-w-md font-light">
                    {item.desc}
                  </p>
                )}
              </div>
            </div>
            <div className="hidden md:block md:w-1/2" />
          </div>
        ))}
      </div>
    </Section>
  );
}
