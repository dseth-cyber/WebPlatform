import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme/ThemeProvider';
import { useSiteContent } from '../../hooks/useSiteContent';
import { Modal } from '../../components/ui/Modal';
import {
  Sun,
  Moon,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  ArrowLeft,
  Image as ImageIcon,
  Save,
  Send,
  Eye,
  EyeOff,
  History,
  RotateCcw,
  Smartphone,
  Tablet,
  Laptop,
  Check,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Plus,
  Sliders,
  Play,
} from 'lucide-react';
import { compressImageFile } from '../../utils/imageCompressor';
import { MultiLangSectionEditor } from './MultiLangSectionEditor';
import { FeatureBadgeSetting } from '../../hooks/useSiteContent';

interface RevisionRecord {
  id: string;
  revisionNumber: number;
  title: string;
  highlight: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  heroImage: string;
  author: string;
  createdAt: string;
  status: 'PUBLISHED' | 'DRAFT' | 'REVIEW';
  note: string;
}

export const PageEditor: React.FC<{
  pageId: string;
  onBack: () => void;
}> = ({ pageId, onBack }) => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings } = useSiteContent();

  // Workflow Status: DRAFT -> PREVIEW -> REVIEW -> PUBLISHED
  const [workflowStatus, setWorkflowStatus] = useState<'DRAFT' | 'REVIEW' | 'PUBLISHED'>('PUBLISHED');

  // 4 Languages Translation Tabs (EN, JP, CN, MM)
  const [activeTranslationLang, setActiveTranslationLang] = useState<'en' | 'jp' | 'cn' | 'mm'>('en');

  // Form States (Column 1 - Thai Content)
  const [thaiTitle, setThaiTitle] = useState(settings.heroTitle || 'ไคโอทรอน เทคโนโลยี');
  const [thaiSubtitle, setThaiSubtitle] = useState(settings.heroHighlight || 'วิศวกรรมแห่งอนาคต');
  const [thaiDesc, setThaiDesc] = useState(
    settings.heroSubtitle ||
      'ผู้นำบรรจุภัณฑ์โลหะทางด้านอาหารสำเร็จรูปในประเทศไทย ด้วยเทคโนโลยีที่ทันสมัย คุณภาพมาตรฐานสากล และบริการที่เป็นเลิศ เพื่อตอบสนองความพึงพอใจของลูกค้า และความยั่งยืนของอุตสาหกรรม'
  );
  const [showPrimaryBtn, setShowPrimaryBtn] = useState(settings.showHeroPrimaryBtn !== false);
  const [ctaText, setCtaText] = useState(settings.heroButtonText || 'อ่านประวัติองค์กร');
  const [ctaLink, setCtaLink] = useState(settings.heroButtonLink || '#about');

  const [showSecondaryBtn, setShowSecondaryBtn] = useState(settings.showHeroSecondaryBtn !== false);
  const [secondaryCtaText, setSecondaryCtaText] = useState(settings.heroSecondaryButtonText || 'ชมผลิตภัณฑ์ของเรา');
  const [secondaryCtaLink, setSecondaryCtaLink] = useState(settings.heroSecondaryButtonLink || '#products');

  // Form States (Column 2 - Media Slider up to 5 images)
  const initialHeroImages = settings.heroImages && settings.heroImages.length > 0
    ? settings.heroImages
    : [settings.heroBannerImage || '/images/hero-fullwidth.jpg'];
  const [heroImagesList, setHeroImagesList] = useState<string[]>(initialHeroImages);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [heroAutoSlide, setHeroAutoSlide] = useState(settings.heroAutoSlide !== false);
  const [heroSlideInterval, setHeroSlideInterval] = useState(settings.heroSlideInterval || 5);
  const [heroShowArrows, setHeroShowArrows] = useState(settings.heroShowArrows !== false);
  const [heroShowDots, setHeroShowDots] = useState(settings.heroShowDots !== false);
  const [heroTextOverlayOpacity, setHeroTextOverlayOpacity] = useState<number>(
    settings.heroTextOverlayOpacity !== undefined ? settings.heroTextOverlayOpacity : 30
  );
  const [newImageUrlInput, setNewImageUrlInput] = useState('');

  // Sync with global settings when loaded from DB
  React.useEffect(() => {
    if (settings) {
      if (settings.heroTitle) setThaiTitle(settings.heroTitle);
      if (settings.heroHighlight) setThaiSubtitle(settings.heroHighlight);
      if (settings.heroSubtitle) setThaiDesc(settings.heroSubtitle);
      if (settings.heroButtonText) setCtaText(settings.heroButtonText);
      if (settings.heroButtonLink) setCtaLink(settings.heroButtonLink);
      if (settings.showHeroPrimaryBtn !== undefined) setShowPrimaryBtn(settings.showHeroPrimaryBtn !== false);
      if (settings.heroSecondaryButtonText) setSecondaryCtaText(settings.heroSecondaryButtonText);
      if (settings.heroSecondaryButtonLink) setSecondaryCtaLink(settings.heroSecondaryButtonLink);
      if (settings.showHeroSecondaryBtn !== undefined) setShowSecondaryBtn(settings.showHeroSecondaryBtn !== false);
      if (settings.heroImages && settings.heroImages.length > 0) {
        setHeroImagesList(settings.heroImages);
      } else if (settings.heroBannerImage) {
        setHeroImagesList([settings.heroBannerImage]);
      }
      if (settings.heroAutoSlide !== undefined) setHeroAutoSlide(settings.heroAutoSlide !== false);
      if (settings.heroSlideInterval !== undefined) setHeroSlideInterval(settings.heroSlideInterval || 5);
      if (settings.heroShowArrows !== undefined) setHeroShowArrows(settings.heroShowArrows !== false);
      if (settings.heroShowDots !== undefined) setHeroShowDots(settings.heroShowDots !== false);
      if (settings.heroTextOverlayOpacity !== undefined) setHeroTextOverlayOpacity(settings.heroTextOverlayOpacity);
      if (settings.heroTranslations) setTranslations(settings.heroTranslations);
      if (settings.featureBadges && settings.featureBadges.length > 0) {
        setFeatureBadges(settings.featureBadges);
      }
    }
  }, [settings]);

  // Feature Badges State (4 Badges - 5 Languages Supported)
  const [featureBadges, setFeatureBadges] = useState<FeatureBadgeSetting[]>(settings.featureBadges || []);

  // Form States (Column 3 - Localized Translations for EN, JP, CN, MM)
  const [translations, setTranslations] = useState({
    en: {
      title: 'CHIOTRON TECHNOLOGY',
      subtitle: 'World-Class Metal Packaging & Automation',
      desc: "Thailand's leading manufacturer of metal packaging for ready-to-eat food with advanced technology, international quality standards, and exceptional customer service.",
    },
    jp: {
      title: 'カイオトロン・テクノロジー',
      subtitle: '世界水準の金属包装ソリューション',
      desc: 'タイを代表する即席食品用金属包装メーカー。先進技術と国際品質基準、卓越したサービスで産業の持続可能性を支えます。',
    },
    cn: {
      title: '凯奥创科技有限公司',
      subtitle: '世界级高品质金属包装',
      desc: '泰国领先的即食食品金属包装制造商，凭借先进技术、国际标准品质和卓越服务，满足客户需求并促进工业可持续发展。',
    },
    mm: {
      title: 'CHIOTRON TECHNOLOGY ကုမ္ပဏီလီမိတက်',
      subtitle: 'ကမ္ဘာ့အဆင့်မီ သတ္တုထုပ်ပိုးပစ္စည်းများ',
      desc: 'အဆင့်မြင့်နည်းပညာ၊ နိုင်ငံတကာအဆင့်မီ အရည်အသွေးနှင့် ထူးချွန်သောဝန်ဆောင်မှုများဖြင့် ထိုင်းနိုင်ငံ၏ ဦးဆောင်စားသောက်ကုန် သတ္တုဘူးထုပ်ပိုးထုတ်လုပ်သူ။',
    },
  });

  // Revisions State (Revision 5 Current -> Revision 1)
  const [revisions, setRevisions] = useState<RevisionRecord[]>([
    {
      id: 'rev-5',
      revisionNumber: 5,
      title: settings.heroTitle || 'ไคโอทรอน เทคโนโลยี',
      highlight: settings.heroHighlight || 'วิศวกรรมแห่งอนาคต',
      subtitle: settings.heroSubtitle || 'ผู้นำบรรจุภัณฑ์โลหะทางด้านอาหารสำเร็จรูปในประเทศไทย...',
      buttonText: 'เกี่ยวกับเรา',
      buttonLink: '/about',
      heroImage: settings.heroBannerImage || '/images/hero-fullwidth.jpg',
      author: 'Administrator (Super Admin)',
      createdAt: new Date().toISOString(),
      status: 'PUBLISHED',
      note: 'อัปเดตรูปหน้าปก Hero Fullwidth & ปรับคำโปรยภาษาไทย',
    },
    {
      id: 'rev-4',
      revisionNumber: 4,
      title: 'บริษัท ไคโอทรอน เทคโนโลยี จำกัด',
      highlight: 'ผู้ผลิตกระป๋องอาหารและถังเคมีมาตรฐานสากล',
      subtitle: 'โรงงานผลิตบรรจุภัณฑ์โลหะชั้นนำ มาตรฐาน ISO 9001:2015 & FSSC 22000',
      buttonText: 'สำรวจแคตตาล็อกสินค้า',
      buttonLink: '/products',
      heroImage: '/images/hero-cans-banner.jpg',
      author: 'Content Editor (Somchai)',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      status: 'DRAFT',
      note: 'เปลี่ยนสโลแกนเน้นมาตรฐานรับรองสากล',
    },
    {
      id: 'rev-3',
      revisionNumber: 3,
      title: 'CHIOTRON Metal Packaging',
      highlight: 'ผู้นำอุตสาหกรรมกระป๋อง 3 ชิ้น',
      subtitle: 'เทคโนโลยีขึ้นรูปตะเข็บคู่ Double Seam ความแม่นยำสูง',
      buttonText: 'ขอใบเสนอราคา',
      buttonLink: '/contact',
      heroImage: '/images/factory-building.jpg',
      author: 'Administrator',
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      status: 'DRAFT',
      note: 'ทดสอบปุ่มขอใบเสนอราคาบนหน้าแรก',
    },
    {
      id: 'rev-2',
      revisionNumber: 2,
      title: 'ไคโอทรอน เทคโนโลยี 1986',
      highlight: 'ประสบการณ์กว่า 38 ปีแห่งความเป็นเลิศ',
      subtitle: 'ส่งมอบบรรจุภัณฑ์เหล็กเคลือบดีบุกและอลูมิเนียมปลอดสาร BPA 100%',
      buttonText: 'อ่านประวัติองค์กร',
      buttonLink: '/about',
      heroImage: '/images/hero-fullwidth.jpg',
      author: 'Super Admin',
      createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
      status: 'DRAFT',
      note: 'เวอร์ชันแรกเริ่มการปรับปรุงเว็บไซต์',
    },
  ]);

  // Modal Controls
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [selectedRevision, setSelectedRevision] = useState<RevisionRecord | null>(null);

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (heroImagesList.length >= 5) {
        showNotification('⚠️ ไม่สามารถเพิ่มภาพได้ เนื่องจากครบโควต้าสูงสุด 5 ภาพแล้ว');
        return;
      }
      try {
        showNotification('กำลังประมวลผลและปรับขนาดภาพ...');
        const optimizedDataUrl = await compressImageFile(file, 1920, 1080, 0.85);
        const updated = [...heroImagesList, optimizedDataUrl];
        setHeroImagesList(updated);
        setActiveSlideIndex(updated.length - 1);
        setWorkflowStatus('DRAFT');
        showNotification(`✅ อัปโหลดภาพที่ ${updated.length} สำเร็จแล้ว (Draft)`);
      } catch (err) {
        showNotification('เกิดข้อผิดพลาดในการโหลดรูปภาพ');
      }
    }
  };

  const handleAddImageUrl = () => {
    if (!newImageUrlInput.trim()) return;
    if (heroImagesList.length >= 5) {
      showNotification('⚠️ เพิ่มภาพได้สูงสุด 5 ภาพเท่านั้น');
      return;
    }
    const updated = [...heroImagesList, newImageUrlInput.trim()];
    setHeroImagesList(updated);
    setActiveSlideIndex(updated.length - 1);
    setNewImageUrlInput('');
    setWorkflowStatus('DRAFT');
    showNotification(`✅ เพิ่มภาพที่ ${updated.length} เรียบร้อยแล้ว`);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (heroImagesList.length <= 1) {
      showNotification('⚠️ ต้องมีภาพพื้นหลังอย่างน้อย 1 ภาพ');
      return;
    }
    const updated = heroImagesList.filter((_, idx) => idx !== indexToRemove);
    setHeroImagesList(updated);
    if (activeSlideIndex >= updated.length) {
      setActiveSlideIndex(Math.max(0, updated.length - 1));
    }
    setWorkflowStatus('DRAFT');
    showNotification('🗑️ ลบภาพออกจากสไลด์แล้ว');
  };

  const handleSaveDraft = () => {
    setWorkflowStatus('DRAFT');
    const newRev: RevisionRecord = {
      id: 'rev-' + Date.now(),
      revisionNumber: revisions.length + 1,
      title: thaiTitle,
      highlight: thaiSubtitle,
      subtitle: thaiDesc,
      buttonText: ctaText,
      buttonLink: ctaLink,
      heroImage: heroImagesList[0] || '/images/hero-fullwidth.jpg',
      author: 'Administrator',
      createdAt: new Date().toISOString(),
      status: 'DRAFT',
      note: 'บันทึกเป็นฉบับร่าง (Draft)',
    };
    setRevisions([newRev, ...revisions]);
    showNotification('บันทึกเป็นฉบับร่าง (Draft) สำเร็จแล้ว!');
  };

  const handlePublish = () => {
    const primaryHero = heroImagesList[0] || '/images/hero-fullwidth.jpg';
    updateSettings({
      heroTitle: thaiTitle,
      heroHighlight: thaiSubtitle,
      heroSubtitle: thaiDesc,
      heroButtonText: ctaText,
      heroButtonLink: ctaLink,
      showHeroPrimaryBtn: showPrimaryBtn,
      heroSecondaryButtonText: secondaryCtaText,
      heroSecondaryButtonLink: secondaryCtaLink,
      showHeroSecondaryBtn: showSecondaryBtn,
      heroBannerImage: primaryHero,
      heroImages: heroImagesList,
      heroAutoSlide: heroAutoSlide,
      heroSlideInterval: heroSlideInterval,
      heroShowArrows: heroShowArrows,
      heroShowDots: heroShowDots,
      heroTextOverlayOpacity: heroTextOverlayOpacity,
      heroTranslations: translations,
      featureBadges: featureBadges,
    });
    setWorkflowStatus('PUBLISHED');
    const newRev: RevisionRecord = {
      id: 'rev-' + Date.now(),
      revisionNumber: revisions.length + 1,
      title: thaiTitle,
      highlight: thaiSubtitle,
      subtitle: thaiDesc,
      buttonText: ctaText,
      buttonLink: ctaLink,
      heroImage: primaryHero,
      author: 'Administrator',
      createdAt: new Date().toISOString(),
      status: 'PUBLISHED',
      note: 'เผยแพร่สู่หน้าเว็บไซต์จริง (Published Live)',
    };
    setRevisions([newRev, ...revisions]);
    setPreviewModalOpen(false);
    showNotification('🚀 เผยแพร่ข้อมูลสู่หน้าเว็บไซต์จริง (Published Live) เรียบร้อยแล้ว!');
  };

  const handleRestoreRevision = (rev: RevisionRecord) => {
    setThaiTitle(rev.title);
    setThaiSubtitle(rev.highlight);
    setThaiDesc(rev.subtitle);
    setCtaText(rev.buttonText);
    setCtaLink(rev.buttonLink);
    if (rev.heroImage) {
      setHeroImagesList([rev.heroImage]);
      setActiveSlideIndex(0);
    }
    setWorkflowStatus('DRAFT');
    setRevisionModalOpen(false);
    showNotification(`🔄 กู้คืนข้อมูลจาก Revision ${rev.revisionNumber} เรียบร้อยแล้ว! (กรุณากด Preview หรือ Publish เพื่อยืนยัน)`);
  };

  return (
    <div className="space-y-6 font-sans pb-24">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-2xl animate-bounce">
          <Check className="h-5 w-5" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Header Bar: Status Badge, Preview Button, Revision History Button, Publish Button */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-theme-border pb-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-theme-border bg-theme-surface p-2 text-theme-text hover:text-theme-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-black text-theme-text flex items-center gap-3">
              <span>{t('admin.editHeroSection', 'แก้ไขหน้าแรก (Hero Section CMS)')}</span>
              {/* Workflow Status Pill */}
              <span
                className={`rounded-full px-3 py-0.5 text-xs font-bold border ${
                  workflowStatus === 'PUBLISHED'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : workflowStatus === 'REVIEW'
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                }`}
              >
                ● {workflowStatus}
              </span>
            </h1>
            <p className="text-xs text-theme-text-muted mt-0.5">
              {t('admin.heroWorkflowSubtitle', 'Flow การทำงาน: Draft → Preview → Review → Publish พร้อมประวัติ Version Rollback')}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Revision History Button */}
          <button
            type="button"
            onClick={() => setRevisionModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-theme-border bg-theme-surface px-4 py-2.5 text-xs font-bold text-theme-text hover:border-theme-primary transition-colors shadow-sm"
          >
            <History className="h-4 w-4 text-theme-primary" />
            <span>{t('admin.revisionHistory', 'ประวัติเวอร์ชัน')} (Revision {revisions[0]?.revisionNumber || 5})</span>
          </button>

          {/* Live Preview Button */}
          <button
            type="button"
            onClick={() => setPreviewModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-theme-primary/40 bg-theme-primary/10 px-4 py-2.5 text-xs font-black text-theme-primary hover:bg-theme-primary hover:text-black transition-all shadow-sm"
          >
            <Eye className="h-4 w-4" />
            <span>🔍 {t('admin.livePreview', 'ดูตัวอย่างหน้าจริง (Live Preview)')}</span>
          </button>

          {/* Save Draft */}
          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 rounded-xl border border-theme-border bg-theme-surface px-4 py-2.5 text-xs font-bold text-theme-text hover:bg-theme-surface-elevated transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>{t('admin.saveDraft', 'บันทึก Draft')}</span>
          </button>

          {/* Publish Button */}
          <button
            type="button"
            onClick={handlePublish}
            className="btn-primary-action text-xs font-black px-6 py-2.5 shadow-xl"
          >
            <Send className="h-4 w-4 text-black" />
            <span>🚀 {t('admin.publishNow', 'เผยแพร่ทันที (Publish)')}</span>
          </button>
        </div>
      </div>

      {/* 3-COLUMNS EDITOR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLUMN 1: เนื้อหา (Thai Content) */}
        <div className="lg:col-span-4 rounded-3xl border border-theme-border bg-theme-surface p-6 shadow-2xl space-y-4">
          <h2 className="font-display text-sm font-bold text-theme-text border-b border-theme-border pb-3 flex items-center justify-between">
            <span>{t('admin.mainContentTh', 'เนื้อหาหลัก (ภาษาไทย 🇹🇭)')}</span>
            <span className="text-[10px] text-theme-text-muted font-mono">{t('admin.primaryLanguage', 'Primary Language')}</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-theme-text block mb-1">{t('admin.heroTitleTh', 'หัวข้อหลัก Title (ไทย)')}</label>
              <input
                type="text"
                value={thaiTitle}
                onChange={(e) => {
                  setThaiTitle(e.target.value);
                  setWorkflowStatus('DRAFT');
                }}
                className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-xs text-theme-text focus:border-theme-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-theme-text block mb-1">{t('admin.heroHighlightTh', 'หัวข้อย่อยเน้นสีทอง Highlight (ไทย)')}</label>
              <input
                type="text"
                value={thaiSubtitle}
                onChange={(e) => {
                  setThaiSubtitle(e.target.value);
                  setWorkflowStatus('DRAFT');
                }}
                className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-xs text-theme-text focus:border-theme-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-theme-text block mb-1">{t('admin.heroSubtitleTh', 'คำบรรยายรายละเอียด Subtitle (ไทย)')}</label>
              <textarea
                rows={5}
                value={thaiDesc}
                onChange={(e) => {
                  setThaiDesc(e.target.value);
                  setWorkflowStatus('DRAFT');
                }}
                className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-xs text-theme-text focus:border-theme-primary focus:outline-none leading-relaxed"
              />
            </div>

            {/* BUTTON 1 (สีทอง - อ่านประวัติองค์กร) */}
            <div className="rounded-2xl border border-theme-border bg-theme-surface-elevated p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-theme-text flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
                  <span>{t('admin.button1Gold', 'ปุ่มที่ 1 (สีทอง - หลัก)')}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowPrimaryBtn(!showPrimaryBtn);
                    setWorkflowStatus('DRAFT');
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                    showPrimaryBtn
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-slate-500/20 text-slate-400 border-slate-500/40'
                  }`}
                >
                  {showPrimaryBtn ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  <span>{showPrimaryBtn ? t('admin.activeShowing', 'แสดงผลอยู่') : t('admin.statusHidden', 'ซ่อนอยู่')}</span>
                </button>
              </div>

              {showPrimaryBtn && (
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div>
                    <label className="font-bold text-theme-text-muted block text-[10px] mb-1">{t('admin.buttonText', 'ข้อความบนปุ่ม')}</label>
                    <input
                      type="text"
                      value={ctaText}
                      onChange={(e) => {
                        setCtaText(e.target.value);
                        setWorkflowStatus('DRAFT');
                      }}
                      className="w-full rounded-xl border border-theme-border bg-theme-surface px-2.5 py-1.5 text-xs text-theme-text"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-theme-text-muted block text-[10px] mb-1">{t('admin.targetLink', 'ลิงก์ปลายทาง')}</label>
                    <input
                      type="text"
                      value={ctaLink}
                      onChange={(e) => {
                        setCtaLink(e.target.value);
                        setWorkflowStatus('DRAFT');
                      }}
                      className="w-full rounded-xl border border-theme-border bg-theme-surface px-2.5 py-1.5 text-xs text-theme-text font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* BUTTON 2 (สีดำใส - ชมผลิตภัณฑ์ของเรา) */}
            <div className="rounded-2xl border border-theme-border bg-theme-surface-elevated p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-theme-text flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/70 border border-white/40 shadow-sm" />
                  <span>{t('admin.button2Transparent', 'ปุ่มที่ 2 (โครงร่างใส - รอง)')}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowSecondaryBtn(!showSecondaryBtn);
                    setWorkflowStatus('DRAFT');
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                    showSecondaryBtn
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-slate-500/20 text-slate-400 border-slate-500/40'
                  }`}
                >
                  {showSecondaryBtn ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  <span>{showSecondaryBtn ? t('admin.activeShowing', 'แสดงผลอยู่') : t('admin.statusHidden', 'ซ่อนอยู่')}</span>
                </button>
              </div>

              {showSecondaryBtn && (
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div>
                    <label className="font-bold text-theme-text-muted block text-[10px] mb-1">{t('admin.buttonText', 'ข้อความบนปุ่ม')}</label>
                    <input
                      type="text"
                      value={secondaryCtaText}
                      onChange={(e) => {
                        setSecondaryCtaText(e.target.value);
                        setWorkflowStatus('DRAFT');
                      }}
                      className="w-full rounded-xl border border-theme-border bg-theme-surface px-2.5 py-1.5 text-xs text-theme-text"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-theme-text-muted block text-[10px] mb-1">{t('admin.targetLink', 'ลิงก์ปลายทาง')}</label>
                    <input
                      type="text"
                      value={secondaryCtaLink}
                      onChange={(e) => {
                        setSecondaryCtaLink(e.target.value);
                        setWorkflowStatus('DRAFT');
                      }}
                      className="w-full rounded-xl border border-theme-border bg-theme-surface px-2.5 py-1.5 text-xs text-theme-text font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* COLUMN 2: ระบบจัดการภาพพื้นหลังปก Hero Slider (สูงสุด 5 ภาพ) */}
        <div className="lg:col-span-4 rounded-3xl border border-theme-border bg-theme-surface p-6 shadow-2xl space-y-4">
          <div className="border-b border-theme-border pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-sm font-bold text-theme-text">{t('admin.heroMediaTitle', 'ภาพพื้นหลังปก (Hero Media)')}</h2>
              <span className="rounded-full bg-theme-primary/20 text-theme-primary px-2 py-0.5 text-[10px] font-bold">
                {heroImagesList.length}/5 {t('admin.imagesUnit', 'ภาพ')}
              </span>
            </div>
            <span className="text-[10px] text-theme-text-muted font-mono">1920x1080 Fullwidth</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Live Slider Preview with Navigation */}
            <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl border-2 border-theme-border bg-black relative shadow-inner group">
              <img
                src={heroImagesList[activeSlideIndex] || heroImagesList[0] || '/images/hero-fullwidth.jpg'}
                alt={`Hero Banner ${activeSlideIndex + 1}`}
                className="h-full w-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

              {/* Slide Counter Overlay */}
              <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
                <span className="rounded-lg bg-black/75 px-2.5 py-1 text-[10px] font-bold text-white border border-white/20 backdrop-blur-sm">
                  {activeSlideIndex + 1} / {heroImagesList.length}
                </span>
                {activeSlideIndex === 0 && (
                  <span className="rounded-lg bg-amber-500/90 text-black px-2 py-1 text-[10px] font-extrabold shadow-sm">
                    {t('admin.defaultCover', 'ภาพปกเริ่มต้น')}
                  </span>
                )}
              </div>

              {/* Prev / Next Arrows for Preview */}
              {heroImagesList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveSlideIndex((prev) => (prev === 0 ? heroImagesList.length - 1 : prev - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 hover:bg-black/90 p-1.5 text-white border border-white/20 transition-all opacity-80 group-hover:opacity-100"
                    title="ภาพก่อนหน้า"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSlideIndex((prev) => (prev + 1) % heroImagesList.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 hover:bg-black/90 p-1.5 text-white border border-white/20 transition-all opacity-80 group-hover:opacity-100"
                    title="ภาพถัดไป"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}

              {/* Bottom Indicators in Preview */}
              <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-1.5 z-10">
                {heroImagesList.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setActiveSlideIndex(dotIdx)}
                    className={`h-1.5 rounded-full transition-all ${
                      activeSlideIndex === dotIdx ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/50 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnails Strip with Delete and Select */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-theme-text">
                <span>{t('admin.slideOrderDesc', 'ลำดับภาพสไลด์ (คลิกเลือกดู หรือลบ)')}</span>
                <span className="text-[10px] text-theme-text-muted">{t('admin.firstIsCover', 'ลำดับแรก = ภาพหน้าปก')}</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {heroImagesList.map((imgUrl, idx) => {
                  const isCurrent = activeSlideIndex === idx;
                  return (
                    <div
                      key={idx}
                      className={`group/thumb relative aspect-[16/9] rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        isCurrent
                          ? 'border-theme-primary ring-2 ring-theme-primary/30 shadow-md scale-[1.02]'
                          : 'border-theme-border opacity-70 hover:opacity-100'
                      }`}
                      onClick={() => setActiveSlideIndex(idx)}
                    >
                      <img src={imgUrl} alt={`Thumb ${idx + 1}`} className="h-full w-full object-cover" />
                      <span className="absolute bottom-0.5 left-1 text-[9px] font-bold text-white bg-black/70 px-1 rounded">
                        #{idx + 1}
                      </span>
                      {heroImagesList.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(idx);
                          }}
                          className="absolute top-0.5 right-0.5 rounded-full bg-red-600/90 text-white p-1 opacity-0 group-hover/thumb:opacity-100 transition-opacity hover:bg-red-700"
                          title="ลบภาพนี้ออกจากสไลด์"
                        >
                          <Trash2 className="h-2.5 w-2.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add Image Controls: File Upload or Direct URL */}
            {heroImagesList.length < 5 ? (
              <div className="rounded-2xl border border-theme-border bg-theme-surface-elevated p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-theme-text flex items-center gap-1.5 text-[11px]">
                    <Plus className="h-3.5 w-3.5 text-theme-primary" />
                    <span>{t('admin.addNewSlideImage', 'เพิ่มรูปภาพสไลด์ใหม่')} ({heroImagesList.length}/5)</span>
                  </span>
                </div>

                <div className="flex gap-2">
                  <label className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-theme-primary/15 border border-theme-primary/40 px-3 py-2 text-xs font-bold text-theme-primary hover:bg-theme-primary hover:text-black cursor-pointer transition-all shadow-sm">
                    <UploadCloud className="h-4 w-4" />
                    <span>{t('admin.uploadImage', 'อัปโหลดรูปภาพ')}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const defaults = [
                        '/images/hero-fullwidth.jpg',
                        '/images/hero-cans-banner.jpg',
                        '/images/factory-building.jpg',
                      ];
                      setHeroImagesList(defaults);
                      setActiveSlideIndex(0);
                      setWorkflowStatus('DRAFT');
                      showNotification('รีเซ็ตเป็น 3 ภาพโรงงานเริ่มต้นแล้ว');
                    }}
                    className="rounded-xl border border-theme-border bg-theme-surface px-2.5 py-2 text-[11px] font-semibold text-theme-text-muted hover:text-theme-primary transition-colors"
                    title="ใช้ชุดภาพเริ่มต้นของระบบ"
                  >
                    {t('admin.resetDefaults', 'รีเซ็ตเริ่มต้น')}
                  </button>
                </div>

                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={newImageUrlInput}
                    onChange={(e) => setNewImageUrlInput(e.target.value)}
                    placeholder={t('admin.orPasteImageUrl', 'หรือวาง URL ภาพ (เช่น /images/... หรือ https://...)')}
                    className="flex-1 rounded-xl border border-theme-border bg-theme-surface px-2.5 py-1.5 text-[11px] text-theme-text font-mono placeholder:text-theme-text-muted"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    disabled={!newImageUrlInput.trim()}
                    className="rounded-xl bg-theme-primary px-3 py-1.5 text-xs font-bold text-black disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all"
                  >
                    {t('common.add', 'เพิ่ม')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-center text-[11px] font-semibold text-amber-500">
                {t('admin.maxImagesReached', 'ครบจำนวนสูงสุด 5 ภาพแล้ว (ลบภาพที่ไม่ต้องการก่อนหากต้องการเพิ่มใหม่)')}
              </div>
            )}

            {/* Slider Behavior Settings (Auto slide, Duration, Hover arrows, Dots) */}
            <div className="rounded-2xl border border-theme-border bg-theme-surface-elevated p-3.5 space-y-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-theme-text border-b border-theme-border/60 pb-2">
                <Sliders className="h-3.5 w-3.5 text-theme-primary" />
                <span>{t('admin.slideSettingsTitle', 'ตั้งค่าพฤติกรรมสไลด์ (Slide Settings)')}</span>
              </div>

              {/* Auto Slide Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-theme-text text-[11px]">{t('admin.autoSlide', 'เลื่อนสไลด์อัตโนมัติ (Auto-Slide)')}</div>
                  <div className="text-[10px] text-theme-text-muted">{t('admin.autoSlideDesc', 'เปลี่ยนภาพตามเวลา (จะหยุดชั่วคราวเมื่อชี้เมาส์)')}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setHeroAutoSlide(!heroAutoSlide);
                    setWorkflowStatus('DRAFT');
                  }}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    heroAutoSlide ? 'bg-theme-primary' : 'bg-zinc-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      heroAutoSlide ? 'translate-x-4 bg-black' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Interval Selection (if auto-slide is enabled) */}
              {heroAutoSlide && (
                <div className="space-y-1.5 pt-1 border-t border-theme-border/40">
                  <label className="font-bold text-theme-text-muted block text-[10px]">
                    {t('admin.slideSpeed', 'ความเร็วในการเปลี่ยนสไลด์ (วินาที)')}
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[3, 5, 7, 10].map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => {
                          setHeroSlideInterval(sec);
                          setWorkflowStatus('DRAFT');
                        }}
                        className={`rounded-xl py-1.5 text-xs font-bold transition-all border ${
                          heroSlideInterval === sec
                            ? 'bg-theme-primary text-black border-theme-primary font-black shadow-sm'
                            : 'border-theme-border bg-theme-surface text-theme-text hover:border-theme-primary/50'
                        }`}
                      >
                        {sec} {t('admin.secondsUnit', 'วินาที')}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Hover Arrows Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-theme-border/40">
                <div>
                  <div className="font-bold text-theme-text text-[11px]">{t('admin.hoverNavigation', 'ปุ่มลูกศรเมื่อชี้เมาส์ (Hover Navigation)')}</div>
                  <div className="text-[10px] text-theme-text-muted">{t('admin.hoverNavigationDesc', 'แสดงลูกศร ซ้าย/ขวา เพื่อให้ผู้ใช้กดเลื่อนเอง')}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setHeroShowArrows(!heroShowArrows);
                    setWorkflowStatus('DRAFT');
                  }}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    heroShowArrows ? 'bg-theme-primary' : 'bg-zinc-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      heroShowArrows ? 'translate-x-4 bg-black' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Dots Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-theme-border/40">
                <div>
                  <div className="font-bold text-theme-text text-[11px]">{t('admin.slideDots', 'จุดบอกตำแหน่งสไลด์ (Slide Dots)')}</div>
                  <div className="text-[10px] text-theme-text-muted">{t('admin.slideDotsDesc', 'แสดงจุดนำทางด้านล่างของแบนเนอร์')}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setHeroShowDots(!heroShowDots);
                    setWorkflowStatus('DRAFT');
                  }}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    heroShowDots ? 'bg-theme-primary' : 'bg-zinc-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      heroShowDots ? 'translate-x-4 bg-black' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 🌑 ความฟุ้ง/เงาดำหลังตัวหนังสือ (Text Background Overlay Opacity) */}
              <div className="space-y-2 pt-2.5 border-t border-theme-border/40">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-theme-text text-[11px] flex items-center gap-1.5">
                      <span>{t('admin.textOverlayOpacity', 'ความฟุ้งเงาดำหลังตัวหนังสือ')}</span>
                      <span className="rounded-md bg-theme-primary/20 text-theme-primary px-1.5 py-0.5 text-[10px] font-black">
                        {heroTextOverlayOpacity}%
                      </span>
                    </div>
                    <div className="text-[10px] text-theme-text-muted">
                      {heroTextOverlayOpacity === 0
                        ? t('admin.disableOverlay', 'ปิดเงาดำ (ภาพพื้นหลังชัดเจน 100%)')
                        : `${t('admin.textOverlayDesc', 'ลด/เพิ่มเงาดำเพื่อความคมชัดของข้อความ')} (${heroTextOverlayOpacity}%)`}
                    </div>
                  </div>
                </div>

                {/* 0%, 10%, 20%, 30%, 40%, 50%, 60%, 70% Buttons */}
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 10, 20, 30, 40, 50, 60, 70].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => {
                        setHeroTextOverlayOpacity(pct);
                        setWorkflowStatus('DRAFT');
                      }}
                      className={`rounded-xl py-1.5 text-xs font-bold transition-all border ${
                        heroTextOverlayOpacity === pct
                          ? 'bg-theme-primary text-black border-theme-primary font-black shadow-sm'
                          : 'border-theme-border bg-theme-surface text-theme-text hover:border-theme-primary/50'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 3: แปลภาษา 4 ภาษา (EN, JP, CN, MM) */}
        <div className="lg:col-span-4 rounded-3xl border border-theme-border bg-theme-surface p-6 shadow-2xl space-y-4">
          <h2 className="font-display text-sm font-bold text-theme-text border-b border-theme-border pb-3 flex items-center justify-between">
            <span>{t('admin.multiLangTitle', 'แปลภาษา (Multi-Language)')}</span>
            <span className="text-[10px] text-theme-text-muted font-mono">4 Locales</span>
          </h2>

          {/* 4 Language Tabs */}
          <div className="grid grid-cols-4 gap-1.5 rounded-2xl bg-theme-surface-elevated p-1 border border-theme-border">
            {[
              { code: 'en', label: 'US EN' },
              { code: 'jp', label: 'JP JP' },
              { code: 'cn', label: 'CN CN' },
              { code: 'mm', label: 'MM MM' },
            ].map((tab) => {
              const isActive = activeTranslationLang === tab.code;
              return (
                <button
                  key={tab.code}
                  type="button"
                  onClick={() => setActiveTranslationLang(tab.code as any)}
                  className={`rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-400 text-black font-black shadow-md border border-cyan-300'
                      : 'text-theme-text-muted hover:text-theme-text hover:bg-theme-surface'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-theme-text block mb-1">
                {t('admin.fieldTitle', 'Title')} ({activeTranslationLang.toUpperCase()})
              </label>
              <input
                type="text"
                value={translations[activeTranslationLang].title}
                onChange={(e) => {
                  const val = e.target.value;
                  setTranslations((prev) => ({
                    ...prev,
                    [activeTranslationLang]: { ...prev[activeTranslationLang], title: val },
                  }));
                  setWorkflowStatus('DRAFT');
                }}
                className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-xs text-theme-text focus:border-theme-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-theme-text block mb-1">
                {t('admin.fieldHighlight', 'Highlight')} ({activeTranslationLang.toUpperCase()})
              </label>
              <input
                type="text"
                value={translations[activeTranslationLang].subtitle}
                onChange={(e) => {
                  const val = e.target.value;
                  setTranslations((prev) => ({
                    ...prev,
                    [activeTranslationLang]: { ...prev[activeTranslationLang], subtitle: val },
                  }));
                  setWorkflowStatus('DRAFT');
                }}
                className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-xs text-theme-text focus:border-theme-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-theme-text block mb-1">
                {t('admin.fieldDescription', 'Description')} ({activeTranslationLang.toUpperCase()})
              </label>
              <textarea
                rows={5}
                value={translations[activeTranslationLang].desc}
                onChange={(e) => {
                  const val = e.target.value;
                  setTranslations((prev) => ({
                    ...prev,
                    [activeTranslationLang]: { ...prev[activeTranslationLang], desc: val },
                  }));
                  setWorkflowStatus('DRAFT');
                }}
                className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-xs text-theme-text focus:border-theme-primary focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 4 FEATURE BADGES / คุณภาพมาตรฐานสากล (จุดเด่น 4 ด้าน) */}
      <div className="rounded-3xl border border-theme-border bg-theme-surface p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-theme-border pb-4">
          <div>
            <h2 className="font-display text-base font-bold text-theme-text flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-theme-primary" />
              <span>{t('admin.featureBadgesTitle', 'คุณภาพมาตรฐานสากล & จุดเด่น 4 ด้าน (Feature Badges - 5 Languages)')}</span>
            </h2>
            <p className="text-xs text-theme-text-muted mt-1">
              {t('admin.featureBadgesDesc', 'แก้ไขหัวข้อ คำบรรยาย และคำแปลทั้ง 5 ภาษา (TH, EN, JP, CN, MM) ของแถบจุดเด่นใต้ภาพหน้าแรก')}
            </p>
          </div>
          <span className="rounded-full bg-theme-primary/20 text-theme-primary px-3 py-1 text-xs font-bold w-fit">
            4 Badges • 5 Languages
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featureBadges.map((badge, idx) => (
            <div
              key={badge.id || idx}
              className="rounded-2xl border border-theme-border bg-theme-surface-elevated p-5 space-y-4 shadow-md"
            >
              <div className="flex items-center justify-between border-b border-theme-border/60 pb-3">
                <span className="font-bold text-xs text-theme-primary flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-theme-primary/20 text-[10px] font-black">
                    {idx + 1}
                  </span>
                  <span>{badge.title}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...featureBadges];
                    updated[idx] = { ...updated[idx], enabled: updated[idx].enabled === false ? true : false };
                    setFeatureBadges(updated);
                    setWorkflowStatus('DRAFT');
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                    badge.enabled !== false
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-slate-500/20 text-slate-400 border-slate-500/40'
                  }`}
                >
                  {badge.enabled !== false ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  <span>{badge.enabled !== false ? t('admin.showTab', 'เปิดแสดง') : t('admin.hideTab', 'ปิด')}</span>
                </button>
              </div>

              {/* Thai Primary Fields */}
              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="font-bold text-theme-text block mb-1">{t('admin.mainTitleTh', 'หัวข้อหลัก (ภาษาไทย)')}</label>
                  <input
                    type="text"
                    value={badge.title}
                    onChange={(e) => {
                      const updated = [...featureBadges];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setFeatureBadges(updated);
                      setWorkflowStatus('DRAFT');
                    }}
                    className="w-full rounded-xl border border-theme-border bg-theme-surface px-3 py-2 text-theme-text font-semibold focus:border-theme-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-theme-text block mb-1">{t('admin.subtitleTh', 'คำบรรยายย่อย (ภาษาไทย)')}</label>
                  <input
                    type="text"
                    value={badge.subtitle}
                    onChange={(e) => {
                      const updated = [...featureBadges];
                      updated[idx] = { ...updated[idx], subtitle: e.target.value };
                      setFeatureBadges(updated);
                      setWorkflowStatus('DRAFT');
                    }}
                    className="w-full rounded-xl border border-theme-border bg-theme-surface px-3 py-2 text-theme-text focus:border-theme-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* 4 Translation Tabs (EN, JP, CN, MM) */}
              <MultiLangSectionEditor
                compact
                title={`${t('admin.featureHighlight', 'แปลภาษา จุดเด่น')} #${idx + 1}`}
                fields={[
                  { key: 'title', label: t('admin.mainTitleTh', 'หัวข้อหลัก (Title)') },
                  { key: 'subtitle', label: t('admin.subtitleTh', 'คำบรรยาย (Subtitle)') },
                ]}
                value={badge.translations || {
                  en: { title: '', subtitle: '' },
                  jp: { title: '', subtitle: '' },
                  cn: { title: '', subtitle: '' },
                  mm: { title: '', subtitle: '' },
                }}
                onChange={(updatedTrans) => {
                  const updated = [...featureBadges];
                  updated[idx] = { ...updated[idx], translations: updatedTrans as any };
                  setFeatureBadges(updated);
                  setWorkflowStatus('DRAFT');
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 🌟 MODAL 1: LIVE INTERACTIVE PREVIEW BEFORE PUBLISH */}
      <Modal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        title="🔍 ดูตัวอย่างหน้าจริงก่อนเผยแพร่ (Live Interactive Preview)"
        maxWidth="2xl"
      >
        <div className="space-y-4 font-sans text-xs">
          {/* Top Device Bar & Publish CTA */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-theme-surface-elevated border border-theme-border">
            {/* Device Switcher */}
            <div className="flex items-center gap-1 bg-theme-surface p-1 rounded-xl border border-theme-border">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  previewDevice === 'desktop'
                    ? 'bg-theme-primary text-black font-black shadow-sm'
                    : 'text-theme-text-muted hover:text-theme-text'
                }`}
              >
                <Laptop className="h-3.5 w-3.5" />
                <span>Desktop (1440px)</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('tablet')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  previewDevice === 'tablet'
                    ? 'bg-theme-primary text-black font-black shadow-sm'
                    : 'text-theme-text-muted hover:text-theme-text'
                }`}
              >
                <Tablet className="h-3.5 w-3.5" />
                <span>Tablet (768px)</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  previewDevice === 'mobile'
                    ? 'bg-theme-primary text-black font-black shadow-sm'
                    : 'text-theme-text-muted hover:text-theme-text'
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span>Mobile (375px)</span>
              </button>
            </div>

            {/* Quick Action in Preview */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePublish}
                className="btn-primary-action text-xs font-black px-5 py-2 shadow-lg"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>ยืนยันและเผยแพร่ (Publish Now)</span>
              </button>
            </div>
          </div>

          {/* Actual Simulated Hero Section Screen */}
          <div className="overflow-x-auto p-2 rounded-2xl bg-black/70 border border-theme-border flex justify-center">
            <div
              className={`transition-all duration-300 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl relative min-h-[420px] flex items-center ${
                previewDevice === 'desktop'
                  ? 'w-full max-w-4xl'
                  : previewDevice === 'tablet'
                  ? 'w-[700px]'
                  : 'w-[360px]'
              }`}
            >
              {/* Background image & configurable overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                style={{ backgroundImage: `url(${heroImagesList[activeSlideIndex] || heroImagesList[0] || '/images/hero-fullwidth.jpg'})` }}
              >
                {heroTextOverlayOpacity > 0 && (
                  <>
                    <div
                      className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(to right, rgba(0,0,0,${Math.min(0.95, (heroTextOverlayOpacity / 100) * 1.5).toFixed(2)}) 0%, rgba(0,0,0,${((heroTextOverlayOpacity / 100) * 0.8).toFixed(2)}) 45%, rgba(0,0,0,${((heroTextOverlayOpacity / 100) * 0.2).toFixed(2)}) 75%, transparent 100%)`,
                      }}
                    />
                    <div
                      className="absolute inset-y-0 left-0 w-full max-w-2xl z-10 pointer-events-none transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(ellipse at 25% 45%, rgba(0,0,0,${(heroTextOverlayOpacity / 100).toFixed(2)}) 0%, transparent 75%)`,
                      }}
                    />
                  </>
                )}
              </div>

              {/* Foreground content */}
              <div className="relative z-20 p-6 sm:p-10 space-y-4 max-w-lg text-white">
                <div className="space-y-1">
                  <h1 className="font-display text-2xl sm:text-4xl font-black text-white leading-tight drop-shadow-md">
                    {thaiTitle}
                  </h1>
                  <span className="font-display text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 block drop-shadow">
                    {thaiSubtitle}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed drop-shadow line-clamp-4">
                  {thaiDesc}
                </p>

                {(showPrimaryBtn || showSecondaryBtn) && (
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {showPrimaryBtn && (
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#AA7C11] px-5 py-2 text-xs font-bold text-black shadow-lg shadow-amber-500/30"
                      >
                        <span>{ctaText}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-black" />
                      </button>
                    )}
                    {showSecondaryBtn && (
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-black/40 backdrop-blur-md px-4 py-2 text-xs font-bold text-white"
                      >
                        <span>{secondaryCtaText}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* 🌟 MODAL 2: REVISION HISTORY & ONE-CLICK RESTORE */}
      <Modal
        isOpen={revisionModalOpen}
        onClose={() => setRevisionModalOpen(false)}
        title="🕒 ประวัติการแก้ไขย้อนหลัง (Revision History & Restore)"
        maxWidth="2xl"
      >
        <div className="space-y-4 font-sans text-xs">
          <div className="p-3 rounded-2xl bg-theme-surface-elevated border border-theme-border text-theme-text-muted">
            ระบบจัดเก็บประวัติทุกครั้งที่มีการกดบันทึกหรือเผยแพร่ หากมีการแก้ไขผิดพลาด สามารถกด **"Restore"** เพื่อกู้คืนข้อมูลกลับมาได้ทันที
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {revisions.map((rev, idx) => {
              const isCurrent = idx === 0;
              return (
                <div
                  key={rev.id}
                  className={`rounded-2xl border p-4 space-y-3 transition-all ${
                    isCurrent
                      ? 'border-theme-primary bg-theme-primary/5 shadow-md'
                      : 'border-theme-border bg-theme-surface-elevated/60 hover:bg-theme-surface-elevated'
                  }`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-black text-sm text-theme-text">
                        Revision {rev.revisionNumber}
                      </span>
                      {isCurrent && (
                        <span className="rounded-full bg-theme-primary text-black font-black text-[10px] px-2.5 py-0.5 shadow-sm">
                          Current (เวอร์ชันปัจจุบัน)
                        </span>
                      )}
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                          rev.status === 'PUBLISHED'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                        }`}
                      >
                        {rev.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-theme-text-dim font-mono flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(rev.createdAt).toLocaleString('th-TH')}
                      </span>

                      {!isCurrent && (
                        <button
                          type="button"
                          onClick={() => handleRestoreRevision(rev)}
                          className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-black text-black shadow-md hover:bg-amber-400 transition-all"
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span>Restore Revision {rev.revisionNumber}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Summary of content in this revision */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] rounded-xl bg-black/40 p-3 border border-white/5">
                    <div>
                      <span className="text-theme-text-dim block">Title:</span>
                      <span className="font-bold text-theme-text">{rev.title}</span>
                    </div>
                    <div>
                      <span className="text-theme-text-dim block">Highlight:</span>
                      <span className="text-amber-400 font-bold">{rev.highlight}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-theme-text-dim block">บันทึกช่วยจำ / ผู้แก้ไข:</span>
                      <span className="text-slate-300">{rev.note} (โดย: {rev.author})</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
};
