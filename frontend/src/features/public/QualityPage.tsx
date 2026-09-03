import React from 'react';
import { ShieldCheck, CheckCircle2, FlaskConical, SearchCheck, Layers, FileCheck } from 'lucide-react';

export const QualityPage: React.FC<{ onNavigate: (path: string) => void }> = () => {
  const tests = [
    { name: 'Double Seam Optical Dimensional Analysis', desc: 'ตัดภาพตัดขวางและวัดความหนา ความยาวตะเข็บ และเปอร์เซ็นต์ Overlap ด้วยคอมพิวเตอร์' },
    { name: 'High-Pressure Leak & Bubble Immersion Test', desc: 'ทดสอบการรั่วซึมใต้น้ำด้วยแรงดันลมสูง เพื่อรับประกันความแน่นหนา 100%' },
    { name: 'Internal Lacquer Enamel Rater (Porosity Test)', desc: 'ตรวจวัดกระแสไฟฟ้า (mA) เพื่อตรวจหาความต่อเนื่องและรูพรุนของสารเคลือบภายใน' },
    { name: 'Retort Heat Sterilization Simulation (121°C / 130°C)', desc: 'จำลองการฆ่าเชื้อด้วยความร้อนและแรงดันไอน้ำเพื่อทดสอบการลอกล่อนของแล็กเกอร์' },
    { name: 'BPA-NI Chemical Migration Test', desc: 'ทดสอบการแพร่กระจายของสารเคมีสัมผัสอาหารตามมาตรฐาน FDA และ EU 10/2011' },
    { name: 'UN Drop & Hydrostatic Pressure Test', desc: 'ทดสอบการตกกระแทกและแรงดันไฮโดรสแตติกสำหรับถังบรรจุสารเคมีอันตราย' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16 font-sans">
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-theme-primary">
          Quality Assurance
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-theme-text leading-tight">
          ระบบควบคุมคุณภาพและความปลอดภัยด้านอาหารระดับสากล
        </h1>
        <p className="text-sm text-theme-text-muted leading-relaxed">
          ห้องปฏิบัติการตรวจสอบทางเคมีและกายภาพที่ทันสมัย เพื่อให้มั่นใจว่ากระป๋องทุกใบมีมาตรฐานสูงสุดก่อนส่งถึงโรงงานของลูกค้า
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((t, idx) => (
          <div key={idx} className="glow-card rounded-2xl border border-theme-border bg-theme-surface p-6 space-y-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-theme-primary/10 text-theme-primary">
              <FlaskConical className="h-5 w-5" />
            </div>
            <h3 className="font-display text-sm font-bold text-theme-text">{t.name}</h3>
            <p className="text-xs text-theme-text-muted leading-relaxed">{t.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
