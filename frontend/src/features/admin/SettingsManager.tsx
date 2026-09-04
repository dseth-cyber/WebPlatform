import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemeMode } from '../../types/theme';
import { useSiteContent, updateBrowserFavicon, BranchLocationSetting, CategoryCardSetting } from '../../hooks/useSiteContent';
import {
  Settings,
  Building2,
  Save,
  Palette,
  Check,
  Moon,
  Sun,
  Sparkles,
  Eye,
  EyeOff,
  Image as ImageIcon,
  RotateCcw,
  Sliders,
  UploadCloud,
  Globe,
  Layout,
  Layers,
  Navigation,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Database,
  Pin,
  Package,
  MapPin,
  Factory,
  Warehouse,
  Phone,
  Mail,
  Clock,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
} from 'lucide-react';
import { compressImageFile } from '../../utils/imageCompressor';
import { Modal } from '../../components/ui/Modal';

export const SettingsManager: React.FC = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings, resetToDefault } = useSiteContent();

  const [formState, setFormState] = useState(settings);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with global settings when changed
  React.useEffect(() => {
    setFormState(settings);
  }, [settings]);

  // Real-time live synchronization of browser tab favicon & title
  React.useEffect(() => {
    updateBrowserFavicon(
      formState.logoImage,
      formState.logoText,
      formState.companyNameEn,
      formState.companyNameTh
    );
  }, [formState.logoImage, formState.logoText, formState.companyNameEn, formState.companyNameTh]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        showToast('กำลังประมวลผลและปรับขนาดโลโก้...');
        const optimizedUrl = await compressImageFile(file, 800, 800, 0.9);
        setFormState((prev) => ({ ...prev, logoImage: optimizedUrl }));
        await updateSettings({ logoImage: optimizedUrl });
        showToast('อัปโหลดและเปลี่ยนโลโก้ทั้ง 3 จุดเรียบร้อยแล้ว');
      } catch (err) {
        showToast('เกิดข้อผิดพลาดในการโหลดรูปภาพ');
      }
    }
  };

  const handleResetLogo = () => {
    setFormState((prev) => ({ ...prev, logoImage: '' }));
    updateSettings({ logoImage: '' });
    showToast('เปลี่ยนกลับเป็นโลโก้ตราสัญลักษณ์ LC Diamond เริ่มต้นแล้ว');
  };

  const handleToggleCMSButton = () => {
    const nextValue = !settings.showCMSButton;
    updateSettings({ showCMSButton: nextValue });
    setFormState((prev) => ({ ...prev, showCMSButton: nextValue }));
    showToast(nextValue ? 'เปิดแสดงปุ่ม CMS บนหน้าเว็บแล้ว' : 'ซ่อนปุ่ม CMS บนหน้าเว็บเรียบร้อยแล้ว');
  };

  const handleToggleThemeSwitcher = () => {
    const nextValue = !settings.showThemeSwitcher;
    updateSettings({ showThemeSwitcher: nextValue });
    setFormState((prev) => ({ ...prev, showThemeSwitcher: nextValue }));
    showToast(nextValue ? 'เปิดแสดงปุ่มเปลี่ยนธีมบนหน้าเว็บแล้ว' : 'ซ่อนปุ่มเปลี่ยนธีมบนหน้าเว็บเรียบร้อยแล้ว');
  };

  const handleToggleHeroPrimaryBtn = async () => {
    const nextValue = settings.showHeroPrimaryBtn === false ? true : false;
    await updateSettings({ showHeroPrimaryBtn: nextValue });
    setFormState((prev) => ({ ...prev, showHeroPrimaryBtn: nextValue }));
    showToast(nextValue ? 'เปิดแสดงปุ่ม "อ่านประวัติองค์กร" บนหน้าแรกแล้ว' : 'ซ่อนปุ่ม "อ่านประวัติองค์กร" จากหน้าแรกเรียบร้อยแล้ว');
  };

  const handleToggleHeroSecondaryBtn = async () => {
    const nextValue = settings.showHeroSecondaryBtn === false ? true : false;
    await updateSettings({ showHeroSecondaryBtn: nextValue });
    setFormState((prev) => ({ ...prev, showHeroSecondaryBtn: nextValue }));
    showToast(nextValue ? 'เปิดแสดงปุ่ม "ชมผลิตภัณฑ์ของเรา" บนหน้าแรกแล้ว' : 'ซ่อนปุ่ม "ชมผลิตภัณฑ์ของเรา" จากหน้าแรกเรียบร้อยแล้ว');
  };

  const handleSetDashboardDataSource = async (mode: 'mock' | 'real') => {
    setFormState((prev) => ({ ...prev, dashboardDataSource: mode }));
    await updateSettings({ dashboardDataSource: mode });
    showToast(
      mode === 'real'
        ? 'สลับเป็นโหมด "ข้อมูลจริงของระบบ (Real System Data)" เรียบร้อยแล้ว'
        : 'สลับเป็นโหมด "ข้อมูลจำลอง (Mockup Demo Data)" เรียบร้อยแล้ว'
    );
  };

  const handleToggleNavTab = async (tabId: string) => {
    const currentTabs = settings.navTabs && settings.navTabs.length > 0 ? settings.navTabs : [
      { id: 'tab-home', key: 'home', labelTh: 'หน้าแรก', labelEn: 'Home', path: '/', enabled: true },
      { id: 'tab-about', key: 'about', labelTh: 'เกี่ยวกับเรา', labelEn: 'About Us', path: '/about', enabled: true },
      { id: 'tab-products', key: 'products', labelTh: 'สินค้า', labelEn: 'Products', path: '/products', enabled: true },
      { id: 'tab-services', key: 'services', labelTh: 'บริการ', labelEn: 'Services', path: '/services', enabled: true },
      { id: 'tab-technology', key: 'technology', labelTh: 'เทคโนโลยี', labelEn: 'Technology', path: '/technology', enabled: true },
      { id: 'tab-sustainability', key: 'sustainability', labelTh: 'ความยั่งยืน', labelEn: 'Sustainability', path: '/sustainability', enabled: true },
      { id: 'tab-careers', key: 'careers', labelTh: 'สมัครงาน', labelEn: 'Careers', path: '/careers', enabled: true },
      { id: 'tab-news', key: 'news', labelTh: 'ข่าวสาร', labelEn: 'News & Press', path: '/news', enabled: true },
      { id: 'tab-contact', key: 'contact', labelTh: 'ติดต่อเรา', labelEn: 'Contact Us', path: '/contact', enabled: true },
    ];

    const updated = currentTabs.map((t) => (t.id === tabId ? { ...t, enabled: !t.enabled } : t));
    await updateSettings({ navTabs: updated });
    setFormState((prev) => ({ ...prev, navTabs: updated }));
    showToast('อัปเดตการแสดงผล Tab เมนูบนเว็บไซต์เรียบร้อยแล้ว');
  };

  const [draggedTabIndex, setDraggedTabIndex] = useState<number | null>(null);

  const handleMoveTab = async (index: number, direction: 'up' | 'down') => {
    const currentTabs = [...(settings.navTabs && settings.navTabs.length > 0 ? settings.navTabs : [
      { id: 'tab-home', key: 'home', labelTh: 'หน้าแรก', labelEn: 'Home', path: '/', enabled: true },
      { id: 'tab-about', key: 'about', labelTh: 'เกี่ยวกับเรา', labelEn: 'About Us', path: '/about', enabled: true },
      { id: 'tab-products', key: 'products', labelTh: 'สินค้า', labelEn: 'Products', path: '/products', enabled: true },
      { id: 'tab-services', key: 'services', labelTh: 'บริการ', labelEn: 'Services', path: '/services', enabled: true },
      { id: 'tab-technology', key: 'technology', labelTh: 'เทคโนโลยี', labelEn: 'Technology', path: '/technology', enabled: true },
      { id: 'tab-sustainability', key: 'sustainability', labelTh: 'ความยั่งยืน', labelEn: 'Sustainability', path: '/sustainability', enabled: true },
      { id: 'tab-news', key: 'news', labelTh: 'ข่าวสาร', labelEn: 'News & Press', path: '/news', enabled: true },
      { id: 'tab-contact', key: 'contact', labelTh: 'ติดต่อเรา', labelEn: 'Contact Us', path: '/contact', enabled: true },
      { id: 'tab-careers', key: 'careers', labelTh: 'สมัครงาน', labelEn: 'Careers', path: '/careers', enabled: true },
    ])];

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentTabs.length) return;

    const temp = currentTabs[index];
    currentTabs[index] = currentTabs[targetIndex];
    currentTabs[targetIndex] = temp;

    await updateSettings({ navTabs: currentTabs });
    setFormState((prev) => ({ ...prev, navTabs: currentTabs }));
    showToast(`จัดเรียงลำดับ "${temp.labelTh}" สำเร็จ`);
  };

  const handleDragStart = (index: number) => {
    setDraggedTabIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (dropIndex: number) => {
    if (draggedTabIndex === null || draggedTabIndex === dropIndex) return;
    const currentTabs = [...(settings.navTabs && settings.navTabs.length > 0 ? settings.navTabs : [
      { id: 'tab-home', key: 'home', labelTh: 'หน้าแรก', labelEn: 'Home', path: '/', enabled: true },
      { id: 'tab-about', key: 'about', labelTh: 'เกี่ยวกับเรา', labelEn: 'About Us', path: '/about', enabled: true },
      { id: 'tab-products', key: 'products', labelTh: 'สินค้า', labelEn: 'Products', path: '/products', enabled: true },
      { id: 'tab-services', key: 'services', labelTh: 'บริการ', labelEn: 'Services', path: '/services', enabled: true },
      { id: 'tab-technology', key: 'technology', labelTh: 'เทคโนโลยี', labelEn: 'Technology', path: '/technology', enabled: true },
      { id: 'tab-sustainability', key: 'sustainability', labelTh: 'ความยั่งยืน', labelEn: 'Sustainability', path: '/sustainability', enabled: true },
      { id: 'tab-news', key: 'news', labelTh: 'ข่าวสาร', labelEn: 'News & Press', path: '/news', enabled: true },
      { id: 'tab-contact', key: 'contact', labelTh: 'ติดต่อเรา', labelEn: 'Contact Us', path: '/contact', enabled: true },
      { id: 'tab-careers', key: 'careers', labelTh: 'สมัครงาน', labelEn: 'Careers', path: '/careers', enabled: true },
    ])];

    const draggedItem = currentTabs.splice(draggedTabIndex, 1)[0];
    currentTabs.splice(dropIndex, 0, draggedItem);

    setDraggedTabIndex(null);
    await updateSettings({ navTabs: currentTabs });
    setFormState((prev) => ({ ...prev, navTabs: currentTabs }));
    showToast(`สลับตำแหน่ง "${draggedItem.labelTh}" สำเร็จ`);
  };

  const handleToggleCategoryPin = async (index: number) => {
    const categories = [...(settings.categoryCards || [])];
    if (!categories[index]) return;
    categories[index] = { ...categories[index], isPinned: !categories[index].isPinned };
    await updateSettings({ categoryCards: categories });
    setFormState((prev) => ({ ...prev, categoryCards: categories }));
    showToast(categories[index].isPinned ? `📌 ปักหมุด "${categories[index].titleTh}" บนหน้าแรกแล้ว` : `ยกเลิกการปักหมุด "${categories[index].titleTh}" แล้ว`);
  };

  const handleToggleCategoryEnabled = async (index: number) => {
    const categories = [...(settings.categoryCards || [])];
    if (!categories[index]) return;
    categories[index] = { ...categories[index], enabled: categories[index].enabled === false ? true : false };
    await updateSettings({ categoryCards: categories });
    setFormState((prev) => ({ ...prev, categoryCards: categories }));
    showToast(`เปลี่ยนสถานะการแสดงผล "${categories[index].titleTh}" เรียบร้อยแล้ว`);
  };

  // Category Edit / Add Modal State
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCatIdx, setEditingCatIdx] = useState<number | null>(null);
  const [catFormId, setCatFormId] = useState('');
  const [catFormTitleTh, setCatFormTitleTh] = useState('');
  const [catFormTitleEn, setCatFormTitleEn] = useState('');
  const [catFormImage, setCatFormImage] = useState('');
  const [catFormPath, setCatFormPath] = useState('');
  const [catFormPinned, setCatFormPinned] = useState(false);
  const [catFormEnabled, setCatFormEnabled] = useState(true);

  const handleOpenEditCategory = (idx: number) => {
    const cat = settings.categoryCards?.[idx];
    if (!cat) return;
    setEditingCatIdx(idx);
    setCatFormId(cat.id);
    setCatFormTitleTh(cat.titleTh);
    setCatFormTitleEn(cat.titleEn);
    setCatFormImage(cat.image);
    setCatFormPath(cat.path);
    setCatFormPinned(cat.isPinned || false);
    setCatFormEnabled(cat.enabled !== false);
    setCategoryModalOpen(true);
  };

  const handleOpenAddCategory = () => {
    setEditingCatIdx(null);
    const newId = 'cat-' + Date.now();
    setCatFormId(newId);
    setCatFormTitleTh('');
    setCatFormTitleEn('');
    setCatFormImage('/images/cat-round-cans.jpg');
    setCatFormPath('/products?category=' + newId);
    setCatFormPinned(false);
    setCatFormEnabled(true);
    setCategoryModalOpen(true);
  };

  const handleCatImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        showToast('กำลังประมวลผลรูปภาพ...');
        const optimized = await compressImageFile(file, 800, 600, 0.85);
        setCatFormImage(optimized);
        showToast('อัปโหลดรูปภาพสำเร็จ!');
      } catch (err) {
        showToast('เกิดข้อผิดพลาดในการโหลดรูปภาพ');
      }
    }
  };

  const handleSaveCategory = async () => {
    if (!catFormTitleTh.trim()) {
      showToast('กรุณากรอกชื่อหมวดหมู่ภาษาไทย');
      return;
    }
    const currentList = [...(settings.categoryCards || [])];
    const catData: CategoryCardSetting = {
      id: catFormId || ('cat-' + Date.now()),
      titleTh: catFormTitleTh.trim(),
      titleEn: catFormTitleEn.trim(),
      image: catFormImage.trim() || '/images/cat-round-cans.jpg',
      path: catFormPath.trim() || `/products?category=${catFormId}`,
      isPinned: catFormPinned,
      enabled: catFormEnabled,
    };

    if (editingCatIdx !== null && currentList[editingCatIdx]) {
      currentList[editingCatIdx] = catData;
      showToast(`บันทึกการแก้ไขหมวดหมู่ "${catData.titleTh}" เรียบร้อยแล้ว`);
    } else {
      currentList.push(catData);
      showToast(`เพิ่มหมวดหมู่ใหม่ "${catData.titleTh}" เรียบร้อยแล้ว`);
    }

    await updateSettings({ categoryCards: currentList });
    setFormState((prev) => ({ ...prev, categoryCards: currentList }));
    setCategoryModalOpen(false);
  };

  const handleDeleteCategory = async (idx: number) => {
    const cat = settings.categoryCards?.[idx];
    if (!cat) return;
    if (confirm(`คุณต้องการลบหมวดหมู่ "${cat.titleTh}" หรือไม่?`)) {
      const currentList = [...(settings.categoryCards || [])];
      currentList.splice(idx, 1);
      await updateSettings({ categoryCards: currentList });
      setFormState((prev) => ({ ...prev, categoryCards: currentList }));
      showToast(`ลบหมวดหมู่ "${cat.titleTh}" เรียบร้อยแล้ว`);
    }
  };

  const handleSaveAll = () => {
    updateSettings(formState);
    showToast('บันทึกการตั้งค่าระบบเรียบร้อยแล้ว');
  };

  const handleReset = () => {
    if (confirm('คุณต้องการรีเซ็ตการตั้งค่าระบบกลับเป็นค่าเริ่มต้นหรือไม่?')) {
      resetToDefault();
      setFormState(settings);
      showToast('รีเซ็ตค่าเริ่มต้นสำเร็จ');
    }
  };

  const themes: {
    id: ThemeMode;
    name: string;
    subtitle: string;
    icon: React.ReactNode;
    bg: string;
  }[] = [
    {
      id: 'DARK',
      name: 'Industrial Dark Steel',
      subtitle: 'Brushed Charcoal & Deep Obsidian (ความคมเข้มสไตล์อุตสาหกรรมโลหะ)',
      icon: <Moon className="h-5 w-5 text-amber-500" />,
      bg: 'bg-[#04070C] border-slate-700/60',
    },
    {
      id: 'LIGHT',
      name: 'Corporate Clean Titanium',
      subtitle: 'Precision Silver & Crisp White (โทนสีสว่าง สะอาด เรียบหรูแบบสากล)',
      icon: <Sun className="h-5 w-5 text-sky-500" />,
      bg: 'bg-[#F8FAFC] border-slate-300 text-slate-900',
    },
    {
      id: 'MODERN',
      name: 'Industrial Cyber Technology',
      subtitle: 'High-Tech Titanium Slate & Electric Cyan (นีออนเมทัลลิกล้ำสมัย ไฮเทค)',
      icon: <Sparkles className="h-5 w-5 text-cyan-400" />,
      bg: 'bg-[#131E32] border-cyan-500/40',
    },
  ];

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
            <Settings className="h-6 w-6 text-theme-primary" />
            <span>{t('admin.settings')} (System & Logo Settings)</span>
          </h1>
          <p className="text-xs text-theme-text-muted mt-1">
            จัดการโลโก้เว็บไซต์ (แสดงครบ 3 จุด), ควบคุมปุ่มบนหน้าเว็บ, ระบบธีม, และข้อมูลแบรนด์องค์กร
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-xl border border-theme-border bg-theme-surface px-3.5 py-2 text-xs font-semibold text-theme-text-muted hover:text-theme-text hover:bg-theme-surface-elevated transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>รีเซ็ตค่าเริ่มต้น</span>
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            className="btn-primary-action text-xs font-black px-6 py-2.5 shadow-xl"
          >
            <Save className="h-4 w-4 text-black" />
            <span>บันทึกการตั้งค่าทั้งหมด</span>
          </button>
        </div>
      </div>

      {/* 🌟 1. WEBSITE LOGO & BROWSER FAVICON MANAGEMENT (3-POINT SYNC) */}
      <div className="rounded-3xl border border-theme-border bg-theme-surface p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-theme-border pb-3">
          <h3 className="font-display text-sm font-bold text-theme-text flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-theme-primary" />
            <span>จัดการโลโก้เว็บไซต์ (Website Logo & Favicon Sync across 3 Locations)</span>
          </h3>
          <span className="text-[11px] font-bold text-theme-primary bg-theme-primary/10 border border-theme-primary/30 px-2.5 py-0.5 rounded-full">
            ซิงค์อัตโนมัติ 3 จุด
          </span>
        </div>

        {/* 3-Point Real-time Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Point 1 Preview: Public Header */}
          <div className="rounded-2xl border border-theme-border bg-theme-surface-elevated p-4 space-y-2.5">
            <div className="flex items-center gap-1.5 text-theme-primary text-xs font-bold">
              <Globe className="h-3.5 w-3.5" />
              <span>จุดที่ 1: เมนูหน้าเว็บผู้เข้าชม</span>
            </div>
            <div className="h-16 rounded-xl bg-black/60 border border-white/10 p-2.5 flex items-center gap-3">
              {formState.logoImage ? (
                <img src={formState.logoImage} alt="Logo" className="h-9 w-auto max-w-[100px] object-contain rounded" />
              ) : (
                <div className="relative flex h-8 w-8 items-center justify-center">
                  <div className="absolute inset-0 rotate-45 rounded border border-theme-primary bg-black" />
                  <span className="relative z-10 font-black text-[11px] text-theme-primary">{formState.logoText || 'LC'}</span>
                </div>
              )}
              <div className="truncate">
                <span className="text-[11px] font-bold text-white block truncate">{formState.companyNameTh}</span>
                <span className="text-[9px] text-slate-400 block truncate font-mono">{formState.companyNameEn}</span>
              </div>
            </div>
          </div>

          {/* Point 2 Preview: Admin Panel */}
          <div className="rounded-2xl border border-theme-border bg-theme-surface-elevated p-4 space-y-2.5">
            <div className="flex items-center gap-1.5 text-theme-primary text-xs font-bold">
              <Layout className="h-3.5 w-3.5" />
              <span>จุดที่ 2: เมนู Admin Panel</span>
            </div>
            <div className="h-16 rounded-xl bg-black/60 border border-white/10 p-2.5 flex items-center gap-3">
              {formState.logoImage ? (
                <img src={formState.logoImage} alt="Logo" className="h-8 w-auto max-w-[80px] object-contain rounded" />
              ) : (
                <div className="relative flex h-8 w-8 items-center justify-center">
                  <div className="absolute inset-0 rotate-45 rounded border border-theme-primary bg-black" />
                  <span className="relative z-10 font-black text-[11px] text-theme-primary">{formState.logoText || 'LC'}</span>
                </div>
              )}
              <span className="text-xs font-bold text-white tracking-wider">ADMIN PANEL</span>
            </div>
          </div>

          {/* Point 3 Preview: Browser Tab */}
          <div className="rounded-2xl border border-theme-border bg-theme-surface-elevated p-4 space-y-2.5">
            <div className="flex items-center gap-1.5 text-theme-primary text-xs font-bold">
              <Layers className="h-3.5 w-3.5" />
              <span>จุดที่ 3: แท็บบราวเซอร์ (Favicon)</span>
            </div>
            <div className="h-16 rounded-xl bg-slate-900 border border-white/10 p-2.5 flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-slate-800 border border-theme-primary/40 flex items-center justify-center overflow-hidden p-0.5 flex-shrink-0">
                {formState.logoImage ? (
                  <img src={formState.logoImage} alt="Favicon" className="h-full w-full object-contain" />
                ) : (
                  <span className="text-[10px] font-black text-theme-primary">{formState.logoText || 'LC'}</span>
                )}
              </div>
              <span className="text-[11px] text-slate-300 font-mono truncate">
                {formState.companyNameTh || formState.companyNameEn
                  ? `${formState.companyNameTh}${formState.companyNameEn ? ` | ${formState.companyNameEn}` : ''}`
                  : 'CHIOTRON | บริษัท ไคโอทรอน เทคโนโลยี จำกัด'}
              </span>
            </div>
          </div>
        </div>

        {/* Logo Upload & Input Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 text-xs">
          <div className="space-y-3">
            <label className="font-bold text-theme-text block">อัปโหลดไฟล์รูปภาพโลโก้ (Image Logo)</label>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 rounded-xl bg-theme-primary/15 border border-theme-primary/40 px-4 py-2.5 text-xs font-bold text-theme-primary hover:bg-theme-primary hover:text-black cursor-pointer transition-all shadow-sm">
                <UploadCloud className="h-4 w-4" />
                <span>เลือกไฟล์รูปโลโก้จากเครื่อง (PNG/JPG/SVG)</span>
                <input type="file" accept="image/*" onChange={handleLogoFileUpload} className="hidden" />
              </label>

              {formState.logoImage && (
                <button
                  type="button"
                  onClick={handleResetLogo}
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/20"
                >
                  ลบรูปโลโก้
                </button>
              )}
            </div>
            <p className="text-[11px] text-theme-text-muted">
              แนะนำไฟล์พื้นหลังโปร่งใส (Transparent PNG) เพื่อความสวยงามในทุกธีม
            </p>
          </div>

          <div className="space-y-3">
            <label className="font-bold text-theme-text block">ตัวอักษรตราสัญลักษณ์ (Monogram Text)</label>
            <div className="flex gap-3">
              <input
                type="text"
                maxLength={4}
                value={formState.logoText}
                onChange={(e) => setFormState({ ...formState, logoText: e.target.value.toUpperCase() })}
                placeholder="LC"
                className="w-24 rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-center text-theme-text font-black font-mono uppercase text-sm"
              />
              <div className="flex-1 text-[11px] text-theme-text-muted flex items-center">
                ใช้แสดงผลเมื่อไม่ได้อัปโหลดรูปภาพ เช่น ตัวย่อบริษัท (2-4 ตัวอักษร)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PUBLIC WEB BUTTON CONTROLS */}
      <div className="rounded-3xl border border-theme-border bg-theme-surface p-6 sm:p-8 shadow-2xl space-y-4">
        <h3 className="font-display text-sm font-bold text-theme-text flex items-center gap-2 border-b border-theme-border pb-3">
          <Sliders className="h-4 w-4 text-theme-primary" />
          <span>การแสดงผลปุ่มบนหน้าเว็บสำหรับผู้เข้าชม (Public Web Button Controls)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
          {/* Switch 1: CMS Button */}
          <div className="flex flex-col justify-between p-5 rounded-2xl border border-theme-border bg-theme-surface-elevated space-y-4 shadow-sm">
            <div className="space-y-1.5">
              <div className="font-bold text-xs text-theme-text flex items-center justify-between">
                <span>ปุ่มเข้าสู่ระบบ CMS บนหน้าเว็บ</span>
                {settings.showCMSButton ? (
                  <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold">
                    🟢 กำลังแสดงผล
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30 px-2.5 py-0.5 text-[10px] font-bold">
                    ⚪ ซ่อนอยู่
                  </span>
                )}
              </div>
              <p className="text-[11px] text-theme-text-muted leading-relaxed">
                เปิด/ปิด การแสดงปุ่ม <code>🔒 CMS</code> บนแถบเมนูด้านบนของหน้าเว็บสำหรับผู้เข้าชม
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleCMSButton}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold transition-all shadow-sm ${
                settings.showCMSButton
                  ? 'bg-red-500/15 border border-red-500/40 text-red-400 hover:bg-red-500/25'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              {settings.showCMSButton ? (
                <>
                  <EyeOff className="h-4 w-4 text-red-400" />
                  <span>คลิกเพื่อซ่อนปุ่ม CMS</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  <span>คลิกเพื่อเปิดแสดงปุ่ม CMS</span>
                </>
              )}
            </button>
          </div>

          {/* Switch 2: Theme Switcher Button */}
          <div className="flex flex-col justify-between p-5 rounded-2xl border border-theme-border bg-theme-surface-elevated space-y-4 shadow-sm">
            <div className="space-y-1.5">
              <div className="font-bold text-xs text-theme-text flex items-center justify-between">
                <span>ปุ่มเปลี่ยนธีมบนหน้าเว็บ</span>
                {settings.showThemeSwitcher ? (
                  <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold">
                    🟢 กำลังแสดงผล
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30 px-2.5 py-0.5 text-[10px] font-bold">
                    ⚪ ซ่อนอยู่
                  </span>
                )}
              </div>
              <p className="text-[11px] text-theme-text-muted leading-relaxed">
                เปิด/ปิด การแสดงปุ่มเปลี่ยนธีม (Dark / Light / Modern) บนแถบเมนูหน้าเว็บสำหรับผู้เข้าชม
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleThemeSwitcher}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold transition-all shadow-sm ${
                settings.showThemeSwitcher
                  ? 'bg-red-500/15 border border-red-500/40 text-red-400 hover:bg-red-500/25'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              {settings.showThemeSwitcher ? (
                <>
                  <EyeOff className="h-4 w-4 text-red-400" />
                  <span>คลิกเพื่อซ่อนปุ่มเปลี่ยนธีม</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  <span>คลิกเพื่อเปิดแสดงปุ่มเปลี่ยนธีม</span>
                </>
              )}
            </button>
          </div>

          {/* Switch 3: Hero Primary Action Button (อ่านประวัติองค์กร) */}
          <div className="flex flex-col justify-between p-5 rounded-2xl border border-theme-border bg-theme-surface-elevated space-y-4 shadow-sm">
            <div className="space-y-1.5">
              <div className="font-bold text-xs text-theme-text flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
                  <span>ปุ่ม "{settings.heroButtonText || 'อ่านประวัติองค์กร'}" บนแบนเนอร์หน้าแรก</span>
                </span>
                {settings.showHeroPrimaryBtn !== false ? (
                  <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold">
                    🟢 กำลังแสดงผล
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30 px-2.5 py-0.5 text-[10px] font-bold">
                    ⚪ ซ่อนอยู่
                  </span>
                )}
              </div>
              <p className="text-[11px] text-theme-text-muted leading-relaxed">
                เปิด/ปิด การแสดงปุ่มสีทองหลัก <code>{settings.heroButtonText || 'อ่านประวัติองค์กร'} &rarr;</code> บนแบนเนอร์ส่วน Hero ของหน้าแรก
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleHeroPrimaryBtn}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold transition-all shadow-sm ${
                settings.showHeroPrimaryBtn !== false
                  ? 'bg-red-500/15 border border-red-500/40 text-red-400 hover:bg-red-500/25'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              {settings.showHeroPrimaryBtn !== false ? (
                <>
                  <EyeOff className="h-4 w-4 text-red-400" />
                  <span>คลิกเพื่อซ่อนปุ่มนี้</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  <span>คลิกเพื่อเปิดแสดงปุ่มนี้</span>
                </>
              )}
            </button>
          </div>

          {/* Switch 4: Hero Secondary Action Button (ชมผลิตภัณฑ์ของเรา) */}
          <div className="flex flex-col justify-between p-5 rounded-2xl border border-theme-border bg-theme-surface-elevated space-y-4 shadow-sm">
            <div className="space-y-1.5">
              <div className="font-bold text-xs text-theme-text flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-white/70 border border-white/40 shadow-sm" />
                  <span>ปุ่ม "{settings.heroSecondaryButtonText || 'ชมผลิตภัณฑ์ของเรา'}" บนแบนเนอร์หน้าแรก</span>
                </span>
                {settings.showHeroSecondaryBtn !== false ? (
                  <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold">
                    🟢 กำลังแสดงผล
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30 px-2.5 py-0.5 text-[10px] font-bold">
                    ⚪ ซ่อนอยู่
                  </span>
                )}
              </div>
              <p className="text-[11px] text-theme-text-muted leading-relaxed">
                เปิด/ปิด การแสดงปุ่มโครงร่างโปร่งใส <code>{settings.heroSecondaryButtonText || 'ชมผลิตภัณฑ์ของเรา'}</code> บนแบนเนอร์ส่วน Hero ของหน้าแรก
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleHeroSecondaryBtn}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold transition-all shadow-sm ${
                settings.showHeroSecondaryBtn !== false
                  ? 'bg-red-500/15 border border-red-500/40 text-red-400 hover:bg-red-500/25'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              {settings.showHeroSecondaryBtn !== false ? (
                <>
                  <EyeOff className="h-4 w-4 text-red-400" />
                  <span>คลิกเพื่อซ่อนปุ่มนี้</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  <span>คลิกเพื่อเปิดแสดงปุ่มนี้</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 🌟 2.5 DASHBOARD DATA SOURCE SELECTOR (MOCKUP VS REAL DATA) */}
      <div className="rounded-3xl border border-theme-border bg-theme-surface p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-theme-border pb-3 gap-2">
          <div>
            <h3 className="font-display text-sm font-bold text-theme-text flex items-center gap-2">
              <Database className="h-4 w-4 text-theme-primary" />
              <span>แหล่งข้อมูลของแผงควบคุมภาพรวม (Admin Dashboard Data Mode)</span>
            </h3>
            <p className="text-[11px] text-theme-text-muted mt-0.5">
              เลือกว่าจะให้หน้า <strong>แผงควบคุมภาพรวม (Dashboard)</strong> ดึงข้อมูลจริงจากระบบ หรือแสดงข้อมูลจำลองเพื่อการพรีเซนต์
            </p>
          </div>

          <span
            className={`text-[11px] font-bold px-3 py-1 rounded-full border self-start sm:self-auto ${
              formState.dashboardDataSource === 'real'
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
            }`}
          >
            {formState.dashboardDataSource === 'real'
              ? '🟢 กำลังใช้: ข้อมูลจริงของระบบ (Real System Data)'
              : '🟡 กำลังใช้: ข้อมูลจำลอง (Mockup Demo Data)'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
          {/* Option 1: Mockup Demo Data */}
          <div
            onClick={() => handleSetDashboardDataSource('mock')}
            className={`cursor-pointer rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 ${
              formState.dashboardDataSource !== 'real'
                ? 'border-amber-500/60 bg-amber-500/10 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40'
                : 'border-theme-border bg-theme-surface-elevated hover:border-theme-border/80'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-theme-text">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>ข้อมูลจำลอง / ตัวอย่างระบบ (Mockup Demo Data)</span>
                </div>
                {formState.dashboardDataSource !== 'real' && (
                  <span className="rounded-full bg-amber-500 text-black px-2 py-0.5 text-[10px] font-black">
                    เปิดใช้งานอยู่
                  </span>
                )}
              </div>
              <p className="text-[11px] text-theme-text-muted leading-relaxed">
                แสดงผลสถิติตัวอย่างระดับองค์กร (Web Traffic, Pageviews 36k+, ผู้เข้าชมต่างประเทศ, สัดส่วนอุปกรณ์ B2B Desktop 64%, และคำขอใบเสนอราคาจำลอง) เหมาะสำหรับใช้ในการนำเสนอหรือ Demo เว็บไซต์
              </p>
            </div>
            <button
              type="button"
              className={`w-full rounded-xl py-2.5 px-4 text-xs font-bold transition-all ${
                formState.dashboardDataSource !== 'real'
                  ? 'bg-amber-500 text-black font-black shadow-sm'
                  : 'border border-theme-border bg-theme-surface text-theme-text-muted hover:text-theme-text'
              }`}
            >
              {formState.dashboardDataSource !== 'real' ? '✓ กำลังใช้งานโหมดนี้' : 'สลับใช้ข้อมูลจำลอง (Mockup)'}
            </button>
          </div>

          {/* Option 2: Real System Data */}
          <div
            onClick={() => handleSetDashboardDataSource('real')}
            className={`cursor-pointer rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 ${
              formState.dashboardDataSource === 'real'
                ? 'border-emerald-500/60 bg-emerald-500/10 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                : 'border-theme-border bg-theme-surface-elevated hover:border-theme-border/80'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-theme-text">
                  <Database className="h-4 w-4 text-emerald-400" />
                  <span>ข้อมูลจริงของระบบ (Real Live System Data)</span>
                </div>
                {formState.dashboardDataSource === 'real' && (
                  <span className="rounded-full bg-emerald-500 text-white px-2 py-0.5 text-[10px] font-black">
                    เปิดใช้งานอยู่
                  </span>
                )}
              </div>
              <p className="text-[11px] text-theme-text-muted leading-relaxed">
                ดึงตัวเลขและสถิติจริงจากฐานข้อมูลและระบบแบบ Real-time: จำนวนสินค้าจริง, ข่าวสารที่บันทึกจริง, หน้าเพจจริง, ไฟล์สื่อในคลังจริง, บัญชีผู้ใช้จริง, ข้อความติดต่อจากลูกค้าจริง และประวัติการทำงาน (Audit Logs)
              </p>
            </div>
            <button
              type="button"
              className={`w-full rounded-xl py-2.5 px-4 text-xs font-bold transition-all ${
                formState.dashboardDataSource === 'real'
                  ? 'bg-emerald-500 text-white font-black shadow-sm'
                  : 'border border-theme-border bg-theme-surface text-theme-text-muted hover:text-theme-text'
              }`}
            >
              {formState.dashboardDataSource === 'real' ? '✓ กำลังใช้งานโหมดนี้' : 'สลับใช้ข้อมูลจริงของระบบ (Real)'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. HEADER NAVIGATION TABS MANAGER (ซ่อน / แสดง Tab เมนูด้านบน) */}
      <div className="rounded-3xl border border-theme-border bg-theme-surface p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-theme-border pb-3 gap-2">
          <div>
            <h3 className="font-display text-sm font-bold text-theme-text flex items-center gap-2">
              <Navigation className="h-4 w-4 text-theme-primary" />
              <span>จัดการแถบเมนูนำทางด้านบน (Header Navigation Tabs Manager)</span>
            </h3>
            <p className="text-[11px] text-theme-text-muted mt-0.5">
              💡 <strong>ลากเพื่อจัดวางเรียงลำดับ (Drag & Drop)</strong> หรือกดปุ่มลูกศรขึ้น/ลง เพื่อจัดเรียงลำดับเมนูบน Header ได้ทันที พร้อมสวิตช์เปิด/ปิดซ่อนหรือแสดง
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {(settings.navTabs && settings.navTabs.length > 0 ? settings.navTabs : [
            { id: 'tab-home', key: 'home', labelTh: 'หน้าแรก', labelEn: 'Home', path: '/', enabled: true },
            { id: 'tab-about', key: 'about', labelTh: 'เกี่ยวกับเรา', labelEn: 'About Us', path: '/about', enabled: true },
            { id: 'tab-products', key: 'products', labelTh: 'สินค้า', labelEn: 'Products', path: '/products', enabled: true },
            { id: 'tab-services', key: 'services', labelTh: 'บริการ', labelEn: 'Services', path: '/services', enabled: true },
            { id: 'tab-technology', key: 'technology', labelTh: 'เทคโนโลยี', labelEn: 'Technology', path: '/technology', enabled: true },
            { id: 'tab-sustainability', key: 'sustainability', labelTh: 'ความยั่งยืน', labelEn: 'Sustainability', path: '/sustainability', enabled: true },
            { id: 'tab-news', key: 'news', labelTh: 'ข่าวสาร', labelEn: 'News & Press', path: '/news', enabled: true },
            { id: 'tab-contact', key: 'contact', labelTh: 'ติดต่อเรา', labelEn: 'Contact Us', path: '/contact', enabled: true },
            { id: 'tab-careers', key: 'careers', labelTh: 'สมัครงาน', labelEn: 'Careers', path: '/careers', enabled: true },
          ]).map((tab, idx, arr) => (
            <div
              key={tab.id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(idx)}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-move select-none ${
                draggedTabIndex === idx
                  ? 'border-theme-primary bg-theme-primary/10 opacity-50 scale-95'
                  : 'border-theme-border bg-theme-surface-elevated hover:border-theme-primary/50 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1 text-theme-text-dim">
                  <GripVertical className="h-4 w-4 cursor-grab active:cursor-grabbing hover:text-theme-primary" />
                  <span className="text-[9px] font-mono font-bold text-theme-primary">#{idx + 1}</span>
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-theme-text">{tab.labelTh}</span>
                    <span className="text-[10px] text-theme-text-muted font-mono">({tab.labelEn})</span>
                  </div>
                  <div className="text-[10px] text-theme-text-dim">
                    Path: <code className="text-theme-primary font-mono">{tab.path}</code>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Up/Down buttons for mobile & precise clicking */}
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveTab(idx, 'up')}
                    className="p-1 rounded bg-theme-surface hover:bg-theme-primary/20 text-theme-text-muted hover:text-theme-primary disabled:opacity-20 disabled:pointer-events-none transition-colors"
                    title="เลื่อนขึ้น"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === arr.length - 1}
                    onClick={() => handleMoveTab(idx, 'down')}
                    className="p-1 rounded bg-theme-surface hover:bg-theme-primary/20 text-theme-text-muted hover:text-theme-primary disabled:opacity-20 disabled:pointer-events-none transition-colors"
                    title="เลื่อนลง"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleNavTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                    tab.enabled
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-400'
                      : 'bg-slate-500/15 border border-slate-500/30 text-slate-400 hover:bg-emerald-500/15 hover:border-emerald-500/30 hover:text-emerald-400'
                  }`}
                  title={tab.enabled ? 'คลิกเพื่อซ่อน Tab นี้' : 'คลิกเพื่อแสดง Tab นี้'}
                >
                  {tab.enabled ? (
                    <>
                      <Eye className="h-3.5 w-3.5 text-emerald-400" />
                      <span>แสดง</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3.5 w-3.5 text-slate-400" />
                      <span>ซ่อน</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. HOMEPAGE CATEGORY CARDS & IMAGE MANAGER */}
      <div className="rounded-3xl border border-theme-border bg-theme-surface p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-theme-border pb-3">
          <div>
            <h3 className="font-display text-sm font-bold text-theme-text flex items-center gap-2">
              <Package className="h-4 w-4 text-theme-primary" />
              <span>จัดการหมวดหมู่สินค้าและรูปภาพหน้าแรก (Homepage Category Cards & Image Manager)</span>
            </h3>
            <p className="text-[11px] text-theme-text-muted mt-0.5">
              💡 คลิกปุ่ม <strong>"✏️ แก้ไขรูป/ข้อมูล"</strong> เพื่ออัปโหลดเปลี่ยนรูปภาพหมวดหมู่ แก้ไขชื่อภาษาไทย/อังกฤษ หรือปุ่ม 📌 ปักหมุดบนหน้าแรก
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddCategory}
            className="btn-primary-action text-xs font-black px-4 py-2 shadow-lg flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4 text-black" />
            <span>+ เพิ่มหมวดหมู่ใหม่</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {(settings.categoryCards || []).map((cat, idx) => (
            <div
              key={cat.id}
              className="flex flex-col justify-between p-4 rounded-2xl border border-theme-border bg-theme-surface-elevated/60 gap-3 hover:border-theme-primary/40 transition-all shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="relative group/img flex-shrink-0">
                  <img
                    src={cat.image}
                    alt={cat.titleTh}
                    className="h-16 w-16 object-contain rounded-xl bg-white p-1.5 border border-theme-border shadow-inner"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/cat-round-cans.jpg';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleOpenEditCategory(idx)}
                    className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-bold"
                    title="คลิกเพื่อเปลี่ยนรูปภาพ"
                  >
                    เปลี่ยนรูป
                  </button>
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-black text-theme-text truncate">{cat.titleTh}</span>
                    {cat.isPinned && (
                      <span className="flex items-center gap-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 text-[9px] font-bold flex-shrink-0">
                        <Pin className="h-2 w-2 fill-amber-400 text-amber-400" />
                        ปักหมุด
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-theme-text-muted truncate font-mono uppercase">{cat.titleEn}</div>
                  <div className="text-[10px] text-theme-primary/80 truncate font-mono">{cat.path}</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-theme-border/50 gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEditCategory(idx)}
                  className="flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-[11px] font-bold bg-theme-primary/10 text-theme-primary hover:bg-theme-primary hover:text-black transition-all border border-theme-primary/20"
                >
                  <Edit className="h-3 w-3" />
                  <span>แก้ไขรูป & ข้อมูล</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggleCategoryPin(idx)}
                    className={`flex items-center gap-1 rounded-xl px-2 py-1.5 text-[11px] font-bold transition-all ${
                      cat.isPinned
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                        : 'bg-theme-surface text-theme-text-muted hover:text-amber-400 border border-theme-border'
                    }`}
                    title={cat.isPinned ? 'ยกเลิกการปักหมุด' : 'ปักหมุดหมวดหมู่นี้บนหน้าแรก'}
                  >
                    <Pin className={`h-3 w-3 ${cat.isPinned ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleCategoryEnabled(idx)}
                    className={`flex items-center gap-1 rounded-xl px-2 py-1.5 text-[11px] font-bold transition-all ${
                      cat.enabled !== false
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-500/15 text-slate-400 border border-slate-500/30'
                    }`}
                    title={cat.enabled !== false ? 'คลิกเพื่อซ่อน' : 'คลิกเพื่อแสดง'}
                  >
                    {cat.enabled !== false ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  </button>

                  {(settings.categoryCards || []).length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(idx)}
                      className="p-1.5 text-theme-text-dim hover:text-red-400 rounded-lg transition-colors"
                      title="ลบหมวดหมู่นี้"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. THEME SYSTEM */}
      <div className="rounded-3xl border border-theme-border bg-theme-surface p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-theme-border pb-3">
          <h3 className="font-display text-sm font-bold text-theme-text flex items-center gap-2">
            <Palette className="h-4 w-4 text-theme-primary" />
            <span>ธีมและโทนสีของเว็บไซต์ (Website Theme System)</span>
          </h3>
          <span className="text-[11px] font-mono font-bold text-theme-primary bg-theme-primary/10 border border-theme-primary/30 px-2.5 py-0.5 rounded-full">
            Active: {theme}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {themes.map((item) => {
            const isActive = theme === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setTheme(item.id)}
                className={`cursor-pointer rounded-2xl border-2 p-4 transition-all duration-200 flex flex-col justify-between space-y-3 ${
                  item.bg
                } ${
                  isActive
                    ? 'border-theme-primary ring-4 ring-theme-primary/25 scale-[1.02] shadow-xl'
                    : 'opacity-70 hover:opacity-100 hover:border-theme-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-black/40 p-2 border border-white/10">
                    {item.icon}
                  </div>
                  {isActive && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-theme-primary bg-theme-primary/20 border border-theme-primary/40 px-2 py-0.5 rounded-full">
                      <Check className="h-3 w-3" />
                      Active
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-display text-xs font-bold text-theme-text">{item.name}</h4>
                  <p className="text-[10px] text-theme-text-muted mt-0.5 leading-snug">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. BRAND & LEGAL ENTITY INFO */}
      <div className="rounded-3xl border border-theme-border bg-theme-surface p-6 sm:p-8 shadow-2xl space-y-6 text-xs">
        <h3 className="font-display text-sm font-bold text-theme-text flex items-center gap-2 border-b border-theme-border pb-3">
          <Building2 className="h-4 w-4 text-theme-primary" />
          <span>ข้อมูลแบรนด์และนิติบุคคล (Brand & Legal Entity Information)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-theme-text block mb-1">ชื่อบริษัท (ภาษาไทย)</label>
            <input
              type="text"
              value={formState.companyNameTh}
              onChange={(e) => setFormState({ ...formState, companyNameTh: e.target.value })}
              className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text font-semibold"
            />
          </div>
          <div>
            <label className="font-bold text-theme-text block mb-1">Company Name (English)</label>
            <input
              type="text"
              value={formState.companyNameEn}
              onChange={(e) => setFormState({ ...formState, companyNameEn: e.target.value })}
              className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text font-semibold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="font-bold text-theme-text block mb-1">เลขประจำตัวผู้เสียภาษี (Tax ID)</label>
            <input
              type="text"
              value={formState.taxId}
              onChange={(e) => setFormState({ ...formState, taxId: e.target.value })}
              className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text font-mono"
            />
          </div>
          <div>
            <label className="font-bold text-theme-text block mb-1">ทุนจดทะเบียน</label>
            <input
              type="text"
              value={formState.registeredCapital}
              onChange={(e) => setFormState({ ...formState, registeredCapital: e.target.value })}
              className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text"
            />
          </div>
          <div>
            <label className="font-bold text-theme-text block mb-1">ปีก่อตั้ง (Established Year)</label>
            <input
              type="text"
              value={formState.establishedYear}
              onChange={(e) => setFormState({ ...formState, establishedYear: e.target.value })}
              className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-theme-border">
          <button
            type="button"
            onClick={handleSaveAll}
            className="btn-primary-action text-xs font-black px-6 py-2.5 shadow-xl"
          >
            <Save className="h-4 w-4 text-black" />
            <span>{t('common.save')} การตั้งค่า</span>
          </button>
        </div>
      </div>

      {/* 5. FOOTER & CERTIFICATIONS MANAGEMENT (100% NO HARDCODING) */}
      <div className="rounded-3xl border border-theme-border bg-theme-surface p-6 sm:p-8 shadow-2xl space-y-6 text-xs">
        <h3 className="font-display text-sm font-bold text-theme-text flex items-center gap-2 border-b border-theme-border pb-3">
          <Sliders className="h-4 w-4 text-theme-primary" />
          <span>ข้อมูลส่วนท้ายเว็บและการรับรองมาตรฐาน (Footer & Certifications Bar)</span>
        </h3>

        <div className="space-y-4">
          <div>
            <label className="font-bold text-theme-text block mb-1">
              คำบรรยายสรุปใต้แบรนด์ท้ายเว็บ (Footer Brand Bio)
            </label>
            <textarea
              rows={2}
              value={formState.footerBio}
              onChange={(e) => setFormState({ ...formState, footerBio: e.target.value })}
              placeholder="ผู้นำนวัตกรรมผลิตกระป๋องอาหารสำเร็จรูป ถังเคมีภัณฑ์ และฝาเปิดง่าย EOE..."
              className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text"
            />
          </div>

          {/* Informational Single Source of Truth Note */}
          <div className="rounded-2xl border border-theme-primary/30 bg-theme-primary/5 p-4 flex items-start gap-3">
            <div className="rounded-xl bg-theme-primary/10 p-2 text-theme-primary flex-shrink-0 mt-0.5">
              <Sliders className="h-4 w-4" />
            </div>
            <div className="space-y-1 text-xs">
              <div className="font-bold text-theme-text">
                ข้อมูลที่อยู่โรงงาน, เบอร์โทร, อีเมล และเวลาทำการใน Footer
              </div>
              <p className="text-[11px] text-theme-text-muted leading-relaxed">
                เชื่อมโยงกับเมนู <span className="font-bold text-theme-primary">"จัดการเนื้อหา • ติดต่อเรา"</span> โดยตรงแบบอัตโนมัติ (Single Source of Truth) เพื่อป้องกันความซ้ำซ้อน ไม่จำเป็นต้องกรอกซ้ำสองที่
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-theme-text block mb-1">
                แถบมาตรฐานรับรองสากล (Certifications Banner - ซ้าย)
              </label>
              <input
                type="text"
                value={formState.certificationsText}
                onChange={(e) => setFormState({ ...formState, certificationsText: e.target.value })}
                placeholder="ISO 9001:2015 | FSSC 22000 | HACCP & GMP Certified"
                className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text"
              />
            </div>
            <div>
              <label className="font-bold text-theme-text block mb-1">
                แถบมาตรฐานความปลอดภัย & รีไซเคิล (Compliance Text - ขวา)
              </label>
              <input
                type="text"
                value={formState.complianceText}
                onChange={(e) => setFormState({ ...formState, complianceText: e.target.value })}
                placeholder="BPA-NI Food Contact Compliant • UN Packaging Certified • 100% Infinitely Recyclable Steel"
                className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-theme-border">
          <button
            type="button"
            onClick={handleSaveAll}
            className="btn-primary-action text-xs font-black px-6 py-2.5 shadow-xl"
          >
            <Save className="h-4 w-4 text-black" />
            <span>{t('common.save')} ข้อมูลส่วนท้ายเว็บ</span>
          </button>
        </div>
      </div>

      {/* Category Edit / Add Modal */}
      <Modal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title={editingCatIdx !== null ? '✏️ แก้ไขรูปภาพและข้อมูลหมวดหมู่สินค้า' : '✨ เพิ่มหมวดหมู่สินค้าใหม่'}
      >
        <div className="space-y-4 text-xs font-sans">
          {/* Image Upload & Preview */}
          <div>
            <label className="font-bold text-theme-text block mb-1.5">
              รูปภาพหมวดหมู่สินค้า (Category Image) *
            </label>
            <div className="flex items-start gap-4 p-3 rounded-2xl border border-theme-border bg-theme-surface-elevated">
              <div className="h-20 w-20 rounded-xl bg-white p-2 border border-theme-border flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
                <img
                  src={catFormImage || '/images/cat-round-cans.jpg'}
                  alt="Preview"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/cat-round-cans.jpg';
                  }}
                />
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 rounded-xl bg-theme-primary/15 border border-theme-primary/40 px-3 py-1.5 text-xs font-bold text-theme-primary hover:bg-theme-primary hover:text-black cursor-pointer transition-all shadow-sm">
                    <UploadCloud className="h-3.5 w-3.5" />
                    <span>อัปโหลดรูปภาพใหม่ (PNG / JPG / WEBP)</span>
                    <input type="file" accept="image/*" onChange={handleCatImageUpload} className="hidden" />
                  </label>
                </div>
                <p className="text-[11px] text-theme-text-muted">
                  หรือระบุที่อยู่ไฟล์ / URL รูปภาพโดยตรง:
                </p>
                <input
                  type="text"
                  value={catFormImage}
                  onChange={(e) => setCatFormImage(e.target.value)}
                  placeholder="/images/cat-round-cans.jpg หรือ https://..."
                  className="w-full rounded-xl border border-theme-border bg-theme-surface px-3 py-1.5 text-[11px] text-theme-text font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-theme-text block mb-1">
                ชื่อหมวดหมู่ (ภาษาไทย) *
              </label>
              <input
                type="text"
                value={catFormTitleTh}
                onChange={(e) => setCatFormTitleTh(e.target.value)}
                placeholder="เช่น กระป๋องกลม, กระป๋องสเปรย์"
                className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text"
              />
            </div>
            <div>
              <label className="font-bold text-theme-text block mb-1">
                ชื่อหมวดหมู่ (English)
              </label>
              <input
                type="text"
                value={catFormTitleEn}
                onChange={(e) => setCatFormTitleEn(e.target.value.toUpperCase())}
                placeholder="e.g. ROUND CANS, AEROSOL CANS"
                className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text uppercase font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-theme-text block mb-1">
              ลิงก์ปลายทางเมื่อคลิก (Target Path)
            </label>
            <input
              type="text"
              value={catFormPath}
              onChange={(e) => setCatFormPath(e.target.value)}
              placeholder="เช่น /products?category=round-cans"
              className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text font-mono"
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={catFormPinned}
                onChange={(e) => setCatFormPinned(e.target.checked)}
                className="h-4 w-4 rounded border-theme-border text-theme-primary focus:ring-theme-primary"
              />
              <span className="font-bold text-theme-text">📌 ปักหมุดแสดงบนหน้าแรก</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={catFormEnabled}
                onChange={(e) => setCatFormEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-theme-border text-theme-primary focus:ring-theme-primary"
              />
              <span className="font-bold text-theme-text">🟢 เปิดแสดงผล (Active)</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-theme-border">
            <button
              type="button"
              onClick={() => setCategoryModalOpen(false)}
              className="rounded-xl border border-theme-border bg-theme-surface px-4 py-2 font-bold text-theme-text hover:bg-theme-surface-elevated"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleSaveCategory}
              className="btn-primary-action px-5 py-2 font-bold"
            >
              บันทึกการแก้ไข
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
