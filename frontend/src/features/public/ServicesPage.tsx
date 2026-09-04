import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSiteContent } from '../../hooks/useSiteContent';
import {
  Wrench,
  Printer,
  Layers,
  Cpu,
  ShieldCheck,
  PhoneCall,
  CheckCircle,
  Pin,
} from 'lucide-react';

const AVAILABLE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Layers,
  Printer,
  Wrench,
  ShieldCheck,
  Cpu,
  PhoneCall,
};

export const ServicesPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { i18n } = useTranslation();
  const { settings } = useSiteContent();
  const currentLang = (i18n.language || 'th') as 'th' | 'en' | 'jp' | 'cn' | 'mm';
  const isNonThai = currentLang !== 'th';

  const servicesTrans = isNonThai && settings.servicesTranslations ? settings.servicesTranslations[currentLang] : null;
  const servicesBadge = servicesTrans?.badge || settings.servicesBadge || 'Manufacturing Services';
  const servicesHeading = servicesTrans?.heading || settings.servicesHeading || 'บริการการผลิตและพิมพ์ลายบรรจุภัณฑ์โลหะครบวงจร';
  const servicesDescription = servicesTrans?.description || settings.servicesDescription || 'ตั้งแต่การออกแบบแม่พิมพ์ การพิมพ์ลายออฟเซ็ตความละเอียดสูง ไปจนถึงการขึ้นรูปกระป๋องด้วยเทคโนโลยีสวิตเซอร์แลนด์';

  const rawServices = settings.servicesList && settings.servicesList.length > 0
    ? settings.servicesList
    : [
        {
          id: 'srv-1',
          icon: 'Layers',
          titleTh: 'OEM & ODM Can Manufacturing (รับจ้างผลิตบรรจุภัณฑ์โลหะ)',
          titleEn: 'OEM & ODM Can Manufacturing',
          descTh: 'บริการผลิตกระป๋องโลหะ 3 ชิ้น สำหรับอาหาร ถังเคมีภัณฑ์ และฝาเปิดง่าย ตามขนาดและสเปกที่ลูกค้ากำหนดอย่างแม่นยำ',
          descEn: 'Comprehensive 3-piece sanitary food can, chemical pail, and closure fabrication tailored to custom client specifications.',
          features: [
            'รองรับขนาดเส้นผ่านศูนย์กลาง 52 - 300 มม.',
            'เลือกสารเคลือบภายในตามประเภทอาหาร (BPA-NI)',
            'กำลังการผลิตสูง ส่งมอบตรงเวลา',
          ],
        },
        {
          id: 'srv-2',
          icon: 'Printer',
          titleTh: 'High-Precision 6-Color Metal Offset Printing (บริการพิมพ์ลายบนแผ่นโลหะ)',
          titleEn: 'High-Precision 6-Color Metal Offset Printing',
          descTh: 'ระบบพิมพ์ออฟเซ็ตความละเอียดสูงบนแผ่นเหล็กเคลือบดีบุกและอลูมิเนียม สีสันสดใส คมชัด ทนความร้อนสูง',
          descEn: 'Ultra-high definition 6-color offset lithography on tinplate and aluminum sheets with high thermal endurance.',
          features: [
            'พิมพ์ได้สูงสุด 6 สี พร้อมเคลือบวานิชเงา/ด้าน',
            'หมึกพิมพ์ปลอดภัย Food Contact Grade',
            'ตรวจวัดความแม่นยำของสีด้วยระบบ Spectrophotometer',
          ],
        },
        {
          id: 'srv-3',
          icon: 'Wrench',
          titleTh: 'Tooling & Engineering Support (ออกแบบและพัฒนาแม่พิมพ์)',
          titleEn: 'Tooling & Engineering Support',
          descTh: 'ทีมวิศวกรผู้เชี่ยวชาญให้คำปรึกษา ออกแบบโครงสร้างกระป๋อง ปรับปรุงแม่พิมพ์เพื่อความแน่นหนาของตะเข็บ',
          descEn: 'Dedicated engineering consultancy, precision seamer chuck/roll tooling optimization, and seam cross-section analysis.',
          features: [
            'วิเคราะห์ความแข็งแรงต่อแรงดันสุญญากาศ',
            'ให้คำแนะนำการปรับจูนเครื่อง Seamer ของลูกค้า',
            'บริการตรวจวัด Double Seam หน้างาน',
          ],
        },
      ];

  const sortedServices = useMemo(() => {
    return [...rawServices].sort((a: any, b: any) => {
      if (Boolean(a.isPinned) && !Boolean(b.isPinned)) return -1;
      if (!Boolean(a.isPinned) && Boolean(b.isPinned)) return 1;
      return 0;
    });
  }, [rawServices]);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-16 sm:px-6 lg:px-8 space-y-16 font-sans">
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-theme-primary">
          {servicesBadge}
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-theme-text leading-tight">
          {servicesHeading}
        </h1>
        <p className="text-sm sm:text-base text-theme-text-muted leading-relaxed">
          {servicesDescription}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sortedServices.map((srv) => {
          const IconComp = AVAILABLE_ICONS[srv.icon] || Layers;

          return (
            <div
              key={srv.id}
              className="glow-card group flex flex-col justify-between rounded-2xl border border-theme-border bg-theme-surface overflow-hidden transition-all shadow-xl"
            >
              {srv.image && (
                <div className="relative h-48 w-full overflow-hidden bg-slate-900 border-b border-theme-border/50">
                  <img
                    src={srv.image}
                    alt={srv.titleTh}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/cat-round-cans.jpg';
                    }}
                  />
                  <div className="absolute top-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-black/60 backdrop-blur-md text-theme-primary border border-theme-primary/30 shadow-lg">
                    <IconComp className="h-5 w-5" />
                  </div>
                  {Boolean(srv.isPinned) && (
                    <span className="absolute top-3 right-3 flex items-center gap-1 rounded-md bg-amber-500/90 text-slate-950 font-bold px-2 py-0.5 text-[10px] shadow-sm backdrop-blur-md">
                      <Pin className="h-3 w-3 fill-slate-950" />
                      <span>{isNonThai ? 'Recommended' : 'บริการแนะนำ'}</span>
                    </span>
                  )}
                </div>
              )}
              <div className="p-7 space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    {!srv.image && (
                      <div className="rounded-2xl bg-theme-primary/10 p-3.5 w-fit border border-theme-primary/20 text-theme-primary">
                        <IconComp className="h-7 w-7" />
                      </div>
                    )}
                    {!srv.image && Boolean(srv.isPinned) && (
                      <span className="flex items-center gap-1 rounded-md bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                        <Pin className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>{isNonThai ? '📌 Recommended' : '📌 บริการแนะนำ'}</span>
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-lg font-bold text-theme-text">
                    {isNonThai ? (srv.titleEn || srv.titleTh) : (srv.titleTh || srv.titleEn)}
                  </h3>
                  <p className="text-xs text-theme-text-muted leading-relaxed">
                    {isNonThai ? (srv.descEn || srv.descTh) : (srv.descTh || srv.descEn)}
                  </p>
                {srv.features && srv.features.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-theme-border/50">
                    {srv.features.map((f, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-theme-text">
                        <CheckCircle className="h-3.5 w-3.5 text-theme-primary flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className="w-full rounded-xl bg-theme-primary/15 border border-theme-primary/30 py-2.5 text-xs font-bold text-theme-primary hover:bg-theme-primary hover:text-black transition-all shadow-sm text-center"
                >
                  ปรึกษาทีมวิศวกรผู้เชี่ยวชาญ
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
