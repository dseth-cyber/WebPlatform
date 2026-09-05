import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSiteContent, ServiceItemSetting } from '../../hooks/useSiteContent';
import {
  Layers,
  Printer,
  Wrench,
  ShieldCheck,
  Cpu,
  PhoneCall,
  Save,
  Check,
  Plus,
  Trash2,
  Sparkles,
  UploadCloud,
  Image as ImageIcon,
  Pin,
} from 'lucide-react';
import { compressImageFile } from '../../utils/imageCompressor';
import { MultiLangSectionEditor } from './MultiLangSectionEditor';

const AVAILABLE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Layers,
  Printer,
  Wrench,
  ShieldCheck,
  Cpu,
  PhoneCall,
};

export const ServicesManager: React.FC = () => {
  const { t } = useTranslation();
  const { settings, updateSettings } = useSiteContent();

  const [badge, setBadge] = useState(settings.servicesBadge || 'Manufacturing Services');
  const [heading, setHeading] = useState(
    settings.servicesHeading || 'บริการการผลิตและพิมพ์ลายบรรจุภัณฑ์โลหะครบวงจร'
  );
  const [description, setDescription] = useState(
    settings.servicesDescription ||
      'ตั้งแต่การออกแบบแม่พิมพ์ การพิมพ์ลายออฟเซ็ตความละเอียดสูง ไปจนถึงการขึ้นรูปกระป๋องด้วยเทคโนโลยีสวิตเซอร์แลนด์'
  );
  const [services, setServices] = useState<ServiceItemSetting[]>(settings.servicesList || []);

  const [servicesTranslations, setServicesTranslations] = useState<any>(
    settings.servicesTranslations || {
      en: { badge: 'Manufacturing Services', heading: '', description: '' },
      jp: { badge: 'OEM製造サービス', heading: '', description: '' },
      cn: { badge: 'OEM定制加工', heading: '', description: '' },
      mm: { badge: 'OEM ဝန်ဆောင်မှုများ', heading: '', description: '' },
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      if (settings.servicesBadge) setBadge(settings.servicesBadge);
      if (settings.servicesHeading) setHeading(settings.servicesHeading);
      if (settings.servicesDescription) setDescription(settings.servicesDescription);
      if (settings.servicesList && settings.servicesList.length > 0) {
        setServices(settings.servicesList);
      }
      if (settings.servicesTranslations) {
        setServicesTranslations(settings.servicesTranslations);
      }
    }
  }, [settings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleServiceChange = (index: number, field: keyof ServiceItemSetting, value: any) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const handleAddService = () => {
    const newService: ServiceItemSetting = {
      id: `srv-${Date.now()}`,
      icon: 'Layers',
      titleTh: 'บริการใหม่ (New Service)',
      titleEn: 'New Manufacturing Service',
      descTh: 'คำอธิบายขอบเขตการให้บริการ...',
      descEn: 'Service description and capabilities...',
      features: ['คุณสมบัติเด่น 1', 'คุณสมบัติเด่น 2', 'คุณสมบัติเด่น 3'],
    };
    setServices([...services, newService]);
  };

  const handleCardImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 1200, 800, 0.85);
      handleServiceChange(index, 'image', compressed);
      showToast('อัปโหลดและบีบอัดรูปภาพเรียบร้อยแล้ว');
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการประมวลผลรูปภาพ');
    }
  };

  const handleDeleteService = (index: number) => {
    if (services.length <= 1) {
      alert('ต้องมีรายการบริการอย่างน้อย 1 รายการ');
      return;
    }
    setServices(services.filter((_, idx) => idx !== index));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings({
        servicesBadge: badge,
        servicesHeading: heading,
        servicesDescription: description,
        servicesList: services,
        servicesTranslations,
      });
      showToast('บันทึกข้อมูลหน้าบริการเรียบร้อยแล้ว');
    } catch (err: any) {
      alert('เกิดข้อผิดพลาดในการบันทึก: ' + (err.message || ''));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-theme-primary/40 bg-slate-900/90 px-4 py-3 text-xs font-semibold text-theme-primary shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4">
          <Check className="h-4 w-4 text-theme-primary" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-theme-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-theme-primary/10 text-theme-primary">
              <Layers className="h-4 w-4" />
            </span>
            <h1 className="font-display text-xl font-bold text-theme-text">
              {t('admin.servicesTitle', 'จัดการเนื้อหา: บริการของเรา (Services CMS)')}
            </h1>
          </div>
          <p className="text-xs text-theme-text-muted mt-1">
            {t('admin.servicesSubtitle', 'แก้ไขข้อความหัวข้อ และ Card รายการบริการผลิต/พิมพ์ลาย/แม่พิมพ์ในหน้าเว็บสาธารณะ (/services)')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleSave()}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-theme-primary px-5 py-2.5 text-xs font-bold text-black shadow-lg shadow-theme-primary/20 hover:opacity-90 disabled:opacity-50 transition-all"
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? t('admin.saving', 'กำลังบันทึก...') : t('admin.saveChanges', 'บันทึกการเปลี่ยนแปลง')}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Page Header Info */}
        <div className="rounded-2xl border border-theme-border bg-theme-surface p-6 space-y-5">
          <div className="border-b border-theme-border/60 pb-3">
            <h2 className="font-display text-sm font-bold text-theme-text flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-theme-primary" />
              <span>{t('admin.servicesBannerSection', '1. ข้อมูลหัวข้อหน้าบริการ (Page Banner & Header)')}</span>
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-theme-text mb-1.5">
                {t('admin.fieldBadge', 'ป้ายกำกับด้านบน (Badge / Subtitle Tag)')}
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Manufacturing Services"
                className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-xs text-theme-text focus:border-theme-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-theme-text mb-1.5">
                {t('admin.fieldHeading', 'หัวข้อหลักของหน้า (Page Title)')}
              </label>
              <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="บริการการผลิตและพิมพ์ลายบรรจุภัณฑ์โลหะครบวงจร"
                className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-xs font-bold text-theme-text focus:border-theme-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-theme-text mb-1.5">
                {t('admin.fieldDescription', 'คำบรรยายภาพรวม (Description)')}
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="คำอธิบายจุดเด่นของบริการผลิต..."
                className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-xs text-theme-text focus:border-theme-primary focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* 1.5 Multi-Language Translations (EN, JP, CN, MM) */}
        <MultiLangSectionEditor
          title={`${t('admin.multiLangTitle', 'แปลภาษา (Multi-Language)')} - ${t('admin.services', 'บริการ')}`}
          fields={[
            { key: 'badge', label: 'Badge' },
            { key: 'heading', label: 'Title / Heading' },
            { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
          ]}
          value={servicesTranslations}
          onChange={setServicesTranslations}
        />

        {/* Section 2: Services List */}
        <div className="rounded-2xl border border-theme-border bg-theme-surface p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-theme-border/60 pb-3">
            <div>
              <h2 className="font-display text-sm font-bold text-theme-text flex items-center gap-2">
                <Layers className="h-4 w-4 text-theme-primary" />
                <span>{t('admin.servicesCardsSection', '2. รายการบริการ (Services Cards)')}</span>
              </h2>
              <p className="text-[11px] text-theme-text-muted mt-0.5">
                {t('admin.servicesCardsDesc', 'แสดงผลเป็น Card พร้อมเอฟเฟกต์แสงเรือง (.glow-card) บนหน้าเว็บ')}
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddService}
              className="inline-flex items-center gap-1.5 rounded-lg border border-theme-primary/40 bg-theme-primary/10 px-3 py-1.5 text-xs font-bold text-theme-primary hover:bg-theme-primary/20 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{t('admin.addService', 'เพิ่มบริการใหม่')}</span>
            </button>
          </div>

          <div className="space-y-6">
            {services.map((srv, idx) => {
              const IconComp = AVAILABLE_ICONS[srv.icon] || Layers;

              return (
                <div
                  key={srv.id || idx}
                  className="rounded-xl border border-theme-border bg-theme-surface-elevated p-5 space-y-4 relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-theme-primary/15 text-theme-primary">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-theme-primary uppercase">
                          Service #{idx + 1}
                        </span>
                        <div className="text-xs font-bold text-theme-text truncate max-w-[300px]">
                          {srv.titleTh}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={async () => {
                          const updated = [...services];
                          const nextPinned = !Boolean(updated[idx].isPinned);
                          updated[idx] = { ...updated[idx], isPinned: nextPinned };
                          setServices(updated);
                          await updateSettings({ servicesList: updated });
                          showToast(nextPinned ? '📌 ปักหมุดแสดงที่หน้าแรกแล้ว' : 'ยกเลิกปักหมุดหน้าแรกแล้ว');
                        }}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                          Boolean(srv.isPinned)
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                            : 'bg-theme-surface text-theme-text-muted hover:text-theme-text border border-theme-border'
                        }`}
                        title={Boolean(srv.isPinned) ? 'คลิกเพื่อยกเลิกการปักหมุดหน้าแรก' : 'คลิกเพื่อปักหมุดแสดงที่หน้าแรก'}
                      >
                        <Pin className={`h-3.5 w-3.5 ${Boolean(srv.isPinned) ? 'fill-amber-400 text-amber-400' : ''}`} />
                        <span>{Boolean(srv.isPinned) ? `📌 ${t('admin.pinToHome', 'ปักหมุดหน้าแรก')}` : t('admin.pinToHome', 'ปักหมุดหน้าแรก')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteService(idx)}
                        className="rounded-lg p-1.5 text-theme-text-dim hover:bg-red-500/20 hover:text-red-400 transition-colors"
                        title="ลบบริการนี้"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-theme-text mb-1">
                          {t('admin.icon', 'ไอคอน (Icon)')}
                        </label>
                        <select
                          value={srv.icon}
                          onChange={(e) => handleServiceChange(idx, 'icon', e.target.value)}
                          className="w-full rounded-lg border border-theme-border bg-theme-surface px-2.5 py-1.5 text-xs text-theme-text focus:outline-none"
                        >
                          <option value="Layers">📦 Layers (OEM/ODM Manufacturing)</option>
                          <option value="Printer">🖨️ Printer (Metal Offset Printing)</option>
                          <option value="Wrench">🔧 Wrench (Tooling Engineering)</option>
                          <option value="ShieldCheck">🛡️ ShieldCheck (Quality Assurance)</option>
                          <option value="Cpu">🤖 Cpu (Automated Technology)</option>
                          <option value="PhoneCall">📞 PhoneCall (Customer Support)</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-semibold text-theme-text mb-1">
                          {t('admin.serviceTitleEn', 'ชื่อบริการ (ภาษาอังกฤษ)')}
                        </label>
                        <input
                          type="text"
                          value={srv.titleEn}
                          onChange={(e) => handleServiceChange(idx, 'titleEn', e.target.value)}
                          placeholder="Service Title (EN)"
                          className="w-full rounded-lg border border-theme-border bg-theme-surface px-2.5 py-1.5 text-xs text-theme-text focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-theme-text mb-1">
                        {t('admin.serviceTitleTh', 'ชื่อบริการ (ภาษาไทย)')}
                      </label>
                      <input
                        type="text"
                        value={srv.titleTh}
                        onChange={(e) => handleServiceChange(idx, 'titleTh', e.target.value)}
                        placeholder="ชื่อบริการผลิตบรรจุภัณฑ์โลหะ..."
                        className="w-full rounded-lg border border-theme-border bg-theme-surface px-2.5 py-1.5 text-xs font-semibold text-theme-text focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-theme-text mb-1">
                        {t('admin.serviceDescTh', 'คำอธิบายบริการ (ภาษาไทย)')}
                      </label>
                      <textarea
                        rows={2}
                        value={srv.descTh}
                        onChange={(e) => handleServiceChange(idx, 'descTh', e.target.value)}
                        placeholder="รายละเอียดและขอบเขตบริการ..."
                        className="w-full rounded-lg border border-theme-border bg-theme-surface px-2.5 py-1.5 text-xs text-theme-text focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-theme-text mb-1">
                        {t('admin.bulletPointsDesc', 'จุดเด่น / รายการย่อย (Bullet Points - แยก 1 ข้อต่อ 1 บรรทัด)')}
                      </label>
                      <textarea
                        rows={3}
                        value={(srv.features || []).join('\n')}
                        onChange={(e) =>
                          handleServiceChange(
                            idx,
                            'features',
                            e.target.value.split('\n').filter((l) => l.trim().length > 0)
                          )
                        }
                        placeholder="รองรับขนาดเส้นผ่านศูนย์กลาง 52 - 300 มม.&#10;เลือกสารเคลือบภายในตามประเภทอาหาร (BPA-NI)&#10;กำลังการผลิตสูง ส่งมอบตรงเวลา"
                        className="w-full rounded-lg border border-theme-border bg-theme-surface px-2.5 py-1.5 text-xs text-theme-text font-mono focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-theme-text mb-1">
                        {t('admin.cardImage', 'รูปภาพประจำ Card (Image)')}
                      </label>
                      <div className="flex items-center gap-3">
                        {srv.image && (
                          <img
                            src={srv.image}
                            alt={srv.titleTh}
                            className="h-12 w-16 object-cover rounded-lg border border-theme-border flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={srv.image || ''}
                            onChange={(e) => handleServiceChange(idx, 'image', e.target.value)}
                            placeholder="/images/cat-round-cans.jpg หรือ URL รูปภาพ"
                            className="w-full rounded-lg border border-theme-border bg-theme-surface px-2.5 py-1.5 text-xs text-theme-text focus:outline-none"
                          />
                          <label className="flex items-center gap-1 rounded-lg bg-theme-primary/15 border border-theme-primary/40 px-3 py-1.5 text-[11px] font-bold text-theme-primary hover:bg-theme-primary hover:text-black cursor-pointer transition-all flex-shrink-0">
                            <UploadCloud className="h-3.5 w-3.5" />
                            <span>{t('admin.uploadImage', 'อัปรูป')}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleCardImageUpload(idx, e)}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Multi-Language Tabs for this Service Card */}
                    <MultiLangSectionEditor
                      compact
                      title={`${t('admin.translateServiceCard', 'แปลภาษา Card บริการ')}: ${srv.titleTh}`}
                      fields={[
                        { key: 'title', label: t('admin.serviceTitle', 'ชื่อบริการ (Service Title)') },
                        { key: 'desc', label: t('admin.serviceDescription', 'คำอธิบายบริการ (Service Description)'), type: 'textarea', rows: 2 },
                      ]}
                      value={srv.translations || {
                        en: { title: srv.titleEn || '', desc: srv.descEn || '' },
                        jp: { title: '', desc: '' },
                        cn: { title: '', desc: '' },
                        mm: { title: '', desc: '' },
                      }}
                      onChange={(trans) => handleServiceChange(idx, 'translations', trans)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-theme-primary px-6 py-3 text-xs font-bold text-black shadow-lg shadow-theme-primary/20 hover:opacity-90 disabled:opacity-50 transition-all"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? t('admin.saving', 'กำลังบันทึกข้อมูล...') : t('admin.saveAllSettings', 'บันทึกการเปลี่ยนแปลงทั้งหมด')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
