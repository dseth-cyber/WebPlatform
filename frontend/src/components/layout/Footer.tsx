import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, MapPin, Phone, Mail, Clock, ArrowUpRight } from 'lucide-react';
import { useSiteContent } from '../../hooks/useSiteContent';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const { settings } = useSiteContent();

  const enabledCategories = (settings.categoryCards || []).filter((c) => c.enabled);

  return (
    <footer className="border-t border-theme-border bg-theme-surface-elevated/70 backdrop-blur-xl text-theme-text font-sans">
      {/* Top Banner with Certifications (Dynamic from Admin Settings) */}
      <div className="border-b border-theme-border/60 bg-theme-surface/50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4 text-xs text-theme-text-muted">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-theme-primary flex-shrink-0" />
            <span className="font-medium">
              {settings.certificationsText || 'ISO 9001:2015 | FSSC 22000 | HACCP & GMP Certified'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-theme-text-dim text-[11px] flex-wrap">
            <span>{settings.complianceText || 'BPA-NI Food Contact Compliant • UN Packaging Certified • 100% Infinitely Recyclable Steel'}</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & Bio (Dynamic from Admin Settings & Logo) */}
          <div className="space-y-4">
            <div
              onClick={() => onNavigate('/')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              {settings.logoImage ? (
                <img
                  src={settings.logoImage}
                  alt={settings.companyNameTh}
                  className="h-10 w-auto max-w-[120px] object-contain rounded-lg drop-shadow-md group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="relative flex h-10 w-10 items-center justify-center">
                  <div className="absolute inset-0 rotate-45 rounded-lg border-2 border-theme-primary/90 bg-gradient-to-br from-slate-900 via-slate-800 to-black shadow-lg shadow-theme-primary/30 group-hover:scale-105 transition-transform" />
                  <span className="relative z-10 font-display font-black text-sm text-theme-primary tracking-tighter">
                    {settings.logoText || 'LC'}
                  </span>
                </div>
              )}

              <div>
                <h4 className="font-display font-black text-sm text-theme-text group-hover:text-theme-primary transition-colors">
                  {settings.companyNameEn || 'CHIOTRON TECHNOLOGY CO., LTD.'}
                </h4>
                <p className="text-[10px] text-theme-text-dim">
                  {settings.companyNameTh || 'บริษัท ไคโอทรอน เทคโนโลยี จำกัด'}
                </p>
              </div>
            </div>

            <p className="text-xs text-theme-text-muted leading-relaxed">
              {settings.footerBio ||
                'ผู้นำนวัตกรรมผลิตกระป๋องอาหารสำเร็จรูป ถังเคมีภัณฑ์ และฝาเปิดง่าย EOE มาตรฐานส่งออกสากล ด้วยเครื่องจักรอัตโนมัติความเร็วสูง'}
            </p>
          </div>

          {/* Col 2: Dynamic Products List (Synced with Category Cards in Admin) */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-theme-primary mb-4">
              ผลิตภัณฑ์บรรจุภัณฑ์
            </h5>
            <ul className="space-y-2 text-xs text-theme-text-muted">
              {enabledCategories.length > 0 ? (
                enabledCategories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => onNavigate(cat.path || `/products?category=${cat.id}`)}
                      className="hover:text-theme-primary transition-colors flex items-center gap-1 text-left"
                    >
                      <span>
                        {cat.titleTh} ({cat.titleEn})
                      </span>
                      <ArrowUpRight className="h-3 w-3 opacity-40" />
                    </button>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('/products')}
                      className="hover:text-theme-primary transition-colors"
                    >
                      กระป๋องอาหารสำเร็จรูป (Food Cans)
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('/products')}
                      className="hover:text-theme-primary transition-colors"
                    >
                      ถังโลหะบรรจุเคมีและสี (Chemical Pails)
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Col 3: Company & Technology */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-theme-primary mb-4">
              เกี่ยวกับเรา
            </h5>
            <ul className="space-y-2 text-xs text-theme-text-muted">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/about')}
                  className="hover:text-theme-primary transition-colors"
                >
                  ประวัติองค์กรและวิสัยทัศน์
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/technology')}
                  className="hover:text-theme-primary transition-colors"
                >
                  เทคโนโลยีการผลิตและ AI
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/sustainability')}
                  className="hover:text-theme-primary transition-colors"
                >
                  ความยั่งยืนและการรีไซเคิล
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/news')}
                  className="hover:text-theme-primary transition-colors"
                >
                  ข่าวสารและกิจกรรม CSR
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-theme-primary transition-colors"
                >
                  ติดต่อและขอใบเสนอราคา
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact info (100% Synced with Admin Settings & Contact CMS) */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-theme-primary mb-4">
              ติดต่อเรา
            </h5>
            <div className="flex items-start gap-2.5 text-xs text-theme-text-muted">
              <MapPin className="h-4 w-4 text-theme-primary flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                {settings.factoryAddress || '88 หมู่ 3 ถนนเศรษฐกิจ 1 ต.คลองมะเดื่อ อ.กระทุ่มแบน จ.สมุทรสาคร 74110'}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-theme-text-muted">
              <Phone className="h-4 w-4 text-theme-primary flex-shrink-0" />
              <span>{settings.phoneNumber || '+66 (0) 34 878 999'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-theme-text-muted">
              <Mail className="h-4 w-4 text-theme-primary flex-shrink-0" />
              <span>{settings.email || 'sales@lohakit.co.th'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-theme-text-muted">
              <Clock className="h-4 w-4 text-theme-primary flex-shrink-0" />
              <span>เวลาทำการ: {settings.businessHours || 'จันทร์ - เสาร์ 08:00 - 17:00'}</span>
            </div>
          </div>
        </div>

        {/* Copyright & Legal Links (Dynamic establishedYear & companyNameEn) */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-theme-border pt-6 text-[11px] text-theme-text-dim gap-4">
          <p>
            © {settings.establishedYear || '1986'} - {new Date().getFullYear()} {settings.companyNameEn || 'CHIOTRON TECHNOLOGY CO., LTD.'} All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('/contact')}
              className="hover:text-theme-text transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onNavigate('/contact')}
              className="hover:text-theme-text transition-colors"
            >
              Cookie Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onNavigate('/contact')}
              className="hover:text-theme-text transition-colors"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
