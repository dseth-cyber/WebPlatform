import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSiteContent, TechnologyCardSetting } from '../../hooks/useSiteContent';
import {
  Cpu,
  Eye,
  Gauge,
  Zap,
  Wrench,
  Shield,
  Layers,
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
  Cpu,
  Eye,
  Gauge,
  Zap,
  Wrench,
  Shield,
  Layers,
};

export const TechnologyManager: React.FC = () => {
  const { t } = useTranslation();
  const { settings, updateSettings } = useSiteContent();

  const [badge, setBadge] = useState(settings.technologyBadge || 'Manufacturing Automation');
  const [heading, setHeading] = useState(
    settings.technologyHeading || 'เทคโนโลยีการผลิตกระป๋องโลหะความเร็วสูงและ AI อัจฉริยะ'
  );
  const [description, setDescription] = useState(
    settings.technologyDescription ||
      'ยกระดับสายการผลิตด้วยเครื่องจักรทันสมัยระดับโลกเพื่อความแม่นยำระดับไมครอนและมาตรฐานความปลอดภัยสูงสุด'
  );
  const [cards, setCards] = useState<TechnologyCardSetting[]>(settings.technologyCards || []);

  const [technologyTranslations, setTechnologyTranslations] = useState<any>(
    settings.technologyTranslations || {
      en: { badge: 'Manufacturing Automation', heading: '', description: '' },
      jp: { badge: '製造技術', heading: '', description: '' },
      cn: { badge: '制造技术', heading: '', description: '' },
      mm: { badge: 'နည်းပညာ', heading: '', description: '' },
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      if (settings.technologyBadge) setBadge(settings.technologyBadge);
      if (settings.technologyHeading) setHeading(settings.technologyHeading);
      if (settings.technologyDescription) setDescription(settings.technologyDescription);
      if (settings.technologyCards && settings.technologyCards.length > 0) {
        setCards(settings.technologyCards);
      }
      if (settings.technologyTranslations) {
        setTechnologyTranslations(settings.technologyTranslations);
      }
    }
  }, [settings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCardChange = (index: number, field: keyof TechnologyCardSetting, value: string) => {
    const updated = [...cards];
    updated[index] = { ...updated[index], [field]: value };
    setCards(updated);
  };

  const handleAddCard = () => {
    const newCard: TechnologyCardSetting = {
      id: `tech-${Date.now()}`,
      icon: 'Cpu',
      titleTh: 'เครื่องจักรอัตโนมัติและนวัตกรรมใหม่',
      titleEn: 'Advanced Manufacturing Machinery',
      descTh: 'คำอธิบายคุณสมบัติ ความเร็ว และความแม่นยำของเครื่องจักร...',
      descEn: 'Specification, high-speed capability, and automated quality metrics...',
    };
    setCards([...cards, newCard]);
  };

  const handleCardImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 1200, 800, 0.85);
      handleCardChange(index, 'image', compressed);
      showToast('อัปโหลดและบีบอัดรูปภาพเรียบร้อยแล้ว');
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการประมวลผลรูปภาพ');
    }
  };

  const handleDeleteCard = (index: number) => {
    if (cards.length <= 1) {
      alert('ต้องมีรายการเทคโนโลยีอย่างน้อย 1 รายการ');
      return;
    }
    setCards(cards.filter((_, idx) => idx !== index));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings({
        technologyBadge: badge,
        technologyHeading: heading,
        technologyDescription: description,
        technologyCards: cards,
        technologyTranslations,
      });
      showToast('บันทึกข้อมูลหน้าเทคโนโลยีเรียบร้อยแล้ว');
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
              <Cpu className="h-4 w-4" />
            </span>
            <h1 className="font-display text-xl font-bold text-theme-text">
              {t('admin.techTitle', 'จัดการเนื้อหา: เทคโนโลยีและนวัตกรรม (Technology CMS)')}
            </h1>
          </div>
          <p className="text-xs text-theme-text-muted mt-1">
            {t('admin.techSubtitle', 'แก้ไขข้อความหัวข้อ คำบรรยาย และ Card เครื่องจักร/ระบบ AI ในหน้าเว็บสาธารณะ (/technology)')}
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
              <span>{t('admin.techBannerSection', '1. ข้อมูลหัวข้อหน้าเทคโนโลยี (Page Banner & Header)')}</span>
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
                placeholder="Manufacturing Automation"
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
                placeholder="เทคโนโลยีการผลิตกระป๋องโลหะความเร็วสูงและ AI อัจฉริยะ"
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
                placeholder="คำอธิบายความแม่นยำ เครื่องจักร และสายการผลิตอัตโนมัติ..."
                className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-xs text-theme-text focus:border-theme-primary focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* 1.5 Multi-Language Translations (EN, JP, CN, MM) */}
        <MultiLangSectionEditor
          title={`${t('admin.multiLangTitle', 'แปลภาษา (Multi-Language)')} - ${t('admin.technology', 'เทคโนโลยี')}`}
          fields={[
            { key: 'badge', label: 'Badge' },
            { key: 'heading', label: 'Title / Heading' },
            { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
          ]}
          value={technologyTranslations}
          onChange={setTechnologyTranslations}
        />

        {/* Section 2: Technology Cards */}
        <div className="rounded-2xl border border-theme-border bg-theme-surface p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-theme-border/60 pb-3">
            <div>
              <h2 className="font-display text-sm font-bold text-theme-text flex items-center gap-2">
                <Cpu className="h-4 w-4 text-theme-primary" />
                <span>{t('admin.techCardsSection', '2. รายการเครื่องจักรและนวัตกรรม AI (Technology Cards)')}</span>
              </h2>
              <p className="text-[11px] text-theme-text-muted mt-0.5">
                แสดงผลเป็น Card พร้อมเอฟเฟกต์แสงเรือง (.glow-card) บนหน้าเว็บ
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddCard}
              className="inline-flex items-center gap-1.5 rounded-lg border border-theme-primary/40 bg-theme-primary/10 px-3 py-1.5 text-xs font-bold text-theme-primary hover:bg-theme-primary/20 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>เพิ่มเครื่องจักร/เทคโนโลยี</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((card, idx) => {
              const IconComp = AVAILABLE_ICONS[card.icon] || Cpu;

              return (
                <div
                  key={card.id || idx}
                  className="rounded-xl border border-theme-border bg-theme-surface-elevated p-5 space-y-4 relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-theme-primary/15 text-theme-primary">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-theme-primary uppercase">
                          Tech #{idx + 1}
                        </span>
                        <div className="text-xs font-bold text-theme-text truncate max-w-[200px]">
                          {card.titleTh}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={async () => {
                          const updated = [...cards];
                          const nextPinned = !Boolean(updated[idx].isPinned);
                          updated[idx] = { ...updated[idx], isPinned: nextPinned };
                          setCards(updated);
                          await updateSettings({ technologyCards: updated });
                          showToast(nextPinned ? '📌 ปักหมุดแสดงที่หน้าแรกแล้ว' : 'ยกเลิกปักหมุดหน้าแรกแล้ว');
                        }}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                          Boolean(card.isPinned)
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                            : 'bg-theme-surface text-theme-text-muted hover:text-theme-text border border-theme-border'
                        }`}
                        title={Boolean(card.isPinned) ? 'คลิกเพื่อยกเลิกการปักหมุดหน้าแรก' : 'คลิกเพื่อปักหมุดแสดงที่หน้าแรก'}
                      >
                        <Pin className={`h-3.5 w-3.5 ${Boolean(card.isPinned) ? 'fill-amber-400 text-amber-400' : ''}`} />
                        <span>{Boolean(card.isPinned) ? '📌 ปักหมุดหน้าแรก' : 'ปักหมุดหน้าแรก'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteCard(idx)}
                        className="rounded-lg p-1.5 text-theme-text-dim hover:bg-red-500/20 hover:text-red-400 transition-colors"
                        title="ลบรายการนี้"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-theme-text mb-1">
                          ไอคอน (Icon)
                        </label>
                        <select
                          value={card.icon}
                          onChange={(e) => handleCardChange(idx, 'icon', e.target.value)}
                          className="w-full rounded-lg border border-theme-border bg-theme-surface px-2.5 py-1.5 text-xs text-theme-text focus:outline-none"
                        >
                          <option value="Cpu">🤖 Cpu (Welder / Microcontroller)</option>
                          <option value="Eye">👁️ Eye (AI Camera Vision)</option>
                          <option value="Gauge">⚙️ Gauge (Flanging / Pressure)</option>
                          <option value="Zap">⚡ Zap (UV Offset High-Speed)</option>
                          <option value="Wrench">🔧 Wrench (Tooling Engineering)</option>
                          <option value="Shield">🛡️ Shield (Quality Protection)</option>
                          <option value="Layers">📦 Layers (Lamination & Metal)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-theme-text mb-1">
                          ชื่อเทคโนโลยี (ภาษาอังกฤษ)
                        </label>
                        <input
                          type="text"
                          value={card.titleEn}
                          onChange={(e) => handleCardChange(idx, 'titleEn', e.target.value)}
                          placeholder="Technology Title (EN)"
                          className="w-full rounded-lg border border-theme-border bg-theme-surface px-2.5 py-1.5 text-xs text-theme-text focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-theme-text mb-1">
                        ชื่อเทคโนโลยี / เครื่องจักร (ภาษาไทย)
                      </label>
                      <input
                        type="text"
                        value={card.titleTh}
                        onChange={(e) => handleCardChange(idx, 'titleTh', e.target.value)}
                        placeholder="ชื่อเครื่องจักรหรือนวัตกรรมการผลิต..."
                        className="w-full rounded-lg border border-theme-border bg-theme-surface px-2.5 py-1.5 text-xs font-semibold text-theme-text focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-theme-text mb-1">
                        คำอธิบายคุณสมบัติและสเปก (ภาษาไทย)
                      </label>
                      <textarea
                        rows={2}
                        value={card.descTh}
                        onChange={(e) => handleCardChange(idx, 'descTh', e.target.value)}
                        placeholder="ความเร็ว ความแม่นยำ และคุณสมบัติเด่น..."
                        className="w-full rounded-lg border border-theme-border bg-theme-surface px-2.5 py-1.5 text-xs text-theme-text focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-theme-text mb-1">
                        รูปภาพประจำ Card (Image)
                      </label>
                      <div className="flex items-center gap-3">
                        {card.image && (
                          <img
                            src={card.image}
                            alt={card.titleTh}
                            className="h-12 w-16 object-cover rounded-lg border border-theme-border flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={card.image || ''}
                            onChange={(e) => handleCardChange(idx, 'image', e.target.value)}
                            placeholder="/images/cat-printed-cans.jpg หรือ URL รูปภาพ"
                            className="w-full rounded-lg border border-theme-border bg-theme-surface px-2.5 py-1.5 text-xs text-theme-text focus:outline-none"
                          />
                          <label className="flex items-center gap-1 rounded-lg bg-theme-primary/15 border border-theme-primary/40 px-3 py-1.5 text-[11px] font-bold text-theme-primary hover:bg-theme-primary hover:text-black cursor-pointer transition-all flex-shrink-0">
                            <UploadCloud className="h-3.5 w-3.5" />
                            <span>อัปรูป</span>
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

                    {/* Multi-Language Tabs for this Tech Card */}
                    <MultiLangSectionEditor
                      compact
                      title={`แปลภาษา Card เทคโนโลยี: ${card.titleTh}`}
                      fields={[
                        { key: 'title', label: 'ชื่อเทคโนโลยี (Tech Title)' },
                        { key: 'desc', label: 'คำอธิบายเทคโนโลยี (Tech Description)', type: 'textarea', rows: 2 },
                      ]}
                      value={card.translations || {
                        en: { title: card.titleEn || '', desc: card.descEn || '' },
                        jp: { title: '', desc: '' },
                        cn: { title: '', desc: '' },
                        mm: { title: '', desc: '' },
                      }}
                      onChange={(trans) => handleCardChange(idx, 'translations' as any, trans as any)}
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
            <span>{isSaving ? 'กำลังบันทึกข้อมูล...' : 'บันทึกการเปลี่ยนแปลงทั้งหมด'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
