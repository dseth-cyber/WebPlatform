import React from 'react';
import { Award, ShieldCheck, CheckCircle2, FileCheck2 } from 'lucide-react';

export const CertificationsPage: React.FC<{ onNavigate: (path: string) => void }> = () => {
  const certs = [
    { title: 'ISO 9001:2015', issuer: 'SGS / UKAS', desc: 'ระบบบริหารคุณภาพมาตรฐานสากลสำหรับการออกแบบและผลิตบรรจุภัณฑ์โลหะ' },
    { title: 'FSSC 22000 (Version 6.0)', issuer: 'Food Safety System Certification', desc: 'มาตรฐานความปลอดภัยอาหารสากล ครอบคลุมการผลิตบรรจุภัณฑ์สัมผัสอาหาร' },
    { title: 'GMP & HACCP Certified', issuer: 'Codex Alimentarius', desc: 'หลักเกณฑ์สุขลักษณะที่ดีในการผลิตและการวิเคราะห์อันตรายจุดควบคุมวิกฤต' },
    { title: 'UN Packaging Certification (Dangerous Goods)', issuer: 'Department of Industrial Works', desc: 'ใบรับรองมาตรฐานบรรจุภัณฑ์สำหรับการขนส่งวัตถุอันตรายระหว่างประเทศ' },
    { title: 'BPA-NI Compliance Statement', issuer: 'Internal & Third-party Laboratory', desc: 'เอกสารรับรองสารเคลือบปราศจากสารก่อมะเร็ง Bisphenol A ตามมาตรฐาน EU/FDA' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16 font-sans">
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-theme-primary">
          International Standards
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-theme-text leading-tight">
          การรับรองและมาตรฐานระดับสากล
        </h1>
        <p className="text-sm text-theme-text-muted leading-relaxed">
          ความไว้วางใจจากลูกค้าทั่วโลกเกิดจากการปฏิบัติตามมาตรฐานคุณภาพ ความสะอาด และความปลอดภัยสูงสุดอย่างเคร่งครัด
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certs.map((c, idx) => (
          <div key={idx} className="glow-card rounded-2xl border border-theme-border bg-theme-surface p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-theme-primary/10 text-theme-primary">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-theme-primary uppercase">{c.issuer}</span>
              <h3 className="font-display text-sm font-bold text-theme-text mt-0.5">{c.title}</h3>
            </div>
            <p className="text-xs text-theme-text-muted leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
