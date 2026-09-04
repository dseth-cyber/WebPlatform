import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '../../api/client';
import { useSiteContent } from '../../hooks/useSiteContent';
import { SearchableSelect, SelectOption } from '../../components/ui/SearchableSelect';
import { formatGoogleMapsUrl } from '../../utils/mapUtils';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Building2,
  ExternalLink,
  Factory,
  Warehouse,
  Star,
} from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  companyName: z.string().optional(),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  interestCategory: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  website: z.string().optional(), // Honeypot
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactPage: React.FC<{ onNavigate: (path: string) => void }> = () => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'th') as 'th' | 'en' | 'jp' | 'cn' | 'mm';
  const { settings } = useSiteContent();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Multi-Branch Support
  const branches = (settings.branches && settings.branches.length > 0)
    ? settings.branches.filter((b) => b.enabled !== false)
    : [
        {
          id: 'b-default',
          nameTh: 'สำนักงานใหญ่และโรงงานผลิต (' + (settings.companyNameTh || 'ไคโอทรอน เทคโนโลยี') + ')',
          nameEn: 'Headquarters & Manufacturing Plant',
          type: 'headquarters' as const,
          addressTh: settings.factoryAddress || '88/9 หมู่ 4 นิคมอุตสาหกรรมสมุทรสาคร จ.สมุทรสาคร 74000',
          addressEn: '88/9 Moo 4, Samut Sakhon Industrial Estate, Samut Sakhon 74000, Thailand',
          phone: settings.phoneNumber || '+66 (0) 34 890 123',
          email: settings.email || 'contact@chiotron.co.th',
          businessHoursTh: settings.businessHours || 'จันทร์ - เสาร์ 08:00 - 17:00 น.',
          mapUrl: 'https://maps.google.com/?q=Samut+Sakhon+Industrial+Estate',
          isPrimary: true,
          enabled: true,
        },
      ];

  const [selectedBranchId, setSelectedBranchId] = useState<string>(
    branches.find((b) => b.isPrimary)?.id || branches[0]?.id || ''
  );
  const currentBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      interestCategory: 'food-beverage-cans',
    },
  });

  const categoryOptions: SelectOption[] = [
    { value: 'food-beverage-cans', label: 'กระป๋องอาหารและเครื่องดื่ม (Food Cans)' },
    { value: 'chemical-paint-pails', label: 'ถังโลหะเคมีภัณฑ์และสี (Chemical Pails)' },
    { value: 'aerosol-spray-cans', label: 'กระป๋องสเปรย์ (Aerosol Cans)' },
    { value: 'metal-closures-lids', label: 'ฝาดึงเปิดง่าย Easy Open End (EOE)' },
    { value: 'oem-printing', label: 'บริการพิมพ์ลายออฟเซ็ต 6 สี (OEM Printing)' },
    { value: 'general-inquiry', label: 'สอบถามข้อมูลทั่วไป (General Inquiry)' },
  ];

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await apiClient('/public/contact', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      setSubmitSuccess(true);
      reset();
    } catch (e: any) {
      setSubmitError(e.message || t('common.submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-16 sm:px-6 lg:px-8 space-y-12 font-sans">
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-theme-primary">
          Get In Touch
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-theme-text leading-tight">
          {t('contact.title')}
        </h1>
        <p className="text-sm text-theme-text-muted leading-relaxed">
          {t('contact.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Form Column (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-theme-border bg-theme-surface p-8 sm:p-10 shadow-2xl space-y-6">
          <h2 className="font-display text-xl font-bold text-theme-text">
            {t('contact.formTitle')}
          </h2>

          {submitSuccess ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center space-y-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
              <h3 className="font-bold text-sm text-emerald-400">
                {t('common.submitSuccess')}
              </h3>
              <p className="text-xs text-theme-text-muted">
                ทีมวิศวกรฝ่ายขายจะติดต่อกลับไปยังอีเมลหรือเบอร์โทรศัพท์ที่ท่านระบุไว้
              </p>
              <button
                type="button"
                onClick={() => setSubmitSuccess(false)}
                className="mt-2 rounded-lg bg-theme-surface px-4 py-2 text-xs font-semibold text-theme-text border border-theme-border hover:bg-theme-surface-hover"
              >
                ส่งข้อความเพิ่มเติม
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {submitError && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Honeypot field for anti-spam (hidden from users) */}
              <input type="text" {...register('website')} className="hidden" tabIndex={-1} autoComplete="off" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-theme-text block mb-1">
                    {t('contact.name')} *
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    placeholder="คุณสมชาย ใจดี"
                    className="w-full rounded-lg border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-xs text-theme-text placeholder-theme-text-dim focus:border-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-primary"
                  />
                  {errors.name && <p className="text-[10px] text-red-400 mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="text-[11px] font-bold text-theme-text block mb-1">
                    {t('contact.company')}
                  </label>
                  <input
                    type="text"
                    {...register('companyName')}
                    placeholder="บริษัท อาหารแปรรูป จำกัด"
                    className="w-full rounded-lg border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-xs text-theme-text placeholder-theme-text-dim focus:border-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-theme-text block mb-1">
                    {t('contact.email')} *
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="somchai@company.com"
                    className="w-full rounded-lg border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-xs text-theme-text placeholder-theme-text-dim focus:border-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-primary"
                  />
                  {errors.email && <p className="text-[10px] text-red-400 mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="text-[11px] font-bold text-theme-text block mb-1">
                    {t('contact.phone')}
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="+66 81 234 5678"
                    className="w-full rounded-lg border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-xs text-theme-text placeholder-theme-text-dim focus:border-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-theme-text block mb-1">
                    {t('contact.subject')} *
                  </label>
                  <input
                    type="text"
                    {...register('subject')}
                    placeholder="ขอใบเสนอราคากระป๋องอาหาร 300x401"
                    className="w-full rounded-lg border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-xs text-theme-text placeholder-theme-text-dim focus:border-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-primary"
                  />
                  {errors.subject && <p className="text-[10px] text-red-400 mt-1">{errors.subject.message}</p>}
                </div>

                <div>
                  <label className="text-[11px] font-bold text-theme-text block mb-1">
                    {t('contact.interest')}
                  </label>
                  <Controller
                    name="interestCategory"
                    control={control}
                    render={({ field }) => (
                      <SearchableSelect
                        options={categoryOptions}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-theme-text block mb-1">
                  {t('contact.message')} *
                </label>
                <textarea
                  rows={4}
                  {...register('message')}
                  placeholder="ระบุจำนวนที่ต้องการ ขนาดเส้นผ่านศูนย์กลาง ความสูง และประเภทอาหารที่ต้องการบรรจุ..."
                  className="w-full rounded-lg border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-xs text-theme-text placeholder-theme-text-dim focus:border-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-primary leading-relaxed"
                />
                {errors.message && <p className="text-[10px] text-red-400 mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-theme-primary py-3.5 text-sm font-bold text-black shadow-lg shadow-theme-primary/25 hover:bg-theme-primary-hover disabled:opacity-60 transition-all"
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? t('common.submitting') : t('common.send')}</span>
              </button>
            </form>
          )}
        </div>

        {/* Corporate Information & Multi-Branch Locations (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-theme-border bg-theme-surface p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-theme-border pb-4">
              <h3 className="font-display text-base sm:text-lg font-bold text-theme-text flex items-center gap-2">
                <Building2 className="h-5 w-5 text-theme-primary" />
                <span>สถานที่ตั้งและสาขา ({branches.length} สาขา)</span>
              </h3>
              {currentBranch.isPrimary && (
                <span className="flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-500">
                  <Star className="h-3 w-3 fill-amber-400" />
                  สาขาหลัก
                </span>
              )}
            </div>

            {/* Branch Selector Tabs */}
            {branches.length > 1 && (
              <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-theme-surface-elevated border border-theme-border">
                {branches.map((b) => {
                  const isSelected = b.id === selectedBranchId;
                  const icon =
                    b.type === 'headquarters' ? '🏢' : b.type === 'factory' ? '🏭' : b.type === 'warehouse' ? '📦' : '📍';
                  const tabLabel = ((b as any).translations?.[currentLang]?.name || (currentLang === 'en' ? b.nameEn : b.nameTh) || b.nameTh).split('(')[0];
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBranchId(b.id)}
                      className={`flex-1 min-w-[120px] rounded-xl py-2 px-3 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-theme-primary text-black shadow-md'
                          : 'text-theme-text-muted hover:text-theme-text hover:bg-theme-surface'
                      }`}
                    >
                      <span>{icon}</span>
                      <span className="truncate">{tabLabel}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Selected Branch Details */}
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-theme-primary block mb-0.5">
                  {(currentBranch as any).translations?.[currentLang]?.name ? currentLang.toUpperCase() : (currentBranch.nameEn || 'LOCATION')}
                </span>
                <h4 className="font-display font-bold text-sm text-theme-text">
                  {(currentBranch as any).translations?.[currentLang]?.name || (currentLang === 'en' ? currentBranch.nameEn : currentBranch.nameTh) || currentBranch.nameTh}
                </h4>
              </div>

              <div className="flex items-start gap-3 border-t border-theme-border/50 pt-4">
                <MapPin className="h-5 w-5 text-theme-primary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-theme-text block">{t('contact.address')}</span>
                  <p className="text-theme-text-muted mt-0.5 leading-relaxed">
                    {(currentBranch as any).translations?.[currentLang]?.address || (currentLang === 'en' ? (currentBranch.addressEn || currentBranch.addressTh) : currentBranch.addressTh)}
                  </p>
                </div>
              </div>

              {currentBranch.phone && (
                <div className="flex items-start gap-3 border-t border-theme-border/50 pt-4">
                  <Phone className="h-5 w-5 text-theme-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-theme-text block">{t('contact.phone')}</span>
                    <a
                      href={`tel:${currentBranch.phone.replace(/[^0-9+]/g, '')}`}
                      className="text-theme-text-muted hover:text-theme-primary font-mono mt-0.5 inline-block"
                    >
                      {currentBranch.phone}
                    </a>
                  </div>
                </div>
              )}

              {currentBranch.email && (
                <div className="flex items-start gap-3 border-t border-theme-border/50 pt-4">
                  <Mail className="h-5 w-5 text-theme-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-theme-text block">{t('contact.email')}</span>
                    <a
                      href={`mailto:${currentBranch.email}`}
                      className="text-theme-text-muted hover:text-theme-primary font-mono mt-0.5 inline-block"
                    >
                      {currentBranch.email}
                    </a>
                  </div>
                </div>
              )}

              {((currentBranch as any).translations?.[currentLang]?.businessHours || currentBranch.businessHoursTh) && (
                <div className="flex items-start gap-3 border-t border-theme-border/50 pt-4">
                  <Clock className="h-5 w-5 text-theme-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-theme-text block">{t('contact.hours')}</span>
                    <p className="text-theme-text-muted mt-0.5">
                      {(currentBranch as any).translations?.[currentLang]?.businessHours || currentBranch.businessHoursTh}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <a
              href={formatGoogleMapsUrl(currentBranch.mapUrl, currentBranch.addressTh)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-xl border border-theme-border bg-theme-surface-elevated py-3 text-xs font-bold text-theme-text hover:bg-theme-surface hover:border-theme-primary hover:text-theme-primary transition-all shadow-sm"
            >
              <span>{currentLang === 'en' ? 'Open in Google Maps' : 'เปิดแผนที่ Google Maps นำทางสู่สาขานี้'}</span>
              <ExternalLink className="h-4 w-4 text-theme-primary" />
            </a>
          </div>

          {/* ข้อมูลแบรนด์และนิติบุคคล (Brand & Legal Entity Information) */}
          <div className="rounded-3xl border border-theme-border bg-theme-surface p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="border-b border-theme-border pb-3 flex items-center justify-between">
              <h3 className="font-display text-sm sm:text-base font-bold text-theme-text flex items-center gap-2">
                <Building2 className="h-4 w-4 text-theme-primary" />
                <span>{currentLang === 'en' ? 'Brand & Legal Entity Information' : 'ข้อมูลแบรนด์และนิติบุคคล'}</span>
              </h3>
              <span className="rounded-full bg-theme-primary/10 border border-theme-primary/30 px-2 py-0.5 text-[10px] font-bold text-theme-primary">
                {currentLang.toUpperCase()}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[11px] font-bold text-theme-text-dim block">
                  {currentLang === 'en' ? 'Registered Company Name' : 'ชื่อจดทะเบียนนิติบุคคล'}
                </span>
                <p className="font-bold text-theme-text text-sm mt-0.5">
                  {(settings.brandLegalTranslations as any)?.[currentLang]?.legalName ||
                    (currentLang === 'en' ? settings.companyNameEn : settings.companyNameTh) ||
                    settings.companyNameTh ||
                    'บริษัท ไคโอทรอน เทคโนโลยี จำกัด'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-theme-border/50">
                <div>
                  <span className="text-[11px] font-bold text-theme-text-dim block">
                    {currentLang === 'en' ? 'Tax ID' : 'เลขประจำตัวผู้เสียภาษี'}
                  </span>
                  <p className="font-mono text-theme-text mt-0.5">
                    {(settings.brandLegalTranslations as any)?.[currentLang]?.taxId || settings.taxId || '0105566089123'}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-theme-text-dim block">
                    {currentLang === 'en' ? 'Registered Capital' : 'ทุนจดทะเบียน'}
                  </span>
                  <p className="text-theme-text mt-0.5">
                    {(settings.brandLegalTranslations as any)?.[currentLang]?.registeredCapital || '150,000,000 THB'}
                  </p>
                </div>
              </div>

              <div className="pt-1 border-t border-theme-border/50">
                <span className="text-[11px] font-bold text-theme-text-dim block">
                  {currentLang === 'en' ? 'Headquarters Address' : 'ที่ตั้งสำนักงานใหญ่'}
                </span>
                <p className="text-theme-text-muted mt-0.5 leading-relaxed">
                  {(settings.brandLegalTranslations as any)?.[currentLang]?.headquartersAddress ||
                    settings.factoryAddress}
                </p>
              </div>

              <div className="pt-1 border-t border-theme-border/50">
                <span className="text-[11px] font-bold text-theme-text-dim block">
                  {currentLang === 'en' ? 'Certified Quality Standards' : 'การรับรองมาตรฐานสากล'}
                </span>
                <p className="text-theme-primary font-semibold mt-0.5">
                  {(settings.brandLegalTranslations as any)?.[currentLang]?.industryCertifications ||
                    'ISO 9001:2015, FSSC 22000, HACCP, GMP, BPA-NI'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
