import Section from './Section';
import { useTranslation } from 'react-i18next';

interface MediaItem {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
}

export default function Media() {
  const { t } = useTranslation();
  const mediaItems = t('media.items', { returnObjects: true }) as MediaItem[];

  return (
    <Section id="media" title={t('media.title')} subtitle={t('media.subtitle')}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {Array.isArray(mediaItems) && mediaItems.map((item, index) => (
          <div key={item.id} className="group cursor-pointer">
            <div className="aspect-[16/10] bg-zinc-50 border border-zinc-100 flex items-center justify-center overflow-hidden mb-6 transition-all group-hover:border-zinc-900">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                  {item.category || 'Archive'}
                </p>
                <h3 className="text-lg font-medium text-zinc-900 leading-tight">{item.title}</h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-300">0{index + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
