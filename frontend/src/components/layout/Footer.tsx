import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, MapPin, Phone, Mail, Clock, ArrowUpRight } from 'lucide-react';
import { useSiteContent } from '../../hooks/useSiteContent';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, i18n } = useTranslation();
  const { settings } = useSiteContent();
  const currentLang = (i18n.language || 'th') as 'th' | 'en' | 'jp' | 'cn' | 'mm';
  const isNonThai = currentLang !== 'th';

  const contactTrans = isNonThai && settings.contactTranslations ? settings.contactTranslations[currentLang] : null;
  const footerBio = contactTrans?.bio || settings.footerBio || 'ผู้นำนวัตกรรมผลิตกระป๋องอาหารสำเร็จรูป ถังเคมีภัณฑ์ และฝาเปิดง่าย EOE มาตรฐานส่งออกสากล ด้วยเครื่องจักรอัตโนมัติความเร็วสูง';
  const businessHoursText = contactTrans?.businessHours || settings.businessHours || 'จันทร์ - ศุกร์ 08:30 - 17:30 น.';

  // Localized company name & subtitle for Footer branding
  const localizedCompanyName = (() => {
    if (currentLang === 'th') return settings.companyNameTh || 'บริษัท ไคโอทรอน เทคโนโลยี จำกัด';
    if (currentLang === 'en') return settings.companyNameEn || 'CHIOTRON TECHNOLOGY CO., LTD.';
    const translatedName = (settings.brandLegalTranslations as any)?.[currentLang]?.companyName;
    if (translatedName) return translatedName;
    if (currentLang === 'jp') return 'カイオトロン・テクノロジー株式会社';
    if (currentLang === 'cn') return '凯奥创科技有限公司';
    if (currentLang === 'mm') return 'CHIOTRON TECHNOLOGY ကုမ္ပဏီလီမိတက်';
    return settings.companyNameEn || 'CHIOTRON TECHNOLOGY CO., LTD.';
  })();

  const localizedCompanySub = (() => {
    if (currentLang === 'th') return settings.companyNameEn || 'CHIOTRON TECHNOLOGY CO., LTD.';
    if (currentLang === 'en') return 'METAL PACKAGING EXCELLENCE';
    if (currentLang === 'jp') return 'CHIOTRON TECHNOLOGY CO., LTD.';
    if (currentLang === 'cn') return 'CHIOTRON TECHNOLOGY CO., LTD.';
    if (currentLang === 'mm') return 'CHIOTRON TECHNOLOGY CO., LTD.';
    return settings.companyNameEn || 'CHIOTRON TECHNOLOGY CO., LTD.';
  })();

  const labels = {
    products: currentLang === 'th' ? 'ผลิตภัณฑ์บรรจุภัณฑ์' : currentLang === 'jp' ? '包装製品' : currentLang === 'cn' ? '包装产品' : currentLang === 'mm' ? 'ထုပ်ပိုးမှုထုတ်ကုန်များ' : 'Packaging Products',
    about: currentLang === 'th' ? 'เกี่ยวกับเรา' : currentLang === 'jp' ? '企業情報' : currentLang === 'cn' ? '关于我们' : currentLang === 'mm' ? 'ကျွန်ုပ်တို့အကြောင်း' : 'About Us',
    contact: currentLang === 'th' ? 'ติดต่อเรา' : currentLang === 'jp' ? 'お問い合わせ' : currentLang === 'cn' ? '联系我们' : currentLang === 'mm' ? 'ဆက်သွယ်ရန်' : 'Contact Us',
    aboutHistory: currentLang === 'th' ? 'ประวัติองค์กรและวิสัยทัศน์' : currentLang === 'jp' ? '沿革・ビジョン' : currentLang === 'cn' ? '公司历程与愿景' : currentLang === 'mm' ? 'ကုမ္ပဏီသမိုင်းနှင့် မျှော်မှန်းချက်' : 'History & Vision',
    aboutTech: currentLang === 'th' ? 'เทคโนโลยีการผลิตและ AI' : currentLang === 'jp' ? '製造技術・AI' : currentLang === 'cn' ? '制造技术与AI' : currentLang === 'mm' ? 'ထုတ်လုပ်မှုနည်းပညာနှင့် AI' : 'Technology & AI',
    aboutSus: currentLang === 'th' ? 'ความยั่งยืนและการรีไซเคิล' : currentLang === 'jp' ? 'サステナビリティ' : currentLang === 'cn' ? '可持续发展' : currentLang === 'mm' ? 'ရေရှည်တည်တံ့မှု' : 'Sustainability',
    aboutNews: currentLang === 'th' ? 'ข่าวสารและกิจกรรม CSR' : currentLang === 'jp' ? 'ニュース・CSR' : currentLang === 'cn' ? '新闻与CSR' : currentLang === 'mm' ? 'သတင်းနှင့် CSR' : 'News & CSR',
    aboutContact: currentLang === 'th' ? 'ติดต่อและขอใบเสนอราคา' : currentLang === 'jp' ? 'お見積り・お問い合わせ' : currentLang === 'cn' ? '询价与联系' : currentLang === 'mm' ? 'ဆက်သွယ်ရန်နှင့် စျေးနှုန်းတောင်းခံရန်' : 'Contact & Request Quote',
    hoursPrefix: currentLang === 'th' ? 'เวลาทำการ: ' : currentLang === 'jp' ? '営業時間: ' : currentLang === 'cn' ? '营业时间: ' : currentLang === 'mm' ? 'ဖွင့်ချိန်: ' : 'Hours: ',
  };

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
                  alt={localizedCompanyName}
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
                  {localizedCompanyName}
                </h4>
                <p className="text-[10px] text-theme-text-dim">
                  {localizedCompanySub}
                </p>
              </div>
            </div>

            <p className="text-xs text-theme-text-muted leading-relaxed">
              {footerBio}
            </p>
          </div>

          {/* Col 2: Dynamic Products List (Synced with Category Cards in Admin) */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-theme-primary mb-4">
              {labels.products}
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
                        {(cat as any).translations?.[currentLang]?.title || (isNonThai ? (cat.titleEn || cat.titleTh) : (cat.titleTh || cat.titleEn))}
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
                      {isNonThai ? 'Food Cans' : 'กระป๋องอาหารสำเร็จรูป (Food Cans)'}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('/products')}
                      className="hover:text-theme-primary transition-colors"
                    >
                      {isNonThai ? 'Chemical Pails' : 'ถังโลหะบรรจุเคมีและสี (Chemical Pails)'}
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Col 3: Company & Technology */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-theme-primary mb-4">
              {labels.about}
            </h5>
            <ul className="space-y-2 text-xs text-theme-text-muted">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/about')}
                  className="hover:text-theme-primary transition-colors"
                >
                  {labels.aboutHistory}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/technology')}
                  className="hover:text-theme-primary transition-colors"
                >
                  {labels.aboutTech}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/sustainability')}
                  className="hover:text-theme-primary transition-colors"
                >
                  {labels.aboutSus}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/news')}
                  className="hover:text-theme-primary transition-colors"
                >
                  {labels.aboutNews}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-theme-primary transition-colors"
                >
                  {labels.aboutContact}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact info (100% Synced with Admin Settings & Contact CMS) */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-theme-primary mb-4">
              {labels.contact}
            </h5>
            <div className="flex items-start gap-2.5 text-xs text-theme-text-muted">
              <MapPin className="h-4 w-4 text-theme-primary flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                {(settings.branches && (isNonThai ? (settings.branches.find((b) => b.isPrimary)?.addressEn || settings.branches.find((b) => b.isPrimary)?.addressTh) : settings.branches.find((b) => b.isPrimary)?.addressTh)) ||
                  settings.factoryAddress ||
                  '123/45 ถนนสาทรใต้ แขวงยานนาวา เขตสาทร กรุงเทพมหานคร 10120'}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-theme-text-muted">
              <Phone className="h-4 w-4 text-theme-primary flex-shrink-0" />
              <span>
                {(settings.branches && settings.branches.find((b) => b.isPrimary)?.phone) ||
                  settings.phoneNumber ||
                  '+66 (0) 2 123 4567'}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-theme-text-muted">
              <Mail className="h-4 w-4 text-theme-primary flex-shrink-0" />
              <span>
                {(settings.branches && settings.branches.find((b) => b.isPrimary)?.email) ||
                  settings.email ||
                  'contact@chiotron.co.th'}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-theme-text-muted">
              <Clock className="h-4 w-4 text-theme-primary flex-shrink-0" />
              <span>
                {labels.hoursPrefix}
                {businessHoursText}
              </span>
            </div>

            {settings.branches && settings.branches.filter((b) => b.enabled !== false).length > 1 && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-theme-primary hover:underline"
                >
                  <span>
                    🏢 ดูที่ตั้งและสาขาทั้ง {settings.branches.filter((b) => b.enabled !== false).length} แห่ง →
                  </span>
                </button>
              </div>
            )}
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
