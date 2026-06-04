import Section from './Section';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const { t } = useTranslation();

  return (
    <Section id="profile" title={t('profile.title')} subtitle={t('profile.subtitle')}>
      <div className="grid md:grid-cols-3 gap-16 items-start">
        <div className="md:col-span-2 space-y-8">
          <p className="text-xl text-zinc-600 leading-relaxed font-light">
            {t('profile.p1')}
          </p>
          <p className="text-xl text-zinc-600 leading-relaxed font-light">
            {t('profile.p2')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-lg">
              <h4 className="text-sm font-bold text-zinc-900 mb-3">{t('profile.advantage_title')}</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {t('profile.advantage_desc')}
              </p>
            </div>
            <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-lg">
              <h4 className="text-sm font-bold text-zinc-900 mb-3">{t('profile.endorsement_title')}</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {t('profile.endorsement_desc')}
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8">
          <div>
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic mb-2">{t('profile.status_experience')}</h4>
            <div className="text-4xl font-medium text-zinc-900">{t('profile.exp_value')}</div>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic mb-2">{t('profile.status_rating')}</h4>
            <div className="text-4xl font-medium text-zinc-900">{t('profile.rating_value')}</div>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic mb-2">{t('profile.status_role')}</h4>
            <div className="text-4xl font-medium text-zinc-900">{t('profile.role_value')}</div>
          </div>
        </div>
      </div>

      <div className="mt-24 pt-24 border-t border-zinc-100">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.3em] mb-12">{t('profile.honors_title')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="group">
            <div className="aspect-[3/4] bg-zinc-50 border border-zinc-100 overflow-hidden mb-4 group-hover:border-zinc-900 transition-colors">
              <img src="/ethan_chen_conference_keynote_speech_1780492102229.png" alt={t('profile.honors.item1.title')} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
            </div>
            <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{t('profile.honors.item1.cat')}</p>
            <p className="text-sm font-medium text-zinc-900">{t('profile.honors.item1.title')}</p>
          </div>
          <div className="group">
            <div className="aspect-[3/4] bg-zinc-50 border border-zinc-100 overflow-hidden mb-4 group-hover:border-zinc-900 transition-colors">
              <img src="/ethan_chen_media_interview_beijing_1780492088211.png" alt={t('profile.honors.item2.title')} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
            </div>
            <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{t('profile.honors.item2.cat')}</p>
            <p className="text-sm font-medium text-zinc-900">{t('profile.honors.item2.title')}</p>
          </div>
          <div className="group">
            <div className="aspect-[3/4] bg-zinc-50 border border-zinc-100 overflow-hidden mb-4 group-hover:border-zinc-900 transition-colors">
              <img src="/zaih_annual_mentor_award_2018_1780493414785.png" alt={t('profile.honors.item3.title')} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
            </div>
            <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{t('profile.honors.item3.cat')}</p>
            <p className="text-sm font-medium text-zinc-900">{t('profile.honors.item3.title')}</p>
          </div>
          <div className="group">
            <div className="aspect-[3/4] bg-zinc-50 border border-zinc-100 overflow-hidden mb-4 group-hover:border-zinc-900 transition-colors">
              <img src="/ethan_chen_career_advisory_session_1780492117322.png" alt={t('profile.honors.item4.title')} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
            </div>
            <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{t('profile.honors.item4.cat')}</p>
            <p className="text-sm font-medium text-zinc-900">{t('profile.honors.item4.title')}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
