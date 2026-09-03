import React from 'react';
import { useTranslation } from 'react-i18next';
import { Factory, ShieldCheck, Award, Users, TrendingUp, Sparkles, Building2, CheckCircle } from 'lucide-react';
import { useSiteContent } from '../../hooks/useSiteContent';

export const AboutPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const { settings } = useSiteContent();

  const shortAddress =
    settings.factoryAddress?.match(/(อำเภอ[^\s]+|อ\.[^\s]+)?\s*(จังหวัด[^\s]+|จ\.[^\s]+)/)?.[0] ||
    (settings.factoryAddress ? settings.factoryAddress.slice(0, 25) : 'จ.สมุทรสาคร');

  const capacityMetric =
    settings.metrics?.find((m) => m.label?.includes('ผลิต')) ||
    settings.metrics?.[3];
  const capacityText = capacityMetric?.value
    ? `${capacityMetric.value} ${capacityMetric.label?.replace(/กำลังการผลิต/g, '').trim() || 'ตัน / ปี'}`
    : '50,000+ ตัน / ปี';

  const missionItems = settings.aboutMission
    ? settings.aboutMission.split('\n').map((s) => s.trim()).filter(Boolean)
    : [
        'ส่งมอบผลิตภัณฑ์บรรจุภัณฑ์โลหะที่มีคุณภาพและความบริสุทธิ์สูง ปลอดสาร BPA 100%',
        'นำเข้าเทคโนโลยีเครื่องจักรผลิตความเร็วสูงเพื่อเพิ่มประสิทธิภาพและความแม่นยำ',
      ];

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-16 sm:px-6 lg:px-8 space-y-12 font-sans">
      {/* Header (Dynamic from Admin Settings & About CMS) */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-theme-primary">
          About {settings.companyNameEn || 'CHIOTRON TECHNOLOGY'}
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-theme-text leading-tight">
          {settings.aboutSubheading || 'ผู้เชี่ยวชาญการผลิตบรรจุภัณฑ์โลหะเกรดอาหารมาตรฐานสากล'}
        </h1>
        <p className="text-sm text-theme-text-muted leading-relaxed">
          {settings.aboutStory1}
        </p>
      </div>

      {/* Factory Banner (Dynamic from Admin Settings) */}
      <div className="glow-card group rounded-3xl border border-theme-border overflow-hidden bg-theme-surface shadow-2xl relative cursor-pointer">
        <div className="aspect-[21/9] w-full bg-theme-surface-elevated overflow-hidden">
          <img
            src={settings.aboutFactoryImage || '/images/factory-building.jpg'}
            alt="CHIOTRON Factory"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="p-8 bg-gradient-to-t from-black/90 via-black/70 to-transparent absolute bottom-0 inset-x-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
            <div>
              <div className="text-xs text-theme-primary uppercase font-bold">ที่ตั้งโรงงาน</div>
              <div className="text-sm font-semibold truncate">{shortAddress}</div>
            </div>
            <div>
              <div className="text-xs text-theme-primary uppercase font-bold">กำลังการผลิต</div>
              <div className="text-sm font-semibold">{capacityText}</div>
            </div>
            <div>
              <div className="text-xs text-theme-primary uppercase font-bold">ทุนจดทะเบียน</div>
              <div className="text-sm font-semibold">{settings.registeredCapital || '100,000,000 บาท'}</div>
            </div>
            <div>
              <div className="text-xs text-theme-primary uppercase font-bold">ปีก่อตั้งองค์กร</div>
              <div className="text-sm font-semibold">ค.ศ. {settings.establishedYear || '1986'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glow-card rounded-2xl border border-theme-border bg-theme-surface p-8 space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-theme-primary/10 text-theme-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="font-display text-xl font-bold text-theme-text">วิสัยทัศน์ (Vision)</h2>
          <p className="text-xs sm:text-sm text-theme-text-muted leading-relaxed">
            {settings.aboutStory2 ||
              'เป็นผู้นำด้านนวัตกรรมบรรจุภัณฑ์โลหะที่ได้รับความไว้วางใจสูงสุดในระดับสากล ด้วยมาตรฐานความปลอดภัยด้านอาหารระดับพรีเมียมและความยั่งยืนต่อสิ่งแวดล้อม'}
          </p>
        </div>

        <div className="glow-card rounded-2xl border border-theme-border bg-theme-surface p-8 space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-theme-primary/10 text-theme-primary">
            <TrendingUp className="h-6 w-6" />
          </div>
          <h2 className="font-display text-xl font-bold text-theme-text">พันธกิจและมาตรฐาน (Mission)</h2>
          <ul className="space-y-2 text-xs sm:text-sm text-theme-text-muted">
            {missionItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-theme-primary flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-theme-primary flex-shrink-0 mt-0.5" />
              <span>{settings.certificationsText || 'มาตรฐานระดับสากล ISO 9001:2015, FSSC 22000, HACCP & GMP'}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
