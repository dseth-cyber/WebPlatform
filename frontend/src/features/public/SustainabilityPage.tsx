import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSiteContent, SustainabilityCardSetting } from '../../hooks/useSiteContent';
import {
  Recycle,
  Sun,
  Leaf,
  Droplets,
  Flame,
  Wind,
  Shield,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Pin,
} from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

const AVAILABLE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Recycle,
  Sun,
  Droplets,
  Leaf,
  Wind,
  Flame,
  Shield,
};

export const SustainabilityPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { i18n } = useTranslation();
  const { settings } = useSiteContent();
  const currentLang = (i18n.language || 'th') as 'th' | 'en' | 'jp' | 'cn' | 'mm';
  const isNonThai = currentLang !== 'th';
  const isEn = isNonThai;

  const susTrans = isNonThai && settings.sustainabilityTranslations ? settings.sustainabilityTranslations[currentLang] : null;
  const sustainabilityBadge = susTrans?.badge || settings.sustainabilityBadge || 'Circular Economy & ESG';
  const sustainabilityHeading = susTrans?.heading || settings.sustainabilityHeading || 'โลหะ... วัสดุเพื่อความยั่งยืนที่รีไซเคิลได้ไม่รู้จบ';
  const sustainabilityDescription = susTrans?.description || settings.sustainabilityDescription || 'แผ่นเหล็กเคลือบดีบุกและอลูมิเนียมเป็นหนึ่งในวัสดุบรรจุภัณฑ์ที่เป็นมิตรต่อสิ่งแวดล้อมมากที่สุดในโลก สามารถนำกลับมาหลอมใช้ใหม่ได้ 100% โดยไม่สูญเสียคุณสมบัติเชิงกล';

  const [selectedCard, setSelectedCard] = useState<SustainabilityCardSetting | null>(null);

  const rawCards: SustainabilityCardSetting[] = settings.sustainabilityCards && settings.sustainabilityCards.length > 0
    ? settings.sustainabilityCards
    : [
        {
          id: 'sus-1',
          icon: 'Recycle',
          titleTh: 'Infinitely Recyclable',
          titleEn: 'Infinitely Recyclable',
          descTh: 'โลหะสามารถรีไซเคิลวนซ้ำได้อย่างไม่จำกัด ช่วยลดการปล่อยคาร์บอนไดออกไซด์ได้ถึง 75% เมื่อเทียบกับการผลิตโลหะใหม่จากแร่',
          descEn: 'Metal can be recycled endlessly without quality degradation, saving up to 75% CO2 compared to primary virgin ore extraction.',
          image: '/images/hero-fullwidth.jpg',
        },
        {
          id: 'sus-2',
          icon: 'Sun',
          titleTh: 'Solar Rooftop 1.2 MW',
          titleEn: 'Solar Rooftop 1.2 MW',
          descTh: 'โรงงานสมุทรสาครใช้พลังงานไฟฟ้าจากแสงอาทิตย์บนหลังคาโรงงาน ช่วยลดก๊าซเรือนกระจกกว่า 1,200 ตันคาร์บอนต่อปี',
          descEn: 'Our Samut Sakhon plant operates with clean solar rooftop energy, mitigating over 1,200 metric tons of CO2 emissions annually.',
          image: '/images/factory-building.jpg',
        },
        {
          id: 'sus-3',
          icon: 'Droplets',
          titleTh: 'Zero Industrial Wastewater',
          titleEn: 'Zero Industrial Wastewater',
          descTh: 'ระบบบำบัดและหมุนเวียนน้ำในกระบวนการหล่อเย็นแบบปิด 100% ไม่มีการปล่อยน้ำเสียสู่แหล่งน้ำสาธารณะ',
          descEn: 'Closed-loop cooling and water reclamation facility ensures zero hazardous industrial wastewater discharge into public waterways.',
          image: '/images/chiotron-office-hero.png',
        },
      ];

  const getCardHighlights = (cardId: string) => {
    switch (cardId) {
      case 'sus-1':
        return [
          'รีไซเคิลวนซ้ำได้ 100% โดยไม่สูญเสียคุณสมบัติเชิงกล',
          'ลดการใช้พลังงานในกระบวนการผลิตได้สูงถึง 95%',
          'สอดคล้องกับมาตรฐานเศรษฐกิจหมุนเวียน (Circular Economy)',
          'ปราศจากสารพิษตกค้างต่อสิ่งแวดล้อม',
        ];
      case 'sus-2':
        return [
          'ติดตั้งแผงโซลาร์เซลล์ขนาด 1.2 MW บนหลังคาโรงงาน',
          'ผลิตพลังงานสะอาดลดคาร์บอนกว่า 1,200 ตัน/ปี',
          'ระบบติดตามการใช้พลังงานอัจฉริยะ (IoT Energy Monitoring)',
          'มุ่งสู่เป้าหมาย Net Zero Carbon Emission',
        ];
      case 'sus-3':
        return [
          'ระบบบำบัดน้ำเสียอุตสาหกรรมมาตรฐานสากล',
          'หมุนเวียนน้ำในระบบหล่อเย็นแบบปิด (Closed Loop System) 100%',
          'ไม่มีการปล่อยน้ำเสียหรือสารเคมีสู่แหล่งน้ำธรรมชาติ',
          'การตรวจวัดคุณภาพน้ำอัตโนมัติตลอด 24 ชั่วโมง',
        ];
      default:
        return [
          'มาตรฐานการจัดการสิ่งแวดล้อม ISO 14001',
          'ขับเคลื่อนเป้าหมาย ESG อย่างเป็นรูปธรรม',
          'ลดผลกระทบต่อสิ่งแวดล้อมในทุกขั้นตอนการผลิต',
        ];
    }
  };

  const sortedCards = useMemo(() => {
    return [...rawCards].sort((a: any, b: any) => {
      if (Boolean(a.isPinned) && !Boolean(b.isPinned)) return -1;
      if (!Boolean(a.isPinned) && Boolean(b.isPinned)) return 1;
      return 0;
    });
  }, [rawCards]);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-16 sm:px-6 lg:px-8 space-y-12 font-sans">
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
          {sustainabilityBadge}
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-theme-text leading-tight">
          {sustainabilityHeading}
        </h1>
        <p className="text-sm sm:text-base text-theme-text-muted leading-relaxed">
          {sustainabilityDescription}
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sortedCards.map((card) => {
          const IconComp = AVAILABLE_ICONS[card.icon] || Leaf;
          const title = isNonThai ? (card.titleEn || card.titleTh) : (card.titleTh || card.titleEn);
          const desc = isNonThai ? (card.descEn || card.descTh) : (card.descTh || card.descEn);

          return (
            <div
              key={card.id}
              onClick={() => setSelectedCard(card)}
              className="glow-card group cursor-pointer flex flex-col justify-between rounded-2xl border border-emerald-500/30 bg-theme-surface overflow-hidden hover:border-emerald-500 hover:shadow-2xl hover:-translate-y-1 transition-all shadow-xl"
            >
              {card.image && (
                <div className="relative h-48 w-full overflow-hidden bg-slate-900 border-b border-theme-border/50">
                  <img
                    src={card.image}
                    alt={title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/hero-fullwidth.jpg';
                    }}
                  />
                  <div className="absolute top-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30 shadow-lg">
                    <IconComp className="h-5 w-5" />
                  </div>
                  {Boolean(card.isPinned) && (
                    <span className="absolute top-3 right-3 flex items-center gap-1 rounded-md bg-amber-500/90 text-slate-950 font-bold px-2 py-0.5 text-[10px] shadow-sm backdrop-blur-md">
                      <Pin className="h-3 w-3 fill-slate-950" />
                      <span>นโยบายแนะนำ</span>
                    </span>
                  )}
                </div>
              )}
              <div className="p-7 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    {!card.image && (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                        <IconComp className="h-6 w-6" />
                      </div>
                    )}
                    {!card.image && Boolean(card.isPinned) && (
                      <span className="flex items-center gap-1 rounded-md bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                        <Pin className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>📌 นโยบายแนะนำ</span>
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-base font-bold text-theme-text group-hover:text-emerald-400 transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs text-theme-text-muted leading-relaxed line-clamp-3">
                    {desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-emerald-500/20 flex items-center gap-1.5 text-xs font-bold text-emerald-500 group-hover:underline">
                  <span>ดูรายละเอียดนโยบาย</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🌟 Rich Detail Modal */}
      <Modal
        isOpen={Boolean(selectedCard)}
        onClose={() => setSelectedCard(null)}
        title={selectedCard ? (isEn ? selectedCard.titleEn : selectedCard.titleTh) : ''}
        maxWidth="2xl"
      >
        {selectedCard && (
          <div className="space-y-5 text-xs font-sans">
            {selectedCard.image && (
              <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl border border-theme-border bg-black relative shadow-inner">
                <img
                  src={selectedCard.image}
                  alt={isEn ? selectedCard.titleEn : selectedCard.titleTh}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/hero-fullwidth.jpg';
                  }}
                />
                <div className="absolute top-3 left-3 rounded-xl bg-black/80 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-emerald-400 border border-emerald-500/30 shadow-lg flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{isEn ? 'Sustainability Initiative' : 'โครงการความยั่งยืนองค์กร'}</span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="font-display text-xl sm:text-2xl font-black text-theme-text leading-snug">
                {isEn ? selectedCard.titleEn : selectedCard.titleTh}
              </h3>
              <p className="text-xs font-bold text-emerald-400">
                {isEn ? 'ESG & Sustainable Manufacturing Policy' : 'นโยบายสิ่งแวดล้อมและความยั่งยืน (ESG)'}
              </p>
              <p className="text-xs sm:text-sm text-theme-text leading-relaxed whitespace-pre-line pt-2">
                {isEn ? selectedCard.descEn : selectedCard.descTh}
              </p>

              {/* Highlights Checklist */}
              <div className="space-y-2 pt-3 border-t border-theme-border">
                <h4 className="font-bold text-theme-text text-xs">
                  {isEn ? 'Key Action & Environmental Impact:' : 'ผลสัมฤทธิ์และจุดเด่นด้านสิ่งแวดล้อม:'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {getCardHighlights(selectedCard.id).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-theme-surface-elevated border border-emerald-500/20 text-theme-text text-xs"
                    >
                      <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-theme-border flex-wrap">
              <button
                type="button"
                onClick={() => setSelectedCard(null)}
                className="rounded-xl border border-theme-border bg-theme-surface px-5 py-2.5 font-bold text-theme-text hover:bg-theme-surface-elevated transition-colors"
              >
                ปิดหน้าต่าง
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedCard(null);
                  onNavigate('/contact');
                }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-2.5 text-xs font-bold text-black shadow-lg shadow-emerald-500/25 hover:brightness-110 transition-all cursor-pointer"
              >
                <span>{isEn ? 'Inquire About ESG Projects' : 'ติดต่อสอบถามโครงการความยั่งยืน'}</span>
                <ArrowRight className="h-4 w-4 text-black" />
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
