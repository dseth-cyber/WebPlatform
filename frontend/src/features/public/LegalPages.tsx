import React from 'react';
import { Shield, Cookie, FileText } from 'lucide-react';

export const PrivacyPage: React.FC = () => (
  <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 font-sans">
    <div className="space-y-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-theme-primary/10 text-theme-primary mb-2">
        <Shield className="h-5 w-5" />
      </div>
      <h1 className="font-display text-2xl sm:text-4xl font-bold text-theme-text">Privacy Policy (นโยบายความเป็นส่วนตัว)</h1>
      <p className="text-xs text-theme-text-dim">Last Updated: September 2026</p>
    </div>
    <div className="prose prose-invert prose-sm text-theme-text-muted space-y-4 leading-relaxed">
      <p>
        บริษัท โลหะกิจรุ่งเจริญทรัพย์ จำกัด ตระหนักถึงความสำคัญของการคุ้มครองข้อมูลส่วนบุคคลตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
      </p>
      <h3 className="text-sm font-bold text-theme-text">1. ข้อมูลส่วนบุคคลที่เราจัดเก็บ</h3>
      <p>เราจัดเก็บข้อมูลที่ท่านกรอกผ่านแบบฟอร์มติดต่อ เช่น ชื่อ นามสกุล บริษัท อีเมล เบอร์โทรศัพท์ เพื่อการติดต่อกลับและเสนอราคา</p>
      <h3 className="text-sm font-bold text-theme-text">2. วัตถุประสงค์ในการประมวลผลข้อมูล</h3>
      <p>ข้อมูลทั้งหมดใช้เพื่อวัตถุประสงค์ทางการค้า การประสานงานด้านวิศวกรรมบรรจุภัณฑ์ และการปฏิบัติตามสัญญาการผลิต</p>
    </div>
  </div>
);

export const CookiePage: React.FC = () => (
  <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 font-sans">
    <div className="space-y-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-theme-primary/10 text-theme-primary mb-2">
        <Cookie className="h-5 w-5" />
      </div>
      <h1 className="font-display text-2xl sm:text-4xl font-bold text-theme-text">Cookie Policy (นโยบายคุกกี้)</h1>
    </div>
    <div className="prose prose-invert prose-sm text-theme-text-muted space-y-4 leading-relaxed">
      <p>
        เว็บไซต์นี้ใช้คุกกี้ที่จำเป็นต่อการทำงานของระบบ เช่น การบันทึกภาษาที่เลือก (th, en, cn, mm, jp) และธีมการแสดงผล (DARK, LIGHT, MODERN) เพื่อมอบประสบการณ์ที่ดีที่สุดแก่ท่าน
      </p>
    </div>
  </div>
);

export const TermsPage: React.FC = () => (
  <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 font-sans">
    <div className="space-y-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-theme-primary/10 text-theme-primary mb-2">
        <FileText className="h-5 w-5" />
      </div>
      <h1 className="font-display text-2xl sm:text-4xl font-bold text-theme-text">Terms of Service (เงื่อนไขการใช้งาน)</h1>
    </div>
    <div className="prose prose-invert prose-sm text-theme-text-muted space-y-4 leading-relaxed">
      <p>
        ข้อมูลจำเพาะทางเทคนิค ภาพผลิตภัณฑ์ และเอกสารสเปกชีตทั้งหมดบนเว็บไซต์นี้เป็นทรัพย์สินทางปัญญาของ บริษัท โลหะกิจรุ่งเจริญทรัพย์ จำกัด ห้ามทำซ้ำหรือดัดแปลงโดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร
      </p>
    </div>
  </div>
);
