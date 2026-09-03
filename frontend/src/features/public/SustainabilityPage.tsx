import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSiteContent } from '../../hooks/useSiteContent';
import {
  Recycle,
  Sun,
  Leaf,
  Droplets,
  Flame,
  Wind,
  Shield,
} from 'lucide-react';

const AVAILABLE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Recycle,
  Sun,
  Droplets,
  Leaf,
  Wind,
  Flame,
  Shield,
};

export const SustainabilityPage: React.FC<{ onNavigate: (path: string) => void }> = () => {
  const { i18n } = useTranslation();
  const { settings } = useSiteContent();
  const isEn = i18n.language === 'en';

  const cards = settings.sustainabilityCards && settings.sustainabilityCards.length > 0
    ? settings.sustainabilityCards
    : [
        {
          id: 'sus-1',
          icon: 'Recycle',
          titleTh: 'Infinitely Recyclable',
          titleEn: 'Infinitely Recyclable',
          descTh: 'โลหะสามารถรีไซเคิลวนซ้ำได้อย่างไม่จำกัด ช่วยลดการปล่อยคาร์บอนไดออกไซด์ได้ถึง 75% เมื่อเทียบกับการผลิตโลหะใหม่จากแร่',
          descEn: 'Metal can be recycled endlessly without quality degradation, saving up to 75% CO2 compared to primary virgin ore extraction.',
        },
        {
          id: 'sus-2',
          icon: 'Sun',
          titleTh: 'Solar Rooftop 1.2 MW',
          titleEn: 'Solar Rooftop 1.2 MW',
          descTh: 'โรงงานสมุทรสาครใช้พลังงานไฟฟ้าจากแสงอาทิตย์บนหลังคาโรงงาน ช่วยลดก๊าซเรือนกระจกกว่า 1,200 ตันคาร์บอนต่อปี',
          descEn: 'Our Samut Sakhon plant operates with clean solar rooftop energy, mitigating over 1,200 metric tons of CO2 emissions annually.',
        },
        {
          id: 'sus-3',
          icon: 'Droplets',
          titleTh: 'Zero Industrial Wastewater',
          titleEn: 'Zero Industrial Wastewater',
          descTh: 'ระบบบำบัดและหมุนเวียนน้ำในกระบวนการหล่อเย็นแบบปิด 100% ไม่มีการปล่อยน้ำเสียสู่แหล่งน้ำสาธารณะ',
          descEn: 'Closed-loop cooling and water reclamation facility ensures zero hazardous industrial wastewater discharge into public waterways.',
        },
      ];

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-16 sm:px-6 lg:px-8 space-y-12 font-sans">
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
          {settings.sustainabilityBadge || 'Circular Economy & ESG'}
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-theme-text leading-tight">
          {settings.sustainabilityHeading || 'โลหะ... วัสดุเพื่อความยั่งยืนที่รีไซเคิลได้ไม่รู้จบ'}
        </h1>
        <p className="text-sm sm:text-base text-theme-text-muted leading-relaxed">
          {settings.sustainabilityDescription ||
            'แผ่นเหล็กเคลือบดีบุกและอลูมิเนียมเป็นหนึ่งในวัสดุบรรจุภัณฑ์ที่เป็นมิตรต่อสิ่งแวดล้อมมากที่สุดในโลก สามารถนำกลับมาหลอมใช้ใหม่ได้ 100% โดยไม่สูญเสียคุณสมบัติเชิงกล'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card) => {
          const IconComp = AVAILABLE_ICONS[card.icon] || Leaf;

          return (
            <div
              key={card.id}
              className="glow-card group flex flex-col justify-between rounded-2xl border border-emerald-500/30 bg-theme-surface overflow-hidden transition-all shadow-xl"
            >
              {card.image && (
                <div className="relative h-48 w-full overflow-hidden bg-slate-900 border-b border-theme-border/50">
                  <img
                    src={card.image}
                    alt={card.titleTh}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/hero-fullwidth.jpg';
                    }}
                  />
                  <div className="absolute top-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30 shadow-lg">
                    <IconComp className="h-5 w-5" />
                  </div>
                </div>
              )}
              <div className="p-7 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {!card.image && (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                      <IconComp className="h-6 w-6" />
                    </div>
                  )}
                  <h3 className="font-display text-base font-bold text-theme-text">
                    {isEn ? (card.titleEn || card.titleTh) : (card.titleTh || card.titleEn)}
                  </h3>
                  <p className="text-xs text-theme-text-muted leading-relaxed">
                    {isEn ? (card.descEn || card.descTh) : (card.descTh || card.descEn)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
