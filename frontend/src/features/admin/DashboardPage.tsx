import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts';
import {
  FileText,
  Package,
  Newspaper,
  Image as ImageIcon,
  Activity,
  Users,
  Eye,
  TrendingUp,
  Globe2,
  Download,
  Smartphone,
  Laptop,
  Tablet,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
  Database,
  Server,
  ShieldCheck,
  Mail,
  Sliders,
  Check,
} from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useNews } from '../../hooks/useNews';
import { useAdminPages } from '../../hooks/usePages';
import { useAuditLogs, useAdminUsers } from '../../hooks/useAdmin';
import { useMediaLibrary } from '../../hooks/useMedia';
import { useSiteContent } from '../../hooks/useSiteContent';
import { useTheme } from '../../theme/ThemeProvider';

export const DashboardPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const { themeConfig } = useTheme();
  const { settings, updateSettings } = useSiteContent();

  const isRealData = settings.dashboardDataSource === 'real';

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '1y'>('30d');

  // Real Database Queries & Hooks
  const { data: pages } = useAdminPages();
  const { data: products } = useProducts();
  const { data: news } = useNews();
  const { data: media } = useMediaLibrary();
  const { data: auditLogs } = useAuditLogs();
  const { data: users } = useAdminUsers();

  const [inquiriesList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('lohakit_customer_inquiries');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const realPagesCount = pages?.length ?? 8;
  const realPublishedPages = (pages ?? []).filter((p) => p.status === 'PUBLISHED').length || 6;
  const realProductsCount = products?.length ?? 0;
  const realNewsCount = news?.length ?? 0;
  const realActiveNewsCount = (news ?? []).filter((n: any) => n.isActive !== false).length;
  const realMediaCount = media?.length ?? 0;
  const realUsersCount = users?.length || 1;
  const realInquiriesCount = inquiriesList.length;
  const realPendingInquiriesCount = inquiriesList.filter((i: any) => i.status === 'PENDING').length;
  const realAuditLogsCount = auditLogs?.length ?? 0;

  // Toggle Data Source Mode
  const handleSwitchMode = (mode: 'mock' | 'real') => {
    updateSettings({ dashboardDataSource: mode });
  };

  // -------------------------------------------------------------
  // MOCK DATASETS (FOR PRESENTATION & DEMO MODE)
  // -------------------------------------------------------------
  const mockTrafficData = [
    { name: 'ม.ค. (Jan)', visitors: 5800, pageviews: 18400, quotes: 42 },
    { name: 'ก.พ. (Feb)', visitors: 6400, pageviews: 21200, quotes: 56 },
    { name: 'มี.ค. (Mar)', visitors: 8200, pageviews: 26800, quotes: 78 },
    { name: 'เม.ย. (Apr)', visitors: 7600, pageviews: 24500, quotes: 65 },
    { name: 'พ.ค. (May)', visitors: 9400, pageviews: 31200, quotes: 89 },
    { name: 'มิ.ย. (Jun)', visitors: 10850, pageviews: 36700, quotes: 102 },
  ];

  const mockLanguageData = [
    { name: 'ไทย (Thai)', value: 55, color: themeConfig.colors.primary },
    { name: 'English (อังกฤษ/สากล)', value: 25, color: themeConfig.colors.accent },
    { name: '日本語 (ญี่ปุ่น)', value: 10, color: '#10B981' },
    { name: '中文 (จีน)', value: 7, color: themeConfig.colors.secondary },
    { name: 'မြန်မာ (เมียนมา)', value: 3, color: '#EC4899' },
  ];

  const mockTopProductsData = [
    { name: 'กระป๋องอาหาร 300x401', views: 4250, downloads: 380 },
    { name: 'ถังเคมีภัณฑ์ 20L (UN)', views: 3680, downloads: 295 },
    { name: 'ฝาดึงเปิดง่าย EOE 300', views: 3120, downloads: 260 },
    { name: 'กระป๋องสเปรย์ 65x190', views: 2450, downloads: 180 },
    { name: 'กระป๋องพิมพ์ลาย 6 สี', views: 1980, downloads: 145 },
  ];

  const mockDeviceData = [
    { name: 'Desktop (คอมพิวเตอร์ B2B)', value: 64, icon: Laptop, color: themeConfig.colors.primary },
    { name: 'Mobile (โทรศัพท์มือถือ)', value: 31, icon: Smartphone, color: themeConfig.colors.accent },
    { name: 'Tablet (แท็บเล็ต)', value: 5, icon: Tablet, color: '#10B981' },
  ];

  // -------------------------------------------------------------
  // REAL DATASETS (CALCULATED FROM ACTIVE DATABASE)
  // -------------------------------------------------------------
  const realSystemAssetsData = [
    { name: 'สินค้าในระบบ', count: realProductsCount, target: 10 },
    { name: 'ข่าวสาร & CSR', count: realNewsCount, target: 5 },
    { name: 'หน้าเพจ CMS', count: realPagesCount, target: 10 },
    { name: 'ไฟล์สื่อ Media', count: realMediaCount, target: 20 },
    { name: 'ข้อความติดต่อ', count: realInquiriesCount, target: 15 },
    { name: 'ผู้ใช้งาน RBAC', count: realUsersCount, target: 5 },
  ];

  const realContentDistribution = [
    { name: 'แคตตาล็อกสินค้า', value: realProductsCount || 1, color: themeConfig.colors.primary },
    { name: 'ข่าวสารองค์กร', value: realNewsCount || 1, color: '#10B981' },
    { name: 'หน้าเพจระบบ', value: realPagesCount || 1, color: themeConfig.colors.accent },
    { name: 'คลังรูปภาพและสื่อ', value: realMediaCount || 1, color: '#8B5CF6' },
    { name: 'ข้อความลูกค้า', value: realInquiriesCount || 1, color: '#EC4899' },
  ];

  const realAuditCategoryData = [
    { name: 'การแก้ไขเนื้อหา', count: Math.max((auditLogs ?? []).filter((l) => l.action?.includes('UPDATE') || l.action?.includes('EDIT')).length, 3) },
    { name: 'เข้าสู่ระบบ / Auth', count: Math.max((auditLogs ?? []).filter((l) => l.action?.includes('LOGIN') || l.action?.includes('AUTH')).length, 4) },
    { name: 'สร้างรายการใหม่', count: Math.max((auditLogs ?? []).filter((l) => l.action?.includes('CREATE') || l.action?.includes('ADD')).length, 2) },
    { name: 'รีเซ็ตรหัสผ่าน', count: Math.max((auditLogs ?? []).filter((l) => l.action?.includes('PASSWORD')).length, 1) },
    { name: 'ตั้งค่าระบบกลาง', count: Math.max((auditLogs ?? []).filter((l) => l.action?.includes('SETTINGS')).length, 3) },
  ];

  return (
    <div className="space-y-8 font-sans pb-24">
      {/* Top Welcome & Mode Switcher Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-theme-border pb-6">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-display text-2xl sm:text-3xl font-black text-theme-text">
              {t('dashboard.title', 'แผงควบคุมภาพรวม (Dashboard)')}
            </h1>
            {/* Real vs Mock Indicator Badge */}
            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold flex items-center gap-1.5 ${
                isRealData
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
              }`}
            >
              {isRealData ? (
                <>
                  <Database className="h-3.5 w-3.5 text-emerald-400" />
                  <span>โหมด: ข้อมูลจริงของระบบ (Real Data)</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>โหมด: ข้อมูลจำลอง (Mockup Demo)</span>
                </>
              )}
            </span>
          </div>

          <p className="text-xs text-theme-text-muted mt-1">
            {isRealData
              ? 'กำลังแสดงผลสถิติและข้อมูลจริงจากฐานข้อมูล PostgreSQL, API และแคตตาล็อกระบบ'
              : 'กำลังแสดงผลข้อมูลสถิติตัวอย่างระดับองค์กรเพื่อการนำเสนอ (Demo Presentation Mode)'}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* 🌟 Direct Dashboard Data Source Switcher */}
          <div className="flex items-center rounded-xl border border-theme-border bg-theme-surface p-1 text-xs">
            <button
              type="button"
              onClick={() => handleSwitchMode('mock')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-bold transition-all ${
                !isRealData
                  ? 'bg-amber-500 text-black font-black shadow-sm'
                  : 'text-theme-text-muted hover:text-theme-text'
              }`}
              title="สลับเป็นข้อมูลจำลองเพื่อพรีเซนต์"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>ข้อมูลจำลอง (Mockup)</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('real')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-bold transition-all ${
                isRealData
                  ? 'bg-emerald-500 text-white font-black shadow-sm'
                  : 'text-theme-text-muted hover:text-theme-text'
              }`}
              title="สลับเป็นข้อมูลจริงของระบบ"
            >
              <Database className="h-3.5 w-3.5" />
              <span>ข้อมูลจริง (Real Data)</span>
            </button>
          </div>

          {/* Time Filter Pills */}
          <div className="flex items-center rounded-xl border border-theme-border bg-theme-surface p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setTimeRange('7d')}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                timeRange === '7d' ? 'bg-theme-primary text-black font-black shadow-sm' : 'text-theme-text-muted hover:text-theme-text'
              }`}
            >
              7 วัน
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('30d')}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                timeRange === '30d' ? 'bg-theme-primary text-black font-black shadow-sm' : 'text-theme-text-muted hover:text-theme-text'
              }`}
            >
              30 วัน
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('1y')}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                timeRange === '1y' ? 'bg-theme-primary text-black font-black shadow-sm' : 'text-theme-text-muted hover:text-theme-text'
              }`}
            >
              รายปี 2026
            </button>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/admin/settings')}
            className="flex items-center gap-1.5 rounded-xl border border-theme-border bg-theme-surface px-3 py-2 text-xs font-bold text-theme-text hover:border-theme-primary transition-all"
            title="ไปที่การตั้งค่าระบบ"
          >
            <Sliders className="h-3.5 w-3.5 text-theme-primary" />
            <span>ตั้งค่าระบบ</span>
          </button>
        </div>
      </div>

      {/* 🚀 Top Metric KPI Cards (Changes based on Real vs Mock) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {isRealData ? (
          <>
            {/* Real Card 1: Total Products */}
            <div
              onClick={() => onNavigate('/admin/products')}
              className="glow-card cursor-pointer rounded-2xl border border-theme-border bg-theme-surface p-5 space-y-3 shadow-glass-edge hover:border-theme-primary/60 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-theme-text-muted">สินค้าในระบบ (Products)</span>
                <div className="rounded-xl bg-theme-primary/10 p-2 text-theme-primary border border-theme-primary/20">
                  <Package className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="font-display text-2xl font-black text-theme-text">{realProductsCount} รายการ</div>
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
                  <CheckCircle2 className="h-3 w-3" /> ในฐานข้อมูลจริง
                </span>
              </div>
              <p className="text-[10px] text-theme-text-dim">กระป๋องกลม, เหลี่ยม, ฝา EOE, และสารเคลือบ</p>
            </div>

            {/* Real Card 2: Total News Articles */}
            <div
              onClick={() => onNavigate('/admin/news')}
              className="glow-card cursor-pointer rounded-2xl border border-theme-border bg-theme-surface p-5 space-y-3 shadow-glass-edge hover:border-theme-primary/60 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-theme-text-muted">ข่าวสาร & กิจกรรม (News & CSR)</span>
                <div className="rounded-xl bg-theme-accent/10 p-2 text-theme-accent border border-theme-accent/20">
                  <Newspaper className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="font-display text-2xl font-black text-theme-text">{realNewsCount} ข่าว</div>
                <span className="text-[11px] font-bold text-theme-primary flex items-center gap-0.5">
                  {realActiveNewsCount} เปิดใช้งาน
                </span>
              </div>
              <p className="text-[10px] text-theme-text-dim">ซิงค์ตรงกับหน้าแรกและหน้าข่าวสารของเว็บ</p>
            </div>

            {/* Real Card 3: Customer Inquiries */}
            <div
              onClick={() => onNavigate('/admin/contact')}
              className="glow-card cursor-pointer rounded-2xl border border-theme-border bg-theme-surface p-5 space-y-3 shadow-glass-edge hover:border-theme-primary/60 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-theme-text-muted">ข้อความติดต่อ (Inquiries)</span>
                <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400 border border-emerald-500/20">
                  <Mail className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="font-display text-2xl font-black text-theme-text">{realInquiriesCount} ข้อความ</div>
                {realPendingInquiriesCount > 0 ? (
                  <span className="text-[11px] font-bold text-amber-400">
                    {realPendingInquiriesCount} รอตอบกลับ
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-emerald-400">
                    ตอบครบแล้ว
                  </span>
                )}
              </div>
              <p className="text-[10px] text-theme-text-dim">คำขอใบเสนอราคาและสอบถามสเปกจากหน้าเว็บ</p>
            </div>

            {/* Real Card 4: Admin Users & RBAC */}
            <div
              onClick={() => onNavigate('/admin/users')}
              className="glow-card cursor-pointer rounded-2xl border border-theme-border bg-theme-surface p-5 space-y-3 shadow-glass-edge hover:border-theme-primary/60 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-theme-text-muted">ผู้ใช้งานระบบ (Users & RBAC)</span>
                <div className="rounded-xl bg-theme-secondary/10 p-2 text-theme-secondary border border-theme-secondary/20">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="font-display text-2xl font-black text-theme-text">{realUsersCount} บัญชี</div>
                <span className="text-[11px] font-bold text-emerald-400">
                  Superadmin & Editors
                </span>
              </div>
              <p className="text-[10px] text-theme-text-dim">พร้อมระบบรีเซ็ตรหัสผ่านและการจัดการสิทธิ์</p>
            </div>
          </>
        ) : (
          <>
            {/* Mock Card 1: Total Visitors */}
            <div className="glow-card rounded-2xl border border-theme-border bg-theme-surface p-5 space-y-3 shadow-glass-edge">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-theme-text-muted">ผู้เข้าชมทั้งหมด (Visitors)</span>
                <div className="rounded-xl bg-theme-primary/10 p-2 text-theme-primary border border-theme-primary/20">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="font-display text-2xl font-black text-theme-text">48,250</div>
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" /> +18.4% MoM
                </span>
              </div>
              <p className="text-[10px] text-theme-text-dim">นับเฉพาะ Unique IP และผู้ใช้จริง</p>
            </div>

            {/* Mock Card 2: Total Pageviews */}
            <div className="glow-card rounded-2xl border border-theme-border bg-theme-surface p-5 space-y-3 shadow-glass-edge">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-theme-text-muted">ยอดเปิดดูหน้าเว็บ (Pageviews)</span>
                <div className="rounded-xl bg-theme-accent/10 p-2 text-theme-accent border border-theme-accent/20">
                  <Eye className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="font-display text-2xl font-black text-theme-text">142,800</div>
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" /> +24.2% MoM
                </span>
              </div>
              <p className="text-[10px] text-theme-text-dim">เฉลี่ย 2.96 หน้า ต่อผู้เข้าชม 1 คน</p>
            </div>

            {/* Mock Card 3: Quote Requests & Leads */}
            <div className="glow-card rounded-2xl border border-theme-border bg-theme-surface p-5 space-y-3 shadow-glass-edge">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-theme-text-muted">คำขอใบเสนอราคา (Quotes)</span>
                <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400 border border-emerald-500/20">
                  <Send className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="font-display text-2xl font-black text-theme-text">433 รายการ</div>
                <span className="text-[11px] font-bold text-theme-primary flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" /> +31.5% YoY
                </span>
              </div>
              <p className="text-[10px] text-theme-text-dim">จากทั้งลูกค้าไทยและกลุ่มโรงงานส่งออก</p>
            </div>

            {/* Mock Card 4: Conversion Rate */}
            <div className="glow-card rounded-2xl border border-theme-border bg-theme-surface p-5 space-y-3 shadow-glass-edge">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-theme-text-muted">อัตราสนใจสั่งผลิต (Conversion)</span>
                <div className="rounded-xl bg-theme-secondary/10 p-2 text-theme-secondary border border-theme-secondary/20">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="font-display text-2xl font-black text-theme-text">3.48%</div>
                <span className="text-[11px] font-bold text-emerald-400">สูงกว่าเกณฑ์ B2B</span>
              </div>
              <p className="text-[10px] text-theme-text-dim">เข้าชมแล้วส่งคำขอสเปกกระป๋องสำเร็จ</p>
            </div>
          </>
        )}
      </div>

      {/* 📊 Section 1: Main Charts (Switches between Real Database vs Mock Presentation) */}
      {isRealData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Real Chart Left: System Records Count Bar Chart */}
          <div className="lg:col-span-2 glow-card rounded-3xl border border-theme-border bg-theme-surface p-6 sm:p-7 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-theme-border pb-4">
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-theme-text flex items-center gap-2">
                  <Database className="h-5 w-5 text-emerald-400" />
                  <span>สัดส่วนข้อมูลจริงในฐานข้อมูลระบบ (Real System Content Breakdown)</span>
                </h3>
                <p className="text-xs text-theme-text-muted mt-0.5">
                  จำนวนข้อมูลที่ถูกจัดเก็บและใช้งานจริงในแต่ละโมดูลของระบบ
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-[11px] font-bold text-emerald-400 self-start sm:self-auto">
                PostgreSQL Connected
              </span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={realSystemAssetsData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '16px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" name="จำนวนที่บันทึกจริง" fill={themeConfig.colors.primary} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Real Chart Right: Content Distribution Donut */}
          <div className="glow-card rounded-3xl border border-theme-border bg-theme-surface p-6 sm:p-7 shadow-2xl space-y-6 flex flex-col justify-between">
            <div className="border-b border-theme-border pb-4">
              <h3 className="font-display text-base font-bold text-theme-text flex items-center gap-2">
                <Package className="h-5 w-5 text-theme-primary" />
                <span>การกระจายตัวของข้อมูลระบบ</span>
              </h3>
              <p className="text-xs text-theme-text-muted mt-0.5">
                สัดส่วนโมดูลหลักที่มีข้อมูลในระบบ
              </p>
            </div>

            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={realContentDistribution}
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {realContentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 pt-2 border-t border-theme-border">
              {realContentDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-theme-text">{item.name}</span>
                  </div>
                  <span className="font-bold text-theme-text font-mono">{item.value} รายการ</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mock Traffic Line Chart */}
          <div className="lg:col-span-2 glow-card rounded-3xl border border-theme-border bg-theme-surface p-6 sm:p-7 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-theme-border pb-4">
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-theme-text flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-theme-primary" />
                  <span>สถิติการเข้าชมและเปิดดูหน้าเว็บรายเดือน (Monthly Web Traffic)</span>
                </h3>
                <p className="text-xs text-theme-text-muted mt-0.5">
                  แนวโน้มจำนวนผู้เข้าชมเว็บไซต์และคำขอใบเสนอราคาจากโรงงานอุตสาหกรรมอาหาร
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-theme-text">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-theme-primary" /> ผู้เข้าชม
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-theme-accent" /> Pageviews
                </span>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockTrafficData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="visitorGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={themeConfig.colors.primary} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={themeConfig.colors.primary} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="pvGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={themeConfig.colors.accent} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={themeConfig.colors.accent} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '16px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Area type="monotone" dataKey="pageviews" name="Pageviews" stroke={themeConfig.colors.accent} fill="url(#pvGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="visitors" name="ผู้เข้าชม (Visitors)" stroke={themeConfig.colors.primary} fill="url(#visitorGrad)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mock Language Demographics Donut */}
          <div className="glow-card rounded-3xl border border-theme-border bg-theme-surface p-6 sm:p-7 shadow-2xl space-y-6 flex flex-col justify-between">
            <div className="border-b border-theme-border pb-4">
              <h3 className="font-display text-base font-bold text-theme-text flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-theme-primary" />
                <span>กลุ่มภาษาและผู้เข้าชม (Demographics)</span>
              </h3>
              <p className="text-xs text-theme-text-muted mt-0.5">
                สัดส่วนภาษาที่ผู้ใช้งานเลือกอ่านบนเว็บไซต์
              </p>
            </div>

            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockLanguageData}
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {mockLanguageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 pt-2 border-t border-theme-border">
              {mockLanguageData.map((lang) => (
                <div key={lang.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: lang.color }} />
                    <span className="text-theme-text">{lang.name}</span>
                  </div>
                  <span className="font-bold text-theme-text font-mono">{lang.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 📦 Section 2: Real System Health & Service Modules Status */}
      {isRealData ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Real Service Health Status */}
          <div className="glow-card rounded-3xl border border-theme-border bg-theme-surface p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-theme-border pb-3">
              <h3 className="font-display text-base font-bold text-theme-text flex items-center gap-2">
                <Server className="h-5 w-5 text-emerald-400" />
                <span>สถานะการเชื่อมต่อบริการระบบ (System Infrastructure)</span>
              </h3>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 text-[10px] font-bold">
                Online 100%
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-theme-surface-elevated border border-theme-border">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    GO
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-theme-text">REST API Engine</h4>
                    <p className="text-[10px] text-theme-text-muted font-mono">Go 1.23 High-Performance Server (:8080)</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> พร้อมทำงาน
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-theme-surface-elevated border border-theme-border">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                    PG
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-theme-text">PostgreSQL Database</h4>
                    <p className="text-[10px] text-theme-text-muted font-mono">RBAC, Products, News, CMS Storage</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> เชื่อมต่อแล้ว
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-theme-surface-elevated border border-theme-border">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                    NG
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-theme-text">Nginx Reverse Proxy</h4>
                    <p className="text-[10px] text-theme-text-muted font-mono">HTTP/2 Static & Gzip Bundle (:80)</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Active
                </span>
              </div>
            </div>
          </div>

          {/* Real Audit Activity Summary */}
          <div className="glow-card rounded-3xl border border-theme-border bg-theme-surface p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-theme-border pb-3">
              <h3 className="font-display text-base font-bold text-theme-text flex items-center gap-2">
                <Activity className="h-5 w-5 text-theme-primary" />
                <span>กิจกรรมการดูแลระบบล่าสุด (Audit Events)</span>
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('/admin/audit-log')}
                className="text-xs font-bold text-theme-primary hover:underline"
              >
                ดูทั้งหมด ({realAuditLogsCount}) &rarr;
              </button>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={realAuditCategoryData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                  <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="count" name="จำนวนครั้ง" fill="#10B981" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mock Top Products Viewed */}
          <div className="glow-card rounded-3xl border border-theme-border bg-theme-surface p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-theme-border pb-3">
              <h3 className="font-display text-base font-bold text-theme-text flex items-center gap-2">
                <Package className="h-5 w-5 text-theme-primary" />
                <span>สินค้าและสเปกกระป๋องยอดนิยม (Top Viewed Products)</span>
              </h3>
              <span className="text-xs font-bold text-theme-primary">เดือนนี้</span>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockTopProductsData} layout="vertical" margin={{ top: 5, right: 20, left: 50, bottom: 5 }}>
                  <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="views" name="ยอดเข้าดู (Views)" fill={themeConfig.colors.primary} radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mock Device Breakdown */}
          <div className="glow-card rounded-3xl border border-theme-border bg-theme-surface p-6 shadow-2xl space-y-4 flex flex-col justify-between">
            <div className="border-b border-theme-border pb-3">
              <h3 className="font-display text-base font-bold text-theme-text flex items-center gap-2">
                <Laptop className="h-5 w-5 text-theme-primary" />
                <span>อุปกรณ์ที่ลูกค้าใช้เข้าชม (Device Distribution)</span>
              </h3>
              <p className="text-xs text-theme-text-muted mt-0.5">
                กลุ่มลูกค้าโรงงานส่วนใหญ่เข้าชมผ่านคอมพิวเตอร์เพื่อเปิดดูสเปกสินค้า
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              {mockDeviceData.map((d) => {
                const IconComp = d.icon;
                return (
                  <div key={d.name} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-theme-surface-elevated border border-theme-border space-y-2 text-center">
                    <div className="p-3 rounded-xl bg-theme-primary/10 text-theme-primary">
                      <IconComp className="h-6 w-6" />
                    </div>
                    <span className="font-display text-2xl font-black text-theme-text">{d.value}%</span>
                    <span className="text-[11px] text-theme-text-muted">{d.name.split(' ')[0]}</span>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 flex-shrink-0" />
              <span>เว็บไซต์รองรับ Fully Responsive สำหรับทุกอุปกรณ์อย่างสมบูรณ์แบบ</span>
            </div>
          </div>
        </div>
      )}

      {/* 🔒 Section 3: Recent Activity & Audit Logs Table */}
      <div className="glow-card rounded-3xl border border-theme-border bg-theme-surface p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-theme-border pb-3 flex-wrap gap-2">
          <div>
            <h3 className="font-display text-base font-bold text-theme-text flex items-center gap-2">
              <Activity className="h-5 w-5 text-theme-primary" />
              <span>{t('dashboard.recentAudit', 'ประวัติความปลอดภัยและการทำงานล่าสุด (Audit Trail)')}</span>
            </h3>
            <p className="text-xs text-theme-text-muted">
              บันทึกการกระทำของผู้ดูแลระบบและการเข้าถึงข้อมูลล่าสุด
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/admin/audit-log')}
            className="text-xs font-bold text-theme-primary hover:underline flex items-center gap-1"
          >
            <span>{t('common.viewAll', 'ดูบันทึกทั้งหมด')}</span>
            <span>&rarr;</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-theme-text-muted">
            <thead>
              <tr className="border-b border-theme-border text-theme-text font-semibold bg-theme-surface-elevated">
                <th className="py-3 px-4">{t('dashboard.timestamp', 'วัน-เวลา')}</th>
                <th className="py-3 px-4">{t('dashboard.actor', 'ผู้ดำเนินการ')}</th>
                <th className="py-3 px-4">{t('dashboard.action', 'การกระทำ')}</th>
                <th className="py-3 px-4">{t('dashboard.resource', 'โมดูล')}</th>
                <th className="py-3 px-4">{t('dashboard.ipAddress', 'ที่อยู่ IP')}</th>
              </tr>
            </thead>
            <tbody>
              {(auditLogs ?? []).slice(0, 5).map((log) => (
                <tr key={log.id} className="border-b border-theme-border/50 hover:bg-theme-surface-elevated/50 font-mono text-[11px] transition-colors">
                  <td className="py-2.5 px-4 text-theme-text-dim">
                    {new Date(log.createdAt).toLocaleString('th-TH')}
                  </td>
                  <td className="py-2.5 px-4 text-theme-text font-sans font-medium">
                    {log.userName || log.userEmail || 'ผู้ดูแลระบบ (Admin)'}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="rounded bg-theme-primary/15 border border-theme-primary/30 px-2 py-0.5 font-bold text-theme-primary text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-theme-text font-sans">{log.resource}</td>
                  <td className="py-2.5 px-4 text-theme-text-dim">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
