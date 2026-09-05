import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSiteContent, SustainabilityCardSetting } from '../../hooks/useSiteContent';
import {
  Recycle,
  Sun,
  Droplets,
  Leaf,
  Wind,
  Flame,
  Shield,
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
  Recycle,
  Sun,
  Droplets,
  Leaf,
  Wind,
  Flame,
  Shield,
};

export const SustainabilityManager: React.FC = () => {
  const { t } = useTranslation();
  const { settings, updateSettings } = useSiteContent();

  const [badge, setBadge] = useState(settings.sustainabilityBadge || 'Circular Economy & ESG');
  const [heading, setHeading] = useState(
    settings.sustainabilityHeading || 'โลหะ... วัสดุเพื่อความยั่งยืนที่รีไซเคิลได้ไม่รู้จบ'
  );
  const [description, setDescription] = useState(
    settings.sustainabilityDescription ||
      'แผ่นเหล็กเคลือบดีบุกและอลูมิเนียมเป็นหนึ่งในวัสดุบรรจุภัณฑ์ที่เป็นมิตรต่อสิ่งแวดล้อมมากที่สุดในโลก สามารถนำกลับมาหลอมใช้ใหม่ได้ 100% โดยไม่สูญเสียคุณสมบัติเชิงกล'
  );
  const [cards, setCards] = useState<SustainabilityCardSetting[]>(settings.sustainabilityCards || []);

  const [sustainabilityTranslations, setSustainabilityTranslations] = useState<any>(
    settings.sustainabilityTranslations || {
      en: { badge: 'Circular Economy & ESG', heading: '', description: '' },
      jp: { badge: 'サステナビリティ', heading: '', description: '' },
      cn: { badge: '可持续发展', heading: '', description: '' },
      mm: { badge: 'ရေရှည်တည်တံ့မှု', heading: '', description: '' },
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      if (settings.sustainabilityBadge) setBadge(settings.sustainabilityBadge);
      if (settings.sustainabilityHeading) setHeading(settings.sustainabilityHeading);
      if (settings.sustainabilityDescription) setDescription(settings.sustainabilityDescription);
      if (settings.sustainabilityCards && settings.sustainabilityCards.length > 0) {
        setCards(settings.sustainabilityCards);
      }
      if (settings.sustainabilityTranslations) {
        setSustainabilityTranslations(settings.sustainabilityTranslations);
      }
    }
  }, [settings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCardChange = (index: number, field: keyof SustainabilityCardSetting, value: string) => {
    const updated = [...cards];
    updated[index] = { ...updated[index], [field]: value };
    setCards(updated);
  };

  const handleAddCard = () => {
    const newCard: SustainabilityCardSetting = {
      id: `sus-${Date.now()}`,
      icon: 'Leaf',
      titleTh: 'เสาหลักความยั่งยืนใหม่',
      titleEn: 'New ESG Pillar',
      descTh: 'คำอธิบายความยั่งยืนและการดูแลสิ่งแวดล้อม...',
      descEn: 'Environmental impact and sustainability commitments...',
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
      alert('ต้องมีเสาหลักความยั่งยืนอย่างน้อย 1 รายการ');
      return;
    }
    setCards(cards.filter((_, idx) => idx !== index));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings({
        sustainabilityBadge: badge,
        sustainabilityHeading: heading,
        sustainabilityDescription: description,
        sustainabilityCards: cards,
        sustainabilityTranslations,
      });
      showToast('บันทึกข้อมูลหน้าความยั่งยืนเรียบร้อยแล้ว');
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
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/90 px-4 py-3 text-xs font-semibold text-emerald-300 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-theme-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Recycle className="h-4 w-4" />
            </span>
            <h1 className="font-display text-xl font-bold text-theme-text">
              {t('admin.sustainabilityTitle', 'จัดการเนื้อหา: ความยั่งยืนและ ESG (Sustainability CMS)')}
            </h1>
          </div>
          <p className="text-xs text-theme-text-muted mt-1">
            {t('admin.sustainabilitySubtitle', 'แก้ไขข้อความหัวข้อ คำบรรยาย และ Card เสาหลักความยั่งยืนในหน้าเว็บสาธารณะ (/sustainability)')}
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
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>{t('admin.sustainabilityBannerSection', '1. ข้อมูลหัวข้อหน้าความยั่งยืน (Page Banner & Header)')}</span>
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
                placeholder="Circular Economy & ESG"
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
                placeholder="โลหะ... วัสดุเพื่อความยั่งยืนที่รีไซเคิลได้ไม่รู้จบ"
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
                placeholder="คำอธิบายแนวคิดเศรษฐกิจหมุนเวียนและนโยบายความยั่งยืนขององค์กร..."
                className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-xs text-theme-text focus:border-theme-primary focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* 1.5 Multi-Language Translations (EN, JP, CN, MM) */}
        <MultiLangSectionEditor
          title={`${t('admin.multiLangTitle', 'แปลภาษา (Multi-Language)')} - ${t('admin.sustainability', 'ความยั่งยืน')}`}
          fields={[
            { key: 'badge', label: 'Badge' },
            { key: 'heading', label: 'Title / Heading' },
            { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
          ]}
          value={sustainabilityTranslations}
          onChange={setSustainabilityTranslations}
        />

        {/* Section 2: Sustainability Cards */}
        <div className="rounded-2xl border border-theme-border bg-theme-surface p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-theme-border/60 pb-3">
            <div>
              <h2 className="font-display text-sm font-bold text-theme-text flex items-center gap-2">
                <Recycle className="h-4 w-4 text-emerald-400" />
                <span>2. เสาหลักความยั่งยืน (ESG Pillars Cards)</span>
              </h2>
              <p className="text-[11px] text-theme-text-muted mt-0.5">
                แสดงผลเป็น Card พร้อมเอฟเฟกต์แสงเรือง (.glow-card) บนหน้าเว็บ
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddCard}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>เพิ่ม Card ใหม่</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((card, idx) => {
              const IconComp = AVAILABLE_ICONS[card.icon] || Leaf;

              return (
                <div
                  key={card.id || idx}
                  className="rounded-xl border border-theme-border bg-theme-surface-elevated p-5 space-y-4 relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-theme-primary uppercase">
                          Card #{idx + 1}
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
                          await updateSettings({ sustainabilityCards: updated });
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
                        title="ลบ Card นี้"
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
                          <option value="Recycle">♻️ Recycle</option>
                          <option value="Sun">☀️ Sun (Solar)</option>
                          <option value="Droplets">💧 Droplets (Water)</option>
                          <option value="Leaf">🍃 Leaf (Green)</option>
                          <option value="Wind">💨 Wind (Clean Air)</option>
                          <option value="Flame">🔥 Flame (Energy)</option>
                          <option value="Shield">🛡️ Shield (Protection)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-theme-text mb-1">
                          หัวข้อ (ภาษาอังกฤษ)
                        </label>
                        <input
                          type="text"
                          value={card.titleEn}
                          onChange={(e) => handleCardChange(idx, 'titleEn', e.target.value)}
                          placeholder="Title (EN)"
                          className="w-full rounded-lg border border-theme-border bg-theme-surface px-2.5 py-1.5 text-xs text-theme-text focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-theme-text mb-1">
                        หัวข้อ (ภาษาไทย)
                      </label>
                      <input
                        type="text"
                        value={card.titleTh}
                        onChange={(e) => handleCardChange(idx, 'titleTh', e.target.value)}
                        placeholder="หัวข้อเสาหลักความยั่งยืน..."
                        className="w-full rounded-lg border border-theme-border bg-theme-surface px-2.5 py-1.5 text-xs font-semibold text-theme-text focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-theme-text mb-1">
                        คำอธิบายรายละเอียด (ภาษาไทย)
                      </label>
                      <textarea
                        rows={2}
                        value={card.descTh}
                        onChange={(e) => handleCardChange(idx, 'descTh', e.target.value)}
                        placeholder="รายละเอียดความยั่งยืน..."
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
                            placeholder="/images/hero-fullwidth.jpg หรือ URL รูปภาพ"
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

                    {/* Multi-Language Tabs for this Sustainability Card */}
                    <MultiLangSectionEditor
                      compact
                      title={`แปลภาษา Card ความยั่งยืน: ${card.titleTh}`}
                      fields={[
                        { key: 'title', label: 'หัวข้อความยั่งยืน (Title)' },
                        { key: 'desc', label: 'คำอธิบาย (Description)', type: 'textarea', rows: 2 },
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
