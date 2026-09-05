import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSiteContent } from '../../hooks/useSiteContent';
import {
  Building2,
  Save,
  Image as ImageIcon,
  Check,
  UploadCloud,
  Loader2,
} from 'lucide-react';
import { compressImageFile } from '../../utils/imageCompressor';
import { MultiLangSectionEditor } from './MultiLangSectionEditor';

export const AboutManager: React.FC = () => {
  const { t } = useTranslation();
  const { settings, updateSettings } = useSiteContent();

  const [heading, setHeading] = useState(settings.aboutHeading || 'เกี่ยวกับเรา');
  const [subheading, setSubheading] = useState(
    settings.aboutSubheading || 'ผู้เชี่ยวชาญการผลิตบรรจุภัณฑ์โลหะเกรดอาหารมาตรฐานสากล'
  );
  const [story1, setStory1] = useState(settings.aboutStory1 || '');
  const [story2, setStory2] = useState(settings.aboutStory2 || '');
  const [mission, setMission] = useState(settings.aboutMission || '');
  const [factoryImage, setFactoryImage] = useState(
    settings.aboutFactoryImage || '/images/factory-building.jpg'
  );
  const [metrics, setMetrics] = useState(settings.metrics || []);

  const [aboutTranslations, setAboutTranslations] = useState<any>(
    settings.aboutTranslations || {
      en: { heading: 'About Us', subheading: '', story1: '', mission: '' },
      jp: { heading: '会社概要', subheading: '', story1: '', mission: '' },
      cn: { heading: '关于我们', subheading: '', story1: '', mission: '' },
      mm: { heading: 'ကျွန်ုပ်တို့အကြောင်း', subheading: '', story1: '', mission: '' },
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize when settings are loaded from Database or updated
  useEffect(() => {
    if (settings) {
      if (settings.aboutHeading) setHeading(settings.aboutHeading);
      if (settings.aboutSubheading) setSubheading(settings.aboutSubheading);
      if (settings.aboutStory1) setStory1(settings.aboutStory1);
      if (settings.aboutStory2) setStory2(settings.aboutStory2);
      if (settings.aboutMission) setMission(settings.aboutMission);
      if (settings.aboutFactoryImage) setFactoryImage(settings.aboutFactoryImage);
      if (settings.metrics && settings.metrics.length > 0) {
        setMetrics(settings.metrics);
      }
      if (settings.aboutTranslations) {
        setAboutTranslations(settings.aboutTranslations);
      }
    }
  }, [settings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings({
        aboutHeading: heading,
        aboutSubheading: subheading,
        aboutStory1: story1,
        aboutStory2: story2,
        aboutMission: mission,
        aboutFactoryImage: factoryImage,
        metrics,
        aboutTranslations,
      });
      showToast('บันทึกข้อมูลหน้าเกี่ยวกับเราลงฐานข้อมูลสำเร็จแล้ว!');
    } catch (err) {
      showToast('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        showToast('กำลังประมวลผลและปรับขนาดรูปภาพ...');
        const optimizedDataUrl = await compressImageFile(file, 1920, 1080, 0.85);
        setFactoryImage(optimizedDataUrl);
        showToast('อัปโหลดและปรับขนาดรูปภาพโรงงานเรียบร้อยแล้ว');
      } catch (err) {
        showToast('เกิดข้อผิดพลาดในการโหลดรูปภาพ');
      }
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-5xl pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-2xl animate-bounce">
          <Check className="h-5 w-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-theme-border pb-6">
        <div>
          <h1 className="font-display text-2xl font-black text-theme-text flex items-center gap-2">
            <Building2 className="h-6 w-6 text-theme-primary" />
            <span>{t('admin.aboutTitle', 'จัดการเนื้อหาหน้า • เกี่ยวกับเรา (About Us CMS)')}</span>
          </h1>
          <p className="text-xs text-theme-text-muted mt-1">
            {t('admin.aboutSubtitle', 'แก้ไขประวัติบริษัท วิสัยทัศน์ รูปภาพโรงงาน และตัวเลขสถิติความสำเร็จ (บันทึกลง Database กลางอัตโนมัติ)')}
          </p>
        </div>

        <button
          type="button"
          disabled={isSaving}
          onClick={handleSave}
          className="btn-primary-action text-xs font-black px-6 py-2.5 shadow-xl flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin text-black" /> : <Save className="h-4 w-4 text-black" />}
          <span>{isSaving ? t('admin.saving', 'กำลังบันทึก...') : t('admin.saveAbout', 'บันทึกข้อมูลเกี่ยวกับเรา')}</span>
        </button>
      </div>

      {/* 1. Main Story & Headlines */}
      <div className="rounded-3xl border border-theme-border bg-theme-surface p-6 sm:p-8 shadow-2xl space-y-4 text-xs">
        <h3 className="font-display text-sm font-bold text-theme-text border-b border-theme-border pb-3">
          {t('admin.aboutStorySection', 'ข้อความหัวข้อและประวัติองค์กร (Company Story & Overview)')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-theme-text block mb-1">{t('admin.fieldTitle', 'หัวข้อหลัก (Title)')}</label>
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text font-bold"
            />
          </div>
          <div>
            <label className="font-bold text-theme-text block mb-1">{t('admin.fieldSubheading', 'หัวข้อย่อยสโลแกน (Subheading)')}</label>
            <input
              type="text"
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
              className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text font-bold"
            />
          </div>
        </div>

        <div>
          <label className="font-bold text-theme-text block mb-1">{t('admin.fieldStory1', 'เนื้อหาประวัติความเป็นมา (Paragraph 1)')}</label>
          <textarea
            rows={4}
            value={story1}
            onChange={(e) => setStory1(e.target.value)}
            className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text leading-relaxed"
          />
        </div>

        <div>
          <label className="font-bold text-theme-text block mb-1">{t('admin.fieldStory2', 'วิสัยทัศน์และความมุ่งมั่น (Paragraph 2 - Vision)')}</label>
          <textarea
            rows={3}
            value={story2}
            onChange={(e) => setStory2(e.target.value)}
            className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text font-semibold leading-relaxed"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-bold text-theme-text block">{t('admin.fieldMission', 'พันธกิจและมาตรฐาน (Paragraph 3 - Mission & Standards)')}</label>
            <span className="text-[11px] text-theme-text-muted">{t('admin.enterBreakHint', 'ขึ้นบรรทัดใหม่ (Enter) เพื่อแยกเป็นแต่ละข้อหัวข้อย่อย')}</span>
          </div>
          <textarea
            rows={4}
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            placeholder="ส่งมอบผลิตภัณฑ์บรรจุภัณฑ์โลหะที่มีคุณภาพและความบริสุทธิ์สูง ปลอดสาร BPA 100%&#10;นำเข้าเทคโนโลยีเครื่องจักรผลิตความเร็วสูงเพื่อเพิ่มประสิทธิภาพและความแม่นยำ"
            className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text leading-relaxed"
          />
        </div>
      </div>

      {/* 1.5 Multi-Language Translations (EN, JP, CN, MM) */}
      <MultiLangSectionEditor
        title={`${t('admin.multiLangTitle', 'แปลภาษา (Multi-Language)')} - ${t('admin.aboutTitle', 'เกี่ยวกับเรา')}`}
        fields={[
          { key: 'heading', label: 'Title / Heading' },
          { key: 'subheading', label: 'Highlight / Subheading' },
          { key: 'story1', label: 'Story Description', type: 'textarea', rows: 3 },
          { key: 'mission', label: 'Mission & Standards', type: 'textarea', rows: 3 },
        ]}
        value={aboutTranslations}
        onChange={setAboutTranslations}
      />

      {/* 2. Factory Photo & Attachment */}
      <div className="rounded-3xl border border-theme-border bg-theme-surface p-6 sm:p-8 shadow-2xl space-y-4 text-xs">
        <h3 className="font-display text-sm font-bold text-theme-text border-b border-theme-border pb-3">
          {t('admin.aboutFactorySection', 'รูปภาพอาคารและสายการผลิตโรงงาน (Plant & Facility Photo)')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          <div className="sm:col-span-5 aspect-[16/10] rounded-2xl overflow-hidden border border-theme-border bg-black shadow-inner">
            <img src={factoryImage} alt="Factory Preview" className="w-full h-full object-cover" />
          </div>

          <div className="sm:col-span-7 space-y-3">
            <div>
              <label className="font-bold text-theme-text block mb-1">{t('admin.plantPhotoUrl', 'URL รูปภาพโรงงาน')}</label>
              <input
                type="text"
                value={factoryImage}
                onChange={(e) => setFactoryImage(e.target.value)}
                className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="font-bold text-theme-text block mb-1">{t('admin.orUploadImage', 'หรือ อัปโหลดรูปภาพใหม่จากเครื่อง')}</label>
              <label className="inline-flex items-center gap-2 rounded-xl bg-theme-primary/15 border border-theme-primary/40 px-4 py-2.5 text-xs font-bold text-theme-primary hover:bg-theme-primary hover:text-black cursor-pointer transition-all shadow-sm">
                <UploadCloud className="h-4 w-4" />
                <span>{t('admin.selectImageFile', 'เลือกไฟล์รูปภาพจากเครื่อง (PNG/JPG)')}</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 4 Metric Counters (Edit & Show/Hide) */}
      <div className="rounded-3xl border border-theme-border bg-theme-surface p-6 sm:p-8 shadow-2xl space-y-4 text-xs">
        <h3 className="font-display text-sm font-bold text-theme-text border-b border-theme-border pb-3">
          {t('admin.aboutMetricsSection', 'ตัวเลขสถิติความสำเร็จ 4 ด้าน (Key Performance Metrics)')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, idx) => (
            <div
              key={m.id}
              className="rounded-2xl border border-theme-border bg-theme-surface-elevated p-4 space-y-2.5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-theme-primary">{t('admin.metricNumber', 'สถิติที่')} {idx + 1}</span>
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...metrics];
                    updated[idx].enabled = !updated[idx].enabled;
                    setMetrics(updated);
                  }}
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border transition-all ${
                    m.enabled
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                  }`}
                >
                  {m.enabled ? `🟢 ${t('admin.showTab', 'แสดง')}` : `⚪ ${t('admin.hideTab', 'ซ่อน')}`}
                </button>
              </div>

              <div>
                <label className="text-[10px] text-theme-text-dim block">{t('admin.metricValue', 'ตัวเลขสถิติ (Value)')}</label>
                <input
                  type="text"
                  value={m.value}
                  onChange={(e) => {
                    const updated = [...metrics];
                    updated[idx].value = e.target.value;
                    setMetrics(updated);
                  }}
                  className="w-full rounded-lg border border-theme-border bg-theme-surface px-3 py-1.5 text-theme-text font-black text-sm"
                />
              </div>

              <div>
                <label className="text-[10px] text-theme-text-dim block">{t('admin.metricLabel', 'คำอธิบาย (Label)')}</label>
                <input
                  type="text"
                  value={m.label}
                  onChange={(e) => {
                    const updated = [...metrics];
                    updated[idx].label = e.target.value;
                    setMetrics(updated);
                  }}
                  className="w-full rounded-lg border border-theme-border bg-theme-surface px-3 py-1.5 text-theme-text-muted text-[11px]"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t border-theme-border">
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="btn-primary-action text-xs font-black px-6 py-2.5 shadow-xl flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin text-black" /> : <Save className="h-4 w-4 text-black" />}
            <span>{isSaving ? t('admin.saving', 'กำลังบันทึก...') : t('admin.saveAllSettings', 'บันทึกข้อมูลทั้งหมด')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
