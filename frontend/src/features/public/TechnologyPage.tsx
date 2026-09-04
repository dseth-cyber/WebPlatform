import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSiteContent } from '../../hooks/useSiteContent';
import {
  Cpu,
  Zap,
  Eye,
  Gauge,
  Shield,
  Wrench,
  Layers,
  Pin,
} from 'lucide-react';

const AVAILABLE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Cpu,
  Zap,
  Eye,
  Gauge,
  Shield,
  Wrench,
  Layers,
};

export const TechnologyPage: React.FC<{ onNavigate: (path: string) => void }> = () => {
  const { i18n } = useTranslation();
  const { settings } = useSiteContent();
  const isEn = i18n.language === 'en';

  const rawCards = settings.technologyCards && settings.technologyCards.length > 0
    ? settings.technologyCards
    : [
        {
          id: 'tech-1',
          icon: 'Cpu',
          titleTh: 'Soudronic High-Speed Canbody Welder (สวิตเซอร์แลนด์)',
          titleEn: 'Soudronic High-Speed Canbody Welder (Switzerland)',
          descTh: 'เครื่องเชื่อมตะเข็บไฟฟ้าอัตโนมัติความเร็วสูง 600 กระป๋องต่อนาที พร้อมระบบควบคุมความร้อนสม่ำเสมอ รอยเชื่อมเรียบเนียน ป้องกันการรั่วซึม 100%',
          descEn: 'High-speed 600 cpm automatic electronic seam welder with adaptive heat control, delivering leak-proof hermetic integrity.',
        },
        {
          id: 'tech-2',
          icon: 'Eye',
          titleTh: 'AI Visual Camera Seam & Defect Inspection System',
          titleEn: 'AI Visual Camera Seam & Defect Inspection System',
          descTh: 'ระบบกล้องตรวจจับข้อบกพร่องด้วยปัญญาประดิษฐ์ (AI) ตรวจสอบความสมบูรณ์ของแล็กเกอร์และมิติฝา EOE ทุกชิ้นแบบ Real-time',
          descEn: 'Real-time AI computer vision defect scanner verifying lacquer continuity, double seam dimensions, and easy-open end integrity.',
        },
        {
          id: 'tech-3',
          icon: 'Gauge',
          titleTh: 'Automatic Nitrogen Flanging & Beading Lines',
          titleEn: 'Automatic Nitrogen Flanging & Beading Lines',
          descTh: 'เครื่องปั๊มลอนและบานปากกระป๋องความแม่นยำสูง เพิ่มความแข็งแรงต่อแรงดันสุญญากาศขณะผ่านกระบวนการฆ่าเชื้อ (Autoclave Retort)',
          descEn: 'High-precision flanging and body beading machinery engineered to withstand intense vacuum and autoclave retort sterilization.',
        },
        {
          id: 'tech-4',
          icon: 'Zap',
          titleTh: 'Automated 6-Color UV Offset Metal Printing Press',
          titleEn: 'Automated 6-Color UV Offset Metal Printing Press',
          descTh: 'แท่นพิมพ์แผ่นโลหะระบบยูวี 6 สี ช่วยให้หมึกแห้งตัวทันที ให้ความเงางามและทนทานต่อการขูดขีดสูงสุด',
          descEn: 'Advanced 6-color ultraviolet sheet-fed offset press ensuring instantaneous ink curing, vibrant gamut, and scratch resistance.',
        },
      ];

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
        <span className="text-xs font-bold uppercase tracking-wider text-theme-primary">
          {settings.technologyBadge || 'Manufacturing Automation'}
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-theme-text leading-tight">
          {settings.technologyHeading || 'เทคโนโลยีการผลิตกระป๋องโลหะความเร็วสูงและ AI อัจฉริยะ'}
        </h1>
        <p className="text-sm sm:text-base text-theme-text-muted leading-relaxed">
          {settings.technologyDescription ||
            'ยกระดับสายการผลิตด้วยเครื่องจักรทันสมัยระดับโลกเพื่อความแม่นยำระดับไมครอนและมาตรฐานความปลอดภัยสูงสุด'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sortedCards.map((card) => {
          const IconComp = AVAILABLE_ICONS[card.icon] || Cpu;

          return (
            <div
              key={card.id}
              className="glow-card group flex flex-col justify-between rounded-2xl border border-theme-border bg-theme-surface overflow-hidden transition-all shadow-xl"
            >
              {card.image && (
                <div className="relative h-56 w-full overflow-hidden bg-slate-900 border-b border-theme-border/50">
                  <img
                    src={card.image}
                    alt={card.titleTh}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/factory-building.jpg';
                    }}
                  />
                  <div className="absolute top-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-black/60 backdrop-blur-md text-theme-primary border border-theme-primary/30 shadow-lg">
                    <IconComp className="h-5 w-5" />
                  </div>
                  {Boolean(card.isPinned) && (
                    <span className="absolute top-3 right-3 flex items-center gap-1 rounded-md bg-amber-500/90 text-slate-950 font-bold px-2 py-0.5 text-[10px] shadow-sm backdrop-blur-md">
                      <Pin className="h-3 w-3 fill-slate-950" />
                      <span>แนะนำ</span>
                    </span>
                  )}
                </div>
              )}
              <div className="p-7 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    {!card.image && (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-theme-primary/10 text-theme-primary">
                        <IconComp className="h-5 w-5" />
                      </div>
                    )}
                    {!card.image && Boolean(card.isPinned) && (
                      <span className="flex items-center gap-1 rounded-md bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                        <Pin className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>📌 แนะนำ</span>
                      </span>
                    )}
                  </div>
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
