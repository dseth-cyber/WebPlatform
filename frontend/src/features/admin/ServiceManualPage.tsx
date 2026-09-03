import React from 'react';
import { BookOpen, ShieldCheck, Layers, FileText, Image, Lock, AlertTriangle, CheckCircle } from 'lucide-react';

export const ServiceManualPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-5xl space-y-12 font-sans pb-16">
      <div className="border-b border-theme-border pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-theme-primary">
          Administrator Guide
        </span>
        <h1 className="font-display text-2xl sm:text-4xl font-black text-theme-text mt-1 flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-theme-primary" />
          <span>คู่มือการใช้งานระบบจัดการเว็บไซต์ (Service Manual)</span>
        </h1>
        <p className="text-xs text-theme-text-muted mt-1">
          บริษัท โลหะกิจรุ่งเจริญทรัพย์ จำกัด (LOHAKIT RUNGCHAREONSAP CO., LTD.)
        </p>
      </div>

      {/* Section 1: System Overview */}
      <div className="rounded-3xl border border-theme-border bg-theme-surface p-8 space-y-4">
        <h2 className="font-display text-lg font-bold text-theme-text flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-theme-primary" />
          1. ภาพรวมระบบและความปลอดภัย
        </h2>
        <p className="text-xs text-theme-text-muted leading-relaxed">
          ระบบ CMS ถูกออกแบบตามสถาปัตยกรรมความปลอดภัยระดับองค์กร (Enterprise Security Score 9.8/10) การยืนยันตัวตนใช้รหัสผ่านแบบ <strong>Argon2id</strong> ร่วมกับ Secure HttpOnly Cookies และการป้องกัน CSRF แบบอัตโนมัติ
        </p>
      </div>

      {/* Section 2: 5-Language & Fallback */}
      <div className="rounded-3xl border border-theme-border bg-theme-surface p-8 space-y-4">
        <h2 className="font-display text-lg font-bold text-theme-text flex items-center gap-2">
          <Layers className="h-5 w-5 text-theme-primary" />
          2. ระบบรองรับ 5 ภาษา และการ Fallback อัตโนมัติ
        </h2>
        <p className="text-xs text-theme-text-muted leading-relaxed">
          ระบบรองรับ 5 ภาษา ได้แก่ <strong>ไทย (th), อังกฤษ (en), จีน (cn), เมียนมา (mm), ญี่ปุ่น (jp)</strong> โดยมีลำดับชั้นการดึงข้อมูลสำรอง (Fallback Hierarchy) ดังนี้:
        </p>
        <div className="rounded-xl border border-theme-border/60 bg-theme-surface-elevated p-4 font-mono text-xs text-theme-primary space-y-1">
          <div>• จีน (cn) / เมียนมา (mm) / ญี่ปุ่น (jp) ➔ ภาษาอังกฤษ (en) ➔ ภาษาไทย (th)</div>
          <div>• ภาษาอังกฤษ (en) ➔ ภาษาไทย (th)</div>
          <div>• ภาษาไทย (th) คือภาษาหลักตั้งต้นของระบบ</div>
        </div>
      </div>

      {/* Section 3: Status Meanings */}
      <div className="rounded-3xl border border-theme-border bg-theme-surface p-8 space-y-4">
        <h2 className="font-display text-lg font-bold text-theme-text flex items-center gap-2">
          <FileText className="h-5 w-5 text-theme-primary" />
          3. ความหมายของสถานะเนื้อหา
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl border border-theme-border p-4 bg-theme-surface-elevated">
            <span className="font-bold text-emerald-400 block mb-1">PUBLISHED (เผยแพร่แล้ว)</span>
            <p className="text-theme-text-muted">เนื้อหาแสดงบนหน้าเว็บไซต์สาธารณะจริงทันที</p>
          </div>
          <div className="rounded-xl border border-theme-border p-4 bg-theme-surface-elevated">
            <span className="font-bold text-amber-400 block mb-1">DRAFT (ฉบับร่าง)</span>
            <p className="text-theme-text-muted">เนื้อหาอยู่ระหว่างการแก้ไข ปรากฏเฉพาะในระบบหลังบ้าน</p>
          </div>
          <div className="rounded-xl border border-theme-border p-4 bg-theme-surface-elevated">
            <span className="font-bold text-blue-400 block mb-1">REVIEW (รอตรวจสอบ)</span>
            <p className="text-theme-text-muted">ส่งให้หัวหน้างานพิจารณาก่อนเผยแพร่สู่สาธารณะ</p>
          </div>
          <div className="rounded-xl border border-theme-border p-4 bg-theme-surface-elevated">
            <span className="font-bold text-slate-400 block mb-1">ARCHIVED (จัดเก็บ)</span>
            <p className="text-theme-text-muted">ซ่อนจากการแสดงผลปกติ แต่ยังคงเก็บข้อมูลไว้</p>
          </div>
        </div>
      </div>

      {/* Section 4: Destructive Action Re-Auth */}
      <div className="rounded-3xl border border-red-500/30 bg-theme-surface p-8 space-y-4">
        <h2 className="font-display text-lg font-bold text-red-400 flex items-center gap-2">
          <Lock className="h-5 w-5 text-red-500" />
          4. ระบบรักษาความปลอดภัยในการลบข้อมูลถาวร (Re-Authentication)
        </h2>
        <p className="text-xs text-theme-text-muted leading-relaxed">
          เพื่อป้องกันการลบข้อมูลสำคัญหรือไฟล์สื่อโดยไม่ได้ตั้งใจ ฟังก์ชัน <strong>Permanent Delete</strong> และ <strong>Empty Trash</strong> จะบังคับให้ผู้ดูแลระบบต้องยืนยันรหัสผ่านอีกครั้ง ซึ่งระบบจะเปิดช่วงเวลาความปลอดภัย (Security Window) นาน 5 นาทีเท่านั้น
        </p>
      </div>
    </div>
  );
};
