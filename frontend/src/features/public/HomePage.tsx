import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  ChevronRight,
  Factory,
  Globe,
  Users,
  DownloadCloud,
  Globe2,
  Settings,
  ShieldCheck,
  Users2,
  CheckCircle,
  Sparkles,
  Cpu,
  Layers,
  Printer,
  Wrench,
  Recycle,
  Sun,
  Droplets,
  Leaf,
  Wind,
  Flame,
  Shield,
  Briefcase,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Building2,
  Pin,
  Package,
  Star,
  Tag,
  ExternalLink,
} from 'lucide-react';
import { useSiteContent } from '../../hooks/useSiteContent';
import { useNews } from '../../hooks/useNews';
import { useProducts } from '../../hooks/useProducts';
import { formatDate } from '../../utils/dateUtils';
import { formatGoogleMapsUrl } from '../../utils/mapUtils';
import { Modal } from '../../components/ui/Modal';

const TECH_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Cpu,
  Settings,
  Sparkles,
  ShieldCheck,
  Factory,
};

const SUS_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Recycle,
  Sun,
  Droplets,
  Leaf,
  Wind,
  Flame,
  Shield,
};

const SRV_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Layers,
  Printer,
  Wrench,
  ShieldCheck,
  Cpu,
};

export const HomePage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { i18n } = useTranslation();
  const { settings } = useSiteContent();

  const isEn = (i18n.language || 'th') === 'en';

  const currentLang = i18n.language || 'th';
  const { data: newsArticles } = useNews(undefined, currentLang);

  // Detail Modal State for Cards (Services, Technology, Sustainability, News)
  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    type: 'service' | 'tech' | 'sustainability' | 'news' | 'product';
    title: string;
    subtitle?: string;
    category?: string;
    image?: string;
    content: string;
    features?: string[];
    date?: string;
    ctaText?: string;
    ctaAction?: () => void;
  }>({
    isOpen: false,
    type: 'service',
    title: '',
    content: '',
  });

  const enabledBadges = settings.featureBadges.filter((b) => b.enabled);
  const enabledMetrics = settings.metrics.filter((m) => m.enabled);

  // 📌 Products from Catalog Database with Pin sorting
  const { data: rawProducts } = useProducts('all', '', currentLang);
  const productsList = rawProducts && rawProducts.length > 0 ? rawProducts : [];
  const activeProducts = productsList.filter((p: any) => p.isActive !== false);
  const pinnedProducts = activeProducts.filter((p: any) => p.isPinned);
  const unpinnedProducts = activeProducts.filter((p: any) => !p.isPinned);
  const productsToShow = pinnedProducts.length > 0
    ? [...pinnedProducts, ...unpinnedProducts]
    : activeProducts;

  const [productViewMode, setProductViewMode] = useState<'catalog' | 'categories'>('catalog');

  // 🏢 Multi-Branch Locations
  const branches = (settings.branches && settings.branches.length > 0)
    ? settings.branches.filter((b) => b.enabled !== false)
    : [
        {
          id: 'b-default',
          nameTh: settings.companyNameTh || 'ไคโอทรอน เทคโนโลยี (สำนักงานใหญ่)',
          nameEn: 'Headquarters & Factory',
          type: 'headquarters' as const,
          addressTh: settings.factoryAddress || '88/8 หมู่ 4 ตำบลดอนไก่ดี อำเภอกระทุ่มแบน จังหวัดสมุทรสาคร 74110',
          phone: settings.phoneNumber || '02-810-1234',
          email: settings.email || 'sales@chiotron.co.th',
          businessHoursTh: settings.businessHours || 'จันทร์ - เสาร์ 08:00 - 17:00 น.',
          mapUrl: 'https://maps.google.com/?q=Samut+Sakhon',
          isPrimary: true,
          enabled: true,
        },
      ];

  const [activeBranchId, setActiveBranchId] = useState<string>(
    branches.find((b) => b.isPrimary)?.id || branches[0]?.id || ''
  );
  const currentBranch = branches.find((b) => b.id === activeBranchId) || branches[0];

  // 📌 Categories with Pin sorting
  const enabledCategories = settings.categoryCards.filter((c) => c.enabled);
  const pinnedCategories = enabledCategories.filter((c) => c.isPinned);
  const categoriesToShow = pinnedCategories.length > 0
    ? [...pinnedCategories, ...enabledCategories.filter((c) => !c.isPinned)]
    : enabledCategories;

  // 📌 Services with Pin filtering
  const rawServices = settings.servicesList || [];
  const pinnedServices = rawServices.filter((s) => s.isPinned);
  const servicesToShow = pinnedServices.length > 0 ? pinnedServices : rawServices.slice(0, 4);

  // 📌 Technology with Pin filtering
  const rawTech = settings.technologyCards || [];
  const pinnedTech = rawTech.filter((t) => t.isPinned);
  const techToShow = pinnedTech.length > 0 ? pinnedTech : rawTech.slice(0, 3);

  // 📌 Sustainability with Pin filtering
  const rawSus = settings.sustainabilityCards || [];
  const pinnedSus = rawSus.filter((s) => s.isPinned);
  const susToShow = pinnedSus.length > 0 ? pinnedSus : rawSus.slice(0, 3);

  // 📌 News with Pin sorting
  const allNews = newsArticles || [];
  const activeNews = allNews.filter((n: any) => n.isActive !== false);
  const pinnedNews = activeNews.filter((n: any) => n.isPinned);
  const unpinnedNews = activeNews.filter((n: any) => !n.isPinned);
  const displayedNews = pinnedNews.length > 0
    ? [...pinnedNews, ...unpinnedNews].slice(0, 3)
    : activeNews.slice(0, 3);

  // Quick inquiry state
  const [quickContactSent, setQuickContactSent] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const handleQuickContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setQuickContactSent(true);
    setTimeout(() => {
      setQuickContactSent(false);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 4000);
  };

  const getBadgeIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Globe2 className="h-12 w-12 stroke-[1.25]" />;
      case 1:
        return <Settings className="h-12 w-12 stroke-[1.25]" />;
      case 2:
        return <ShieldCheck className="h-12 w-12 stroke-[1.25]" />;
      default:
        return <Users2 className="h-12 w-12 stroke-[1.25]" />;
    }
  };

  const getMetricIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Factory className="h-6 w-6 text-theme-primary flex-shrink-0 mt-0.5" />;
      case 1:
        return <Globe className="h-6 w-6 text-theme-primary flex-shrink-0 mt-0.5" />;
      case 2:
        return <Users className="h-6 w-6 text-theme-primary flex-shrink-0 mt-0.5" />;
      default:
        return <DownloadCloud className="h-6 w-6 text-theme-primary flex-shrink-0 mt-0.5" />;
    }
  };

  // -------------------------------------------------------------
  // SECTION 1: HOME (Hero + Highlights)
  // -------------------------------------------------------------
  const renderHomeHero = () => (
    <section id="home" className="w-full scroll-mt-24">
      {/* Full-bleed Panoramic Hero Banner */}
      <div className="relative w-full overflow-hidden bg-[#070B14] pt-24 sm:pt-28 pb-14 sm:pb-18 min-h-[540px] lg:min-h-[620px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transition-all duration-500"
          style={{ backgroundImage: `url('${settings.heroBannerImage || '/images/hero-fullwidth.jpg'}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent z-10" />
          <div className="absolute inset-0 bg-black/15 z-10" />
        </div>

        <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl xl:max-w-2xl space-y-6">
            <div className="space-y-2">
              <h1 className="font-display text-4xl sm:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.15] drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                {settings.heroTitle || 'ไคโอทรอน เทคโนโลยี'}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#FCD34D] font-black mt-1 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                  {settings.heroHighlight || 'วิศวกรรมแห่งอนาคต'}
                </span>
              </h1>
            </div>

            <p className="text-sm sm:text-base text-white/95 font-medium leading-relaxed max-w-xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
              {settings.heroSubtitle}
            </p>

            {(settings.showHeroPrimaryBtn !== false || settings.showHeroSecondaryBtn !== false) && (
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {settings.showHeroPrimaryBtn !== false && (
                  <button
                    type="button"
                    onClick={() => {
                      const link = settings.heroButtonLink || '#about';
                      if (link.startsWith('#')) {
                        const el = document.getElementById(link.substring(1));
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                        else onNavigate('/about');
                      } else if (link.startsWith('/')) {
                        const targetId = link.replace('/', '');
                        const el = document.getElementById(targetId);
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                        else onNavigate(link);
                      } else {
                        onNavigate(link);
                      }
                    }}
                    className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#AA7C11] px-8 py-3.5 text-xs sm:text-sm font-bold text-black shadow-lg shadow-amber-500/25 hover:brightness-110 transition-all group cursor-pointer"
                  >
                    <span>{settings.heroButtonText || 'อ่านประวัติองค์กร'}</span>
                    <ArrowRight className="h-4 w-4 text-black group-hover:translate-x-1 transition-transform" />
                  </button>
                )}

                {settings.showHeroSecondaryBtn !== false && (
                  <button
                    type="button"
                    onClick={() => {
                      const link = settings.heroSecondaryButtonLink || '#products';
                      if (link.startsWith('#')) {
                        const el = document.getElementById(link.substring(1));
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                        else onNavigate('/products');
                      } else if (link.startsWith('/')) {
                        const targetId = link.replace('/', '');
                        const el = document.getElementById(targetId);
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                        else onNavigate(link);
                      } else {
                        onNavigate(link);
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-black/40 backdrop-blur-md px-6 py-3.5 text-xs sm:text-sm font-bold text-white hover:border-theme-primary hover:text-theme-primary transition-all cursor-pointer"
                  >
                    <span>{settings.heroSecondaryButtonText || 'ชมผลิตภัณฑ์ของเรา'}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feature Badges Bar */}
      {enabledBadges.length > 0 && (
        <div className="w-full border-b border-theme-border bg-theme-surface py-7 sm:py-8 shadow-sm transition-colors">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${enabledBadges.length} gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-theme-border`}
            >
              {enabledBadges.map((badge, idx) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-4 pt-4 sm:pt-0 sm:px-4 first:pt-0 first:pl-0 group"
                >
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center text-theme-primary group-hover:scale-110 transition-transform">
                    {getBadgeIcon(idx)}
                  </div>
                  <div>
                    <h3 className="font-display text-sm sm:text-base font-bold text-theme-text group-hover:text-theme-primary transition-colors">
                      {badge.title}
                    </h3>
                    <p className="text-xs text-theme-text-muted mt-0.5 leading-snug">
                      {badge.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );

  // -------------------------------------------------------------
  // SECTION 2: ABOUT US (#about)
  // -------------------------------------------------------------
  const renderAbout = () => (
    <section id="about" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 scroll-mt-28">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5">
          <div className="glow-card rounded-3xl overflow-hidden border border-theme-border shadow-2xl bg-theme-surface-elevated">
            <img
              src={settings.aboutFactoryImage || '/images/factory-building.jpg'}
              alt="CHIOTRON Manufacturing Plant"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-theme-primary">
              Corporate Story & Capabilities
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-theme-text">
              {settings.aboutHeading || 'เกี่ยวกับเรา'}
            </h2>
            <div className="h-1 w-12 bg-theme-primary rounded-full" />
          </div>

          <p className="text-xs sm:text-sm text-theme-text-muted leading-relaxed">
            {settings.aboutStory1}
          </p>

          <p className="text-xs sm:text-sm font-semibold text-theme-text leading-relaxed">
            {settings.aboutStory2}
          </p>

          {enabledMetrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-theme-border">
              {enabledMetrics.map((m, idx) => (
                <div
                  key={m.id}
                  className="glow-card rounded-2xl border border-theme-border bg-theme-surface p-3 flex items-start gap-2.5"
                >
                  {getMetricIcon(idx)}
                  <div>
                    <div className="font-display font-black text-lg sm:text-xl text-theme-text leading-none">
                      {m.value}
                    </div>
                    <div className="text-[10px] text-theme-text-muted mt-1 leading-tight">
                      {m.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate('/about')}
              className="inline-flex items-center gap-2 rounded-xl border border-theme-border bg-theme-surface px-5 py-2.5 text-xs font-bold text-theme-text hover:bg-theme-surface-elevated hover:border-theme-primary hover:text-theme-primary transition-all shadow-sm"
            >
              <span>อ่านวิสัยทัศน์และประวัติองค์กรฉบับเต็ม</span>
              <ChevronRight className="h-4 w-4 text-theme-primary" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  // -------------------------------------------------------------
  // SECTION 3: PRODUCTS (#products)
  // -------------------------------------------------------------
  const renderProducts = () => {
    if (enabledCategories.length === 0) return null;
    return (
      <section id="products" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-28">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-theme-primary">
              Packaging Catalog
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-theme-text">
              ผลิตภัณฑ์ของเรา (Products)
            </h2>
            <div className="h-1 w-12 bg-theme-primary rounded-full" />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Toggle: Catalog vs Categories */}
            <div className="flex items-center rounded-xl border border-theme-border bg-theme-surface p-1 text-xs">
              <button
                type="button"
                onClick={() => setProductViewMode('catalog')}
                className={`rounded-lg px-3 py-1.5 font-bold transition-all flex items-center gap-1.5 ${
                  productViewMode === 'catalog'
                    ? 'bg-theme-primary text-black shadow-sm'
                    : 'text-theme-text-muted hover:text-theme-text'
                }`}
              >
                <Package className="h-3.5 w-3.5" />
                <span>สินค้าแคตตาล็อก ({productsToShow.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setProductViewMode('categories')}
                className={`rounded-lg px-3 py-1.5 font-bold transition-all flex items-center gap-1.5 ${
                  productViewMode === 'categories'
                    ? 'bg-theme-primary text-black shadow-sm'
                    : 'text-theme-text-muted hover:text-theme-text'
                }`}
              >
                <Tag className="h-3.5 w-3.5" />
                <span>หมวดหมู่ ({categoriesToShow.length})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/products')}
              className="inline-flex items-center gap-2 rounded-xl border border-theme-border bg-theme-surface px-5 py-2.5 text-xs font-bold text-theme-text hover:bg-theme-surface-elevated hover:border-theme-primary hover:shadow-[0_0_15px_var(--color-primary-glow)] transition-all self-start sm:self-auto"
            >
              <span>ดูผลิตภัณฑ์ทั้งหมด</span>
              <ChevronRight className="h-4 w-4 text-theme-primary" />
            </button>
          </div>
        </div>

        {/* 1. CATALOG PRODUCTS VIEW (Shows exact products from Admin Panel Database) */}
        {productViewMode === 'catalog' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {productsToShow.map((prod: any) => (
              <div
                key={prod.id || prod.sku}
                onClick={() => {
                  setDetailModal({
                    isOpen: true,
                    type: 'product',
                    title: prod.name,
                    subtitle: `รหัสสินค้า: ${prod.sku} | หมวดหมู่: ${prod.categoryName}`,
                    category: prod.categoryName,
                    image: prod.primaryImageURL || prod.featuredImageUrl || '/images/cat-round-cans.jpg',
                    content:
                      prod.description ||
                      'บรรจุภัณฑ์โลหะคุณภาพสูงมาตรฐานสากล ผลิตด้วยเครื่องจักรอัตโนมัติความเร็วสูง รองรับการฆ่าเชื้อความร้อน Retort และได้มาตรฐานสัมผัสอาหาร BPA-NI',
                    features: [
                      `รหัส SKU: ${prod.sku}`,
                      `วัสดุโครงสร้าง: ${prod.material || 'Electrolytic Tinplate ETP'}`,
                      `สารเคลือบภายใน: ${prod.coatingType || 'BPA-NI Food Contact Safe'}`,
                      `ขนาด/มิติ: ${prod.specifications?.dimensions || 'ตามมาตรฐานหรือสั่งผลิต'}`,
                      `การรับรองมาตรฐาน: ${prod.unRating || 'ISO 9001:2015 / FSSC 22000'}`,
                      `การนำไปใช้: ${prod.applications || 'อาหารสำเร็จรูป, เครื่องดื่ม และเคมีภัณฑ์'}`,
                    ],
                    ctaText: 'ขอใบเสนอราคาสินค้านี้',
                    ctaAction: () => onNavigate('/contact?sku=' + encodeURIComponent(prod.sku)),
                  });
                }}
                className="glow-card group cursor-pointer rounded-2xl border border-theme-border bg-theme-surface overflow-hidden shadow-lg flex flex-col justify-between transition-all hover:border-theme-primary relative"
              >
                {prod.isPinned && (
                  <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 rounded-full bg-amber-500/95 backdrop-blur-md px-2 py-0.5 text-[9px] font-black text-black shadow-md border border-amber-400/50">
                    <Pin className="h-2.5 w-2.5 fill-black text-black" />
                    <span>แนะนำ</span>
                  </div>
                )}

                <div className="aspect-[4/3] w-full overflow-hidden bg-white p-4 flex items-center justify-center">
                  <img
                    src={prod.primaryImageURL || prod.featuredImageUrl || '/images/cat-round-cans.jpg'}
                    alt={prod.name}
                    className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/cat-round-cans.jpg';
                    }}
                  />
                </div>

                <div className="p-4 bg-theme-surface flex-1 flex flex-col justify-between border-t border-theme-border space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-theme-primary truncate">
                        {prod.categoryName || 'บรรจุภัณฑ์โลหะ'}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-theme-text-muted bg-theme-surface-elevated px-2 py-0.5 rounded border border-theme-border flex-shrink-0">
                        {prod.sku}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-xs sm:text-sm text-theme-text group-hover:text-theme-primary transition-colors line-clamp-2 leading-snug">
                      {prod.name}
                    </h3>

                    {(prod.material || prod.specifications?.dimensions) && (
                      <p className="text-[11px] text-theme-text-muted line-clamp-1 flex items-center gap-1.5 pt-1">
                        <Layers className="h-3 w-3 text-theme-primary flex-shrink-0" />
                        <span>{prod.material || prod.specifications?.dimensions}</span>
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-theme-border/60 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-theme-primary group-hover:underline flex items-center gap-1">
                      <span>ดูรายละเอียด</span>
                      <ChevronRight className="h-3 w-3" />
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('/contact?sku=' + encodeURIComponent(prod.sku));
                      }}
                      className="rounded-lg bg-theme-primary/10 hover:bg-theme-primary hover:text-black text-theme-primary px-2.5 py-1 text-[10px] font-bold transition-all border border-theme-primary/20"
                    >
                      ขอใบเสนอราคา
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. CATEGORIES VIEW (Category cards) */}
        {productViewMode === 'categories' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {categoriesToShow.map((cat) => (
              <div
                key={cat.id}
                onClick={() => onNavigate(cat.path)}
                className="glow-card group cursor-pointer rounded-2xl border border-theme-border bg-theme-surface overflow-hidden shadow-lg flex flex-col justify-between transition-colors relative"
              >
                {cat.isPinned && (
                  <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 rounded-full bg-amber-500/90 backdrop-blur-md px-2 py-0.5 text-[9px] font-black text-black shadow-md border border-amber-400/50">
                    <Pin className="h-2.5 w-2.5 fill-black text-black" />
                    <span>แนะนำ</span>
                  </div>
                )}
                <div className="aspect-[4/3] w-full overflow-hidden bg-white p-3">
                  <img
                    src={cat.image}
                    alt={cat.titleTh}
                    className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="bg-theme-surface-elevated p-3 text-center border-t border-theme-border group-hover:bg-theme-surface-hover transition-colors">
                  <h3 className="font-display font-bold text-xs sm:text-sm text-theme-text group-hover:text-theme-primary transition-colors">
                    {cat.titleTh}
                  </h3>
                  <span className="text-[10px] font-mono tracking-wider text-theme-text-muted block mt-0.5 group-hover:text-theme-primary transition-colors">
                    {cat.titleEn}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

  // -------------------------------------------------------------
  // SECTION 4: SERVICES (#services)
  // -------------------------------------------------------------
  const renderServices = () => (
    <section id="services" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-28">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-theme-primary">
            {settings.servicesBadge || 'Manufacturing Services'}
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-black text-theme-text">
            {settings.servicesHeading || 'บริการการผลิตและพิมพ์ลายบรรจุภัณฑ์โลหะครบวงจร'}
          </h2>
          <div className="h-1 w-12 bg-theme-primary rounded-full" />
        </div>

        <button
          type="button"
          onClick={() => onNavigate('/services')}
          className="inline-flex items-center gap-2 rounded-xl border border-theme-border bg-theme-surface px-5 py-2.5 text-xs font-bold text-theme-text hover:border-theme-primary transition-all self-start sm:self-auto"
        >
          <span>ดูรายละเอียดบริการทั้งหมด</span>
          <ChevronRight className="h-4 w-4 text-theme-primary" />
        </button>
      </div>

      <p className="text-xs sm:text-sm text-theme-text-muted leading-relaxed max-w-3xl">
        {settings.servicesDescription}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {servicesToShow.map((srv) => {
          const IconComp = SRV_ICONS[srv.icon] || Layers;
          const srvTitle = isEn ? (srv.titleEn || srv.titleTh) : (srv.titleTh || srv.titleEn);
          const srvDesc = isEn ? (srv.descEn || srv.descTh) : (srv.descTh || srv.descEn);

          return (
            <div
              key={srv.id}
              onClick={() => {
                setDetailModal({
                  isOpen: true,
                  type: 'service',
                  title: srvTitle,
                  subtitle: isEn ? 'Comprehensive Metal Packaging Solutions' : 'บริการวิศวกรรมบรรจุภัณฑ์โลหะครบวงจร',
                  category: isEn ? 'Service Solution' : 'บริการวิศวกรรม',
                  image: srv.image || '/images/cat-round-cans.jpg',
                  content: srvDesc,
                  features: srv.features,
                  ctaText: isEn ? 'Inquire About This Service' : 'ติดต่อสอบถามบริการนี้',
                  ctaAction: () => {
                    setDetailModal((prev) => ({ ...prev, isOpen: false }));
                    const el = document.getElementById('contact');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else onNavigate('/contact');
                  },
                });
              }}
              className="glow-card group cursor-pointer flex flex-col justify-between rounded-2xl border border-theme-border bg-theme-surface overflow-hidden hover:border-theme-primary/60 hover:shadow-2xl hover:-translate-y-1 transition-all shadow-xl relative"
            >
              {srv.isPinned && (
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-amber-500/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-black text-black shadow-md border border-amber-400/50">
                  <Pin className="h-3 w-3 fill-black text-black" />
                  <span>แนะนำ</span>
                </div>
              )}
              {srv.image && (
                <div className="relative h-48 w-full overflow-hidden bg-slate-900 border-b border-theme-border/50">
                  <img
                    src={srv.image}
                    alt={srvTitle}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/cat-round-cans.jpg';
                    }}
                  />
                  <div className="absolute top-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-black/60 backdrop-blur-md text-theme-primary border border-theme-primary/30 shadow-lg">
                    <IconComp className="h-5 w-5" />
                  </div>
                </div>
              )}
              <div className="p-7 space-y-5 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {!srv.image && (
                    <div className="rounded-2xl bg-theme-primary/10 p-3.5 w-fit border border-theme-primary/20 text-theme-primary">
                      <IconComp className="h-6 w-6" />
                    </div>
                  )}
                  <h3 className="font-display text-base sm:text-lg font-bold text-theme-text group-hover:text-theme-primary transition-colors">
                    {srvTitle}
                  </h3>
                  <p className="text-xs text-theme-text-muted leading-relaxed line-clamp-3">
                    {srvDesc}
                  </p>
                  {srv.features && srv.features.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-theme-border/50">
                      {srv.features.slice(0, 3).map((f, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs text-theme-text">
                          <CheckCircle className="h-3.5 w-3.5 text-theme-primary flex-shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-theme-border flex items-center gap-1.5 text-xs font-bold text-theme-primary group-hover:underline">
                  <span>ดูรายละเอียดบริการ</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );

  // -------------------------------------------------------------
  // SECTION 5: TECHNOLOGY (#technology)
  // -------------------------------------------------------------
  const renderTechnology = () => (
    <section id="technology" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-28">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-theme-primary">
            {settings.technologyBadge || 'Manufacturing Automation'}
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-black text-theme-text">
            {settings.technologyHeading || 'เทคโนโลยีการผลิตกระป๋องโลหะความเร็วสูงและ AI อัจฉริยะ'}
          </h2>
          <div className="h-1 w-12 bg-theme-primary rounded-full" />
        </div>

        <button
          type="button"
          onClick={() => onNavigate('/technology')}
          className="inline-flex items-center gap-2 rounded-xl border border-theme-border bg-theme-surface px-5 py-2.5 text-xs font-bold text-theme-text hover:border-theme-primary transition-all self-start sm:self-auto"
        >
          <span>ดูสายการผลิตทั้งหมด</span>
          <ChevronRight className="h-4 w-4 text-theme-primary" />
        </button>
      </div>

      <p className="text-xs sm:text-sm text-theme-text-muted leading-relaxed max-w-3xl">
        {settings.technologyDescription}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {techToShow.map((card) => {
          const IconComp = TECH_ICONS[card.icon] || Cpu;
          const techTitle = isEn ? (card.titleEn || card.titleTh) : (card.titleTh || card.titleEn);
          const techDesc = isEn ? (card.descEn || card.descTh) : (card.descTh || card.descEn);

          return (
            <div
              key={card.id}
              onClick={() => {
                setDetailModal({
                  isOpen: true,
                  type: 'tech',
                  title: techTitle,
                  subtitle: isEn ? 'Smart Manufacturing & High-Speed Automation' : 'เทคโนโลยีและเครื่องจักรอัตโนมัติความเร็วสูง',
                  category: isEn ? 'Technology & AI' : 'เทคโนโลยีการผลิต',
                  image: card.image || '/images/factory-building.jpg',
                  content: techDesc,
                  ctaText: isEn ? 'Consult Technical Engineers' : 'ปรึกษาทีมวิศวกรเทคนิค',
                  ctaAction: () => {
                    setDetailModal((prev) => ({ ...prev, isOpen: false }));
                    const el = document.getElementById('contact');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else onNavigate('/contact');
                  },
                });
              }}
              className="glow-card group cursor-pointer flex flex-col justify-between rounded-2xl border border-theme-border bg-theme-surface overflow-hidden hover:border-theme-primary/60 hover:shadow-2xl hover:-translate-y-1 transition-all shadow-xl relative"
            >
              {card.isPinned && (
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-amber-500/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-black text-black shadow-md border border-amber-400/50">
                  <Pin className="h-3 w-3 fill-black text-black" />
                  <span>ไฮไลท์</span>
                </div>
              )}
              {card.image && (
                <div className="relative h-56 w-full overflow-hidden bg-slate-900 border-b border-theme-border/50">
                  <img
                    src={card.image}
                    alt={techTitle}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/factory-building.jpg';
                    }}
                  />
                  <div className="absolute top-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-black/60 backdrop-blur-md text-theme-primary border border-theme-primary/30 shadow-lg">
                    <IconComp className="h-5 w-5" />
                  </div>
                </div>
              )}
              <div className="p-7 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {!card.image && (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-theme-primary/10 text-theme-primary">
                      <IconComp className="h-6 w-6" />
                    </div>
                  )}
                  <h3 className="font-display text-base sm:text-lg font-bold text-theme-text group-hover:text-theme-primary transition-colors">
                    {techTitle}
                  </h3>
                  <p className="text-xs text-theme-text-muted leading-relaxed line-clamp-3">
                    {techDesc}
                  </p>
                </div>

                <div className="pt-3 border-t border-theme-border flex items-center gap-1.5 text-xs font-bold text-theme-primary group-hover:underline">
                  <span>ดูรายละเอียดเทคโนโลยี</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );

  // -------------------------------------------------------------
  // SECTION 6: SUSTAINABILITY (#sustainability)
  // -------------------------------------------------------------
  const renderSustainability = () => (
    <section id="sustainability" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-28">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
            {settings.sustainabilityBadge || 'Circular Economy & ESG'}
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-black text-theme-text">
            {settings.sustainabilityHeading || 'โลหะ... วัสดุเพื่อความยั่งยืนที่รีไซเคิลได้ไม่รู้จบ'}
          </h2>
          <div className="h-1 w-12 bg-emerald-500 rounded-full" />
        </div>

        <button
          type="button"
          onClick={() => onNavigate('/sustainability')}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-2.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all self-start sm:self-auto"
        >
          <span>อ่านรายงานความยั่งยืน</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <p className="text-xs sm:text-sm text-theme-text-muted leading-relaxed max-w-3xl">
        {settings.sustainabilityDescription}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {susToShow.map((card) => {
          const IconComp = SUS_ICONS[card.icon] || Leaf;
          const susTitle = isEn ? (card.titleEn || card.titleTh) : (card.titleTh || card.titleEn);
          const susDesc = isEn ? (card.descEn || card.descTh) : (card.descTh || card.descEn);

          return (
            <div
              key={card.id}
              onClick={() => {
                setDetailModal({
                  isOpen: true,
                  type: 'sustainability',
                  title: susTitle,
                  subtitle: isEn ? 'Eco-Friendly & Circular Economy' : 'ความยั่งยืนและการรีไซเคิลโลหะ 100%',
                  category: isEn ? 'ESG & Net Zero' : 'ความยั่งยืน & สิ่งแวดล้อม',
                  image: card.image || '/images/hero-fullwidth.jpg',
                  content: susDesc,
                  ctaText: isEn ? 'Explore Sustainability Strategy' : 'อ่านนโยบายความยั่งยืนฉบับเต็ม',
                  ctaAction: () => {
                    setDetailModal((prev) => ({ ...prev, isOpen: false }));
                    onNavigate('/sustainability');
                  },
                });
              }}
              className="glow-card group cursor-pointer flex flex-col justify-between rounded-2xl border border-emerald-500/30 bg-theme-surface overflow-hidden hover:border-emerald-500 hover:shadow-2xl hover:-translate-y-1 transition-all shadow-xl relative"
            >
              {card.isPinned && (
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-emerald-400 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-black text-black shadow-md border border-emerald-300">
                  <Pin className="h-3 w-3 fill-black text-black" />
                  <span>นโยบายหลัก</span>
                </div>
              )}
              {card.image && (
                <div className="relative h-48 w-full overflow-hidden bg-slate-900 border-b border-theme-border/50">
                  <img
                    src={card.image}
                    alt={susTitle}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/hero-fullwidth.jpg';
                    }}
                  />
                  <div className="absolute top-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30 shadow-lg">
                    <IconComp className="h-5 w-5" />
                  </div>
                </div>
              )}
              <div className="p-7 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {!card.image && (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                      <IconComp className="h-6 w-6" />
                    </div>
                  )}
                  <h3 className="font-display text-base font-bold text-theme-text group-hover:text-emerald-400 transition-colors">
                    {susTitle}
                  </h3>
                  <p className="text-xs text-theme-text-muted leading-relaxed line-clamp-3">
                    {susDesc}
                  </p>
                </div>

                <div className="pt-3 border-t border-emerald-500/20 flex items-center gap-1.5 text-xs font-bold text-emerald-500 group-hover:underline">
                  <span>ดูรายละเอียดความยั่งยืน</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );

  // -------------------------------------------------------------
  // SECTION 7: NEWS & PRESS (#news)
  // -------------------------------------------------------------
  const renderNews = () => {
    return (
      <section id="news" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-28">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-theme-primary">
              News & Announcements
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-theme-text">
              ข่าวสารและกิจกรรมล่าสุด (News & Press)
            </h2>
            <div className="h-1 w-12 bg-theme-primary rounded-full" />
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/news')}
            className="inline-flex items-center gap-2 rounded-xl border border-theme-border bg-theme-surface px-5 py-2.5 text-xs font-bold text-theme-text hover:border-theme-primary transition-all self-start sm:self-auto"
          >
            <span>อ่านข่าวสารทั้งหมด</span>
            <ChevronRight className="h-4 w-4 text-theme-primary" />
          </button>
        </div>

        {displayedNews.length === 0 ? (
          <div className="p-8 text-center text-xs text-theme-text-muted rounded-2xl border border-theme-border bg-theme-surface">
            กำลังอัปเดตข่าวสารและกิจกรรมล่าสุด...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayedNews.map((item: any) => {
              const itemImage = item.featuredImageURL || item.image || '/images/factory-building.jpg';
              const itemDate = item.publishedAt ? formatDate(item.publishedAt, currentLang) : (item.date || '');
              const itemSummary = item.summary || item.excerpt || (item.contentBody ? item.contentBody.substring(0, 110) + '...' : '');

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setDetailModal({
                      isOpen: true,
                      type: 'news',
                      title: item.title,
                      subtitle: item.category || 'ข่าวสารองค์กร',
                      category: item.category || 'News',
                      image: itemImage,
                      date: itemDate,
                      content: item.contentBody || itemSummary,
                      ctaText: isEn ? 'Read Full Article & Press' : 'อ่านข่าวสารฉบับเต็ม',
                      ctaAction: () => {
                        setDetailModal((prev) => ({ ...prev, isOpen: false }));
                        onNavigate(item.slug ? `/news/${item.slug}` : '/news');
                      },
                    });
                  }}
                  className="glow-card group cursor-pointer flex flex-col justify-between rounded-2xl border border-theme-border bg-theme-surface overflow-hidden hover:border-theme-primary/60 hover:shadow-2xl hover:-translate-y-1 transition-all shadow-xl relative"
                >
                  {item.isPinned && (
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-amber-500/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-black text-black shadow-md border border-amber-400/50">
                      <Pin className="h-3 w-3 fill-black text-black" />
                      <span>ข่าวเด่น</span>
                    </div>
                  )}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    <img
                      src={itemImage}
                      alt={item.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/factory-building.jpg';
                      }}
                    />
                    <div className="absolute top-3 left-3 rounded-md bg-theme-primary px-2.5 py-1 text-[10px] font-bold text-black shadow-md">
                      {item.category || 'Corporate'}
                    </div>
                  </div>

                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      {itemDate && (
                        <div className="flex items-center gap-1.5 text-[10px] text-theme-text-dim">
                          <Calendar className="h-3.5 w-3.5 text-theme-primary" />
                          <span>{itemDate}</span>
                        </div>
                      )}
                      <h3 className="font-display font-bold text-base text-theme-text group-hover:text-theme-primary transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-theme-text-muted leading-relaxed line-clamp-2">
                        {itemSummary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-theme-border flex items-center gap-1 text-xs font-bold text-theme-primary group-hover:underline">
                      <span>อ่านต่อ</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    );
  };

  // -------------------------------------------------------------
  // SECTION 8: CONTACT US (#contact)
  // -------------------------------------------------------------
  const renderContact = () => (
    <section id="contact" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-28">
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-theme-primary">
          Get in Touch
        </span>
        <h2 className="font-display text-2xl sm:text-4xl font-black text-theme-text">
          ติดต่อเรา (Contact Us)
        </h2>
        <div className="h-1 w-12 bg-theme-primary rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Multi-Branch Contact Info Card */}
        <div className="lg:col-span-5 glow-card rounded-2xl border border-theme-border bg-theme-surface p-6 sm:p-8 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-theme-border pb-3">
              <h3 className="font-display font-bold text-base sm:text-lg text-theme-text flex items-center gap-2">
                <Building2 className="h-5 w-5 text-theme-primary" />
                <span>สถานที่ตั้งและสาขา ({branches.length})</span>
              </h3>
              {currentBranch.isPrimary && (
                <span className="flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[9px] font-bold text-amber-500">
                  <Star className="h-2.5 w-2.5 fill-amber-400" />
                  สาขาหลัก
                </span>
              )}
            </div>

            {/* Branch Selector Tabs */}
            {branches.length > 1 && (
              <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-theme-surface-elevated border border-theme-border">
                {branches.map((b) => {
                  const isSelected = b.id === activeBranchId;
                  const icon =
                    b.type === 'headquarters' ? '🏢' : b.type === 'factory' ? '🏭' : b.type === 'warehouse' ? '📦' : '📍';
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setActiveBranchId(b.id)}
                      className={`flex-1 min-w-[100px] rounded-lg py-1.5 px-2.5 text-[11px] font-bold transition-all text-center flex items-center justify-center gap-1 truncate ${
                        isSelected
                          ? 'bg-theme-primary text-black shadow-sm'
                          : 'text-theme-text-muted hover:text-theme-text'
                      }`}
                    >
                      <span>{icon}</span>
                      <span className="truncate">{b.nameTh.split('(')[0]}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-theme-primary block">
                {currentBranch.nameEn || 'LOCATION'}
              </span>
              <h4 className="font-display font-bold text-sm text-theme-text mt-0.5">
                {currentBranch.nameTh}
              </h4>
            </div>

            <div className="space-y-3 text-xs text-theme-text-muted">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-theme-primary flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {currentBranch.addressTh}
                </span>
              </div>

              {currentBranch.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-theme-primary flex-shrink-0" />
                  <a
                    href={`tel:${currentBranch.phone.replace(/[^0-9+]/g, '')}`}
                    className="font-mono hover:text-theme-primary transition-colors"
                  >
                    {currentBranch.phone}
                  </a>
                </div>
              )}

              {currentBranch.email && (
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-theme-primary flex-shrink-0" />
                  <a
                    href={`mailto:${currentBranch.email}`}
                    className="font-mono hover:text-theme-primary transition-colors"
                  >
                    {currentBranch.email}
                  </a>
                </div>
              )}

              {currentBranch.businessHoursTh && (
                <div className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4 text-theme-primary flex-shrink-0" />
                  <span>{currentBranch.businessHoursTh}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="rounded-xl overflow-hidden border border-theme-border aspect-[16/9] w-full bg-slate-900 shadow-inner">
              <iframe
                title={`${currentBranch.nameTh} Map`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  currentBranch.addressTh || currentBranch.nameTh
                )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100"
                loading="lazy"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <a
                href={formatGoogleMapsUrl(currentBranch.mapUrl, currentBranch.addressTh)}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-theme-primary hover:underline flex items-center gap-1"
              >
                <span>เปิดแผนที่นำทาง Google Maps</span>
                <ExternalLink className="h-3 w-3" />
              </a>

              <button
                type="button"
                onClick={() => onNavigate('/contact')}
                className="font-bold text-theme-text-muted hover:text-theme-primary transition-colors flex items-center gap-1"
              >
                <span>ดูข้อมูลติดต่อทั้งหมด</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Quotation Inquiry Form */}
        <div className="lg:col-span-7 glow-card rounded-2xl border border-theme-border bg-theme-surface p-7 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-base sm:text-lg text-theme-text flex items-center gap-2">
              <Send className="h-4 w-4 text-theme-primary" />
              <span>ส่งข้อความสอบถามหรือขอใบเสนอราคา (Quick Inquiry)</span>
            </h3>
            <p className="text-xs text-theme-text-muted">
              วิศวกรฝ่ายขายจะติดต่อกลับเพื่อให้คำปรึกษาและใบเสนอราคาภายใน 24 ชม.
            </p>
          </div>

          {quickContactSent ? (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-center space-y-2">
              <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto" />
              <h4 className="font-display font-bold text-sm text-theme-text">
                ส่งข้อมูลติดต่อสำเร็จเรียบร้อย!
              </h4>
              <p className="text-xs text-theme-text-muted">
                เจ้าหน้าที่ฝ่ายวิศวกรรมการผลิตจะติดต่อกลับไปยังท่านโดยเร็วที่สุด ขอบพระคุณครับ
              </p>
            </div>
          ) : (
            <form onSubmit={handleQuickContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-theme-text mb-1">
                    ชื่อ-นามสกุล / บริษัทผู้ติดต่อ *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="คุณสมชาย (บจก. ตัวอย่างอาหาร)"
                    className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-xs text-theme-text focus:border-theme-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-theme-text mb-1">
                    อีเมลหรือเบอร์โทรศัพท์สำหรับติดต่อกลับ *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="somchai@example.com หรือ 081-234-5678"
                    className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-xs text-theme-text focus:border-theme-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-theme-text mb-1">
                  ข้อความ / รายละเอียดสินค้าที่ต้องการสอบถาม *
                </label>
                <textarea
                  rows={4}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="ระบุขนาดกระป๋อง ความต้องการเคลือบสารภายใน หรือจำนวนที่ต้องการสอบถาม..."
                  className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-xs text-theme-text focus:border-theme-primary focus:outline-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-theme-primary px-7 py-3 text-xs font-bold text-black shadow-lg shadow-theme-primary/20 hover:opacity-90 transition-all cursor-pointer w-full sm:w-auto"
              >
                <Send className="h-4 w-4" />
                <span>ส่งข้อความถึงฝ่ายขาย</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );

  // -------------------------------------------------------------
  // SECTION 9: CAREERS (#careers)
  // -------------------------------------------------------------
  const renderCareers = () => (
    <section id="careers" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-28">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-theme-primary">
            {settings.careersBadge || 'Careers & Opportunities'}
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-black text-theme-text">
            {settings.careersHeading || 'ร่วมเป็นส่วนหนึ่งของการขับเคลื่อนอุตสาหกรรมบรรจุภัณฑ์สู่อนาคต'}
          </h2>
          <div className="h-1 w-12 bg-theme-primary rounded-full" />
        </div>

        <button
          type="button"
          onClick={() => onNavigate('/careers')}
          className="inline-flex items-center gap-2 rounded-xl border border-theme-primary/40 bg-theme-primary/10 px-5 py-2.5 text-xs font-bold text-theme-primary hover:bg-theme-primary hover:text-black transition-all self-start sm:self-auto"
        >
          <span>ดูตำแหน่งงานว่างทั้งหมด</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <p className="text-xs sm:text-sm text-theme-text-muted leading-relaxed max-w-3xl">
        {settings.careersSubtitle}
      </p>

      {/* Benefits Grid Preview */}
      {settings.careersBenefits && settings.careersBenefits.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {settings.careersBenefits.slice(0, 6).map((benefit, bIdx) => (
            <div
              key={bIdx}
              className="glow-card flex items-center gap-2.5 p-3.5 rounded-xl border border-theme-border bg-theme-surface text-xs text-theme-text"
            >
              <CheckCircle className="h-4 w-4 text-theme-primary flex-shrink-0" />
              <span className="text-[11px] leading-snug">{benefit}</span>
            </div>
          ))}
        </div>
      )}

      {/* Open Job Positions preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(settings.careersJobs || []).filter((j) => j.active).slice(0, 3).map((job) => (
          <div
            key={job.id}
            className="glow-card flex flex-col justify-between rounded-2xl border border-theme-border bg-theme-surface p-6 space-y-4 transition-all"
          >
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-[10px] font-mono text-theme-primary font-bold">
                <Briefcase className="h-3.5 w-3.5" />
                <span>{job.department}</span>
              </div>
              <h3 className="font-display font-bold text-base text-theme-text">
                {isEn ? (job.titleEn || job.titleTh) : (job.titleTh || job.titleEn)}
              </h3>
              <p className="text-xs text-theme-text-muted line-clamp-2">
                {job.description}
              </p>
            </div>

            <div className="pt-3 border-t border-theme-border flex items-center justify-between">
              <span className="text-[11px] text-theme-text-dim">{job.location}</span>
              <button
                type="button"
                onClick={() => onNavigate('/careers')}
                className="text-xs font-bold text-theme-primary hover:underline flex items-center gap-1"
              >
                <span>สมัครงาน</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  // -------------------------------------------------------------
  // DYNAMIC SECTION DISPATCHER
  // Reorders sections automatically according to settings.navTabs!
  // -------------------------------------------------------------
  const activeTabs = (settings.navTabs && settings.navTabs.length > 0
    ? settings.navTabs
    : [
        { id: 'tab-home', key: 'home', labelTh: 'หน้าแรก', labelEn: 'Home', path: '/', enabled: true },
        { id: 'tab-about', key: 'about', labelTh: 'เกี่ยวกับเรา', labelEn: 'About Us', path: '/about', enabled: true },
        { id: 'tab-products', key: 'products', labelTh: 'สินค้า', labelEn: 'Products', path: '/products', enabled: true },
        { id: 'tab-services', key: 'services', labelTh: 'บริการ', labelEn: 'Services', path: '/services', enabled: true },
        { id: 'tab-technology', key: 'technology', labelTh: 'เทคโนโลยี', labelEn: 'Technology', path: '/technology', enabled: true },
        { id: 'tab-sustainability', key: 'sustainability', labelTh: 'ความยั่งยืน', labelEn: 'Sustainability', path: '/sustainability', enabled: true },
        { id: 'tab-news', key: 'news', labelTh: 'ข่าวสาร', labelEn: 'News & Press', path: '/news', enabled: true },
        { id: 'tab-contact', key: 'contact', labelTh: 'ติดต่อเรา', labelEn: 'Contact Us', path: '/contact', enabled: true },
        { id: 'tab-careers', key: 'careers', labelTh: 'สมัครงาน', labelEn: 'Careers', path: '/careers', enabled: true },
      ]
  ).filter((t) => t.enabled);

  const renderSectionByKey = (key: string) => {
    switch (key) {
      case 'home':
        return renderHomeHero();
      case 'about':
        return renderAbout();
      case 'products':
        return renderProducts();
      case 'services':
        return renderServices();
      case 'technology':
        return renderTechnology();
      case 'sustainability':
        return renderSustainability();
      case 'news':
        return renderNews();
      case 'contact':
        return renderContact();
      case 'careers':
        return renderCareers();
      default:
        return null;
    }
  };

  return (
    <div className="font-sans pb-24 space-y-24 sm:space-y-32">
      {activeTabs.map((tab) => (
        <React.Fragment key={tab.id || tab.key}>
          {renderSectionByKey(tab.key)}
        </React.Fragment>
      ))}

      {/* 🌟 RICH CARD DETAIL MODAL (Services, Technology, Sustainability, News) */}
      <Modal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal((prev) => ({ ...prev, isOpen: false }))}
        title={detailModal.title}
        subtitle={detailModal.subtitle}
        maxWidth="2xl"
      >
        <div className="space-y-4 text-xs font-sans">
          {detailModal.image && (
            <div
              className={`w-full overflow-hidden rounded-2xl border border-theme-border relative shadow-inner ${
                detailModal.type === 'product'
                  ? 'bg-white h-44 sm:h-52 p-4 flex items-center justify-center'
                  : 'h-44 sm:h-52 bg-slate-900'
              }`}
            >
              <img
                src={detailModal.image}
                alt={detailModal.title}
                className={`h-full w-full ${
                  detailModal.type === 'product' ? 'object-contain' : 'object-cover'
                }`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/hero-fullwidth.jpg';
                }}
              />
              {detailModal.category && (
                <div className="absolute top-3 left-3 rounded-xl bg-black/80 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-theme-primary border border-theme-primary/30 shadow-lg">
                  {detailModal.category}
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            {detailModal.date && (
              <div className="flex items-center gap-1.5 text-xs text-theme-text-dim">
                <Calendar className="h-3.5 w-3.5 text-theme-primary" />
                <span>{detailModal.date}</span>
              </div>
            )}
            <p className="text-xs sm:text-sm text-theme-text leading-relaxed whitespace-pre-line pt-1">
              {detailModal.content}
            </p>

            {detailModal.features && detailModal.features.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-theme-border">
                <h4 className="font-bold text-theme-text text-xs">คุณสมบัติและไฮไลท์สำคัญ:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {detailModal.features.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-theme-surface-elevated border border-theme-border text-theme-text text-xs">
                      <CheckCircle className="h-4 w-4 text-theme-primary flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 pt-4 border-t border-theme-border flex-wrap">
            <button
              type="button"
              onClick={() => setDetailModal((prev) => ({ ...prev, isOpen: false }))}
              className="rounded-xl border border-theme-border bg-theme-surface px-5 py-2.5 font-bold text-theme-text hover:bg-theme-surface-elevated transition-colors"
            >
              ปิดหน้าต่าง
            </button>

            {detailModal.ctaText && detailModal.ctaAction && (
              <button
                type="button"
                onClick={detailModal.ctaAction}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#AA7C11] px-6 py-2.5 text-xs font-bold text-black shadow-lg shadow-amber-500/25 hover:brightness-110 transition-all cursor-pointer"
              >
                <span>{detailModal.ctaText}</span>
                <ArrowRight className="h-4 w-4 text-black" />
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
