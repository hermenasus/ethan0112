import { TimelineEvent, ConsultingTopic, MediaItem, Review } from './types';

export const timeline: TimelineEvent[] = [
  {
    year: '2024 - Present',
    title: 'Independent Angel Investor & Senior Career Advisor',
    subtitle: 'High-end Talent Strategy & Team Evaluation',
    description: 'Specializing in evaluating startup teams through deep-dive interviews and providing transition advisory for senior tech experts and executives.'
  },
  {
    year: '2017 - 2024',
    title: 'Partner at Linxi Venture (麟玺创投)',
    subtitle: 'Venture Capital & Post-investment Empowerment',
    description: 'Empowered 30+ portfolio projects. Held "veto power" on talent evaluation for core leadership positions (CEO, CTO, VP) and connected over 2,000 high-end talent profiles.'
  },
  {
    year: '2015 - 2016',
    title: 'VP of Operations',
    subtitle: 'Siyuan Technology (北京思源科技)',
    description: 'Built a 100+ person operations center from scratch. Coordinated cross-functional teams across technology, product, and marketing for large-scale platform products.'
  },
  {
    year: '2009 - 2015',
    title: 'Co-founder & COO',
    subtitle: 'Jiepang (街旁網) / Nuandao (暖島網)',
    description: 'Core member of China\'s first LBS social platform, scaling to 5 million users. Built Nuandao from 0 to 1, covering buyers, technology, and logistics.'
  },
  {
    year: '1994 - 2009',
    title: 'R&D Deputy Director & Senior PM',
    subtitle: 'ASUS (華碩電腦) / SYSTEX (精誠資訊)',
    description: 'Led R&D for large-scale medical systems (PACS/RIS/HIS) with FDA Class II certification. Established technical talent assessment systems for architects and CTOs.'
  }
];

export const consultingTopics: ConsultingTopic[] = [
  {
    title: '大學生就業指導：第一步就做對',
    description: '針對在學生與畢業生，協助釐清方向、選擇公司與職位、準備履歷與面試，並處理求職焦慮。',
    bullets: [
      '從個人優勢與現實市場中精準定位',
      '評估 Offer、公司與職位的長期價值',
      '建立個人的職涯敘事，脫穎而出'
    ]
  },
  {
    title: '高端人才職涯建議：從專家到高管',
    description: '為資深技術專家與管理層提供職涯復盤。 Ethan 擅長深度挖掘候選人的核心動機與潛質。',
    bullets: [
      '梳理 14 年技術 + 17 年管理/投資的複合經驗',
      '解決「不懂業務」的痛點，對齊商業視角',
      '識別簡歷背後的「真偽含金量」與轉型建議'
    ]
  },
  {
    title: '創業團隊盡調與組織搭建',
    description: '以投資人視角協助創業者將複雜選擇轉化為行動。具備從 0-1 搭建百人團隊的實戰經驗。',
    bullets: [
      '創始人盡調評估：領導力、抗壓性與團隊架構',
      '補齊企業人才短板（CEO、CTO、VP 等關鍵崗位）',
      '融資節奏把控與投後人才戰略全链路支持'
    ]
  }
];

export const media: MediaItem[] = [
  { id: '1', title: 'CCTV-13 專訪：從台灣來的網站創業者', imageUrl: '/media.png', category: 'Media' },
  { id: '2', title: 'Tech Conference Keynote Speech', imageUrl: '/keynote.png', category: 'Event' },
  { id: '3', title: '麟玺創投：投後人才賦能與創業者盡調', imageUrl: '/advisory.png', category: 'Investment' },
  { id: '4', title: '清華三創大賽：導師與項目選拔', imageUrl: '/headshot.png', category: 'Education' },
  { id: '5', title: '在行平臺 2018 年度行家獎盃', imageUrl: '/award_zaih.png', category: 'Award' },
  { id: '6', title: '北京柏林商務論壇：行業資源對接', imageUrl: '/media.png', category: 'Event' }
];

export const reviews: Review[] = [
  {
    name: '用戶 A',
    date: '2024-03-15',
    content: 'Ethan 的諮詢非常落地，幫我釐清了困擾半年的職業選擇問題。',
    rating: 5
  },
  {
    name: '創業家 B',
    date: '2024-02-10',
    content: '從投資人的角度給出的建議一針見血，對我們的 BP 改進非常大。',
    rating: 5
  },
  {
    name: '學生 C',
    date: '2024-01-05',
    content: '面試指導非常專業，順利拿到了心儀的實習 offer。',
    rating: 5
  }
];
