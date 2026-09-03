import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '../../api/client';
import { useSiteContent } from '../../hooks/useSiteContent';
import { SearchableSelect, SelectOption } from '../../components/ui/SearchableSelect';
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
  const { t } = useTranslation();
  const { settings } = useSiteContent();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

        {/* Corporate Information & Factory Map (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-theme-border bg-theme-surface p-8 space-y-6">
            <h3 className="font-display text-lg font-bold text-theme-text">
              ข้อมูลการติดต่อโรงงาน
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-theme-primary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-theme-text block">โรงงานและสำนักงานใหญ่ ({settings.companyNameTh})</span>
                  <p className="text-theme-text-muted mt-0.5 leading-relaxed">
                    {settings.factoryAddress || '88 หมู่ 3 ถนนเศรษฐกิจ 1 ตำบลคลองมะเดื่อ อำเภอกระทุ่มแบน จังหวัดสมุทรสาคร 74110'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-theme-border/50 pt-4">
                <Phone className="h-5 w-5 text-theme-primary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-theme-text block">เบอร์โทรศัพท์ฝ่ายขาย</span>
                  <p className="text-theme-text-muted mt-0.5">{settings.phoneNumber || '+66 (0) 34 878 999'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-theme-border/50 pt-4">
                <Mail className="h-5 w-5 text-theme-primary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-theme-text block">อีเมลฝ่ายวิศวกรรมและการขาย</span>
                  <p className="text-theme-text-muted mt-0.5">{settings.email || 'sales@lohakit.co.th'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-theme-border/50 pt-4">
                <Clock className="h-5 w-5 text-theme-primary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-theme-text block">{t('contact.hours')}</span>
                  <p className="text-theme-text-muted mt-0.5">{settings.businessHours || 'จันทร์ - เสาร์: 08:00 - 17:00 (เวลาประเทศไทย)'}</p>
                </div>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=13.6265,100.2642"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-xl border border-theme-border-highlight bg-theme-surface-elevated py-3 text-xs font-bold text-theme-text hover:bg-theme-surface hover:border-theme-primary transition-colors"
            >
              <span>เปิดแผนที่ Google Maps</span>
              <ExternalLink className="h-4 w-4 text-theme-primary" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
