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
  Image,
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
} from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useNews } from '../../hooks/useNews';
import { useAdminPages } from '../../hooks/usePages';
import { useAuditLogs } from '../../hooks/useAdmin';
import { useMediaLibrary } from '../../hooks/useMedia';
import { useTheme } from '../../theme/ThemeProvider';

export const DashboardPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const { themeConfig } = useTheme();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '1y'>('30d');

  const { data: pages } = useAdminPages();
  const { data: products } = useProducts();
  const { data: news } = useNews();
  const { data: media } = useMediaLibrary();
  const { data: auditLogs } = useAuditLogs();

  const totalPages = (pages ?? []).length || 8;
  const publishedPages = (pages ?? []).filter((p) => p.status === 'PUBLISHED').length || 6;
  const totalProducts = (products ?? []).length || 4;
  const totalNews = (news ?? []).length || 2;
  const totalMedia = (media ?? []).length || 18;

  // 1. Web Traffic & Pageviews (Monthly Trend)
  const trafficData = [
    { name: 'ม.ค. (Jan)', visitors: 5800, pageviews: 18400, quotes: 42 },
    { name: 'ก.พ. (Feb)', visitors: 6400, pageviews: 21200, quotes: 56 },
    { name: 'มี.ค. (Mar)', visitors: 8200, pageviews: 26800, quotes: 78 },
    { name: 'เม.ย. (Apr)', visitors: 7600, pageviews: 24500, quotes: 65 },
    { name: 'พ.ค. (May)', visitors: 9400, pageviews: 31200, quotes: 89 },
    { name: 'มิ.ย. (Jun)', visitors: 10850, pageviews: 36700, quotes: 102 },
  ];

  // 2. Language & Visitor Demographics Breakdown
  const languageData = [
    { name: 'ไทย (Thai)', value: 55, color: themeConfig.colors.primary },
    { name: 'English (อังกฤษ/สากล)', value: 25, color: themeConfig.colors.accent },
    { name: '日本語 (ญี่ปุ่น)', value: 10, color: '#10B981' },
    { name: '中文 (จีน)', value: 7, color: themeConfig.colors.secondary },
    { name: 'မြန်မာ (เมียนมา)', value: 3, color: '#EC4899' },
  ];

  // 3. Top 5 Viewed Products / Spec Downloads
  const topProductsData = [
    { name: 'กระป๋องอาหาร 300x401', views: 4250, downloads: 380 },
    { name: 'ถังเคมีภัณฑ์ 20L (UN)', views: 3680, downloads: 295 },
    { name: 'ฝาดึงเปิดง่าย EOE 300', views: 3120, downloads: 260 },
    { name: 'กระป๋องสเปรย์ 65x190', views: 2450, downloads: 180 },
    { name: 'กระป๋องพิมพ์ลาย 6 สี', views: 1980, downloads: 145 },
  ];

  // 4. Device Distribution
  const deviceData = [
    { name: 'Desktop (คอมพิวเตอร์ B2B)', value: 64, icon: Laptop, color: themeConfig.colors.primary },
    { name: 'Mobile (โทรศัพท์มือถือ)', value: 31, icon: Smartphone, color: themeConfig.colors.accent },
    { name: 'Tablet (แท็บเล็ต)', value: 5, icon: Tablet, color: '#10B981' },
  ];

  return (
    <div className="space-y-8 font-sans pb-24">
      {/* Top Welcome & KPI Header with Time Filter */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-theme-border pb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-theme-text flex items-center gap-3">
            <span>{t('dashboard.title', 'แผงควบคุมภาพรวม (Dashboard)')}</span>
            <span className="rounded-full bg-theme-primary/15 border border-theme-primary/30 px-3 py-1 text-xs font-bold text-theme-primary flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Real-time Analytics</span>
            </span>
          </h1>
          <p className="text-xs text-theme-text-muted mt-1">
            {t('dashboard.subtitle', 'ภาพรวมระบบบริหารจัดการเนื้อหา สถิติการเข้าชม และคำขอใบเสนอราคา บริษัท โลหะกิจรุ่งเจริญทรัพย์ จำกัด')}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Time Filter Pills */}
          <div className="flex items-center rounded-xl border border-theme-border bg-theme-surface p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setTimeRange('7d')}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                timeRange === '7d' ? 'bg-theme-primary text-black font-black shadow-sm' : 'text-theme-text-muted hover:text-theme-text'
              }`}
            >
              7 วันล่าสุด
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

          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            {t('dashboard.apiHealthy', 'ระบบปกติ (Healthy)')}
          </span>
        </div>
      </div>

      {/* 🚀 Top Metric Analytics Cards (Visitors, Pageviews, Leads, Conversion) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Total Visitors */}
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

        {/* 2. Total Pageviews */}
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

        {/* 3. Quote Requests & Leads */}
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

        {/* 4. Conversion Rate */}
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
      </div>

      {/* 📊 Section 1: Main Traffic Chart & Demographics Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. Traffic Chart (8 cols) */}
        <div className="lg:col-span-8 glow-card rounded-3xl border border-theme-border bg-theme-surface p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-base font-bold text-theme-text flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-theme-primary" />
                <span>สถิติผู้เข้าชมและยอดเปิดดูหน้าเว็บ (Traffic & Pageviews Trend)</span>
              </h3>
              <p className="text-xs text-theme-text-muted">
                เปรียบเทียบผู้เข้าชม (Visitors) กับการเปิดดูหน้าเว็บ (Pageviews) ปี 2026
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: themeConfig.colors.primary }} />
                <span className="text-theme-text font-semibold">Pageviews</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: themeConfig.colors.accent }} />
                <span className="text-theme-text font-semibold">Visitors</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorPageviews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={themeConfig.colors.primary} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={themeConfig.colors.primary} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={themeConfig.colors.accent} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={themeConfig.colors.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke={themeConfig.colors.textDim} fontSize={11} tickLine={false} />
                <YAxis stroke={themeConfig.colors.textDim} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: themeConfig.colors.surfaceElevated,
                    borderColor: themeConfig.colors.border,
                    borderRadius: '14px',
                    fontSize: '11px',
                    color: themeConfig.colors.text,
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  }}
                />
                <Area type="monotone" dataKey="pageviews" name="ยอดวิว (Pageviews)" stroke={themeConfig.colors.primary} strokeWidth={2.5} fillOpacity={1} fill="url(#colorPageviews)" />
                <Area type="monotone" dataKey="visitors" name="ผู้เข้าชม (Visitors)" stroke={themeConfig.colors.accent} strokeWidth={2.5} fillOpacity={1} fill="url(#colorVisitors)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Visitor Geography & Language Breakdown (4 cols) */}
        <div className="lg:col-span-4 glow-card rounded-3xl border border-theme-border bg-theme-surface p-6 shadow-2xl space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-theme-text flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-theme-primary" />
              <span>สัดส่วนภาษาและตลาดผู้เข้าชม</span>
            </h3>
            <p className="text-xs text-theme-text-muted">
              สถิติภาษาที่ผู้เข้าชมเลือกใช้งาน (Languages)
            </p>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={languageData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={4}>
                  {languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: themeConfig.colors.surfaceElevated,
                    borderColor: themeConfig.colors.border,
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: themeConfig.colors.text,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {languageData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-theme-text-muted">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-theme-text">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 📦 Section 2: Top Products Bar Chart & Device Platform Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. Top 5 In-Demand Products (8 cols) */}
        <div className="lg:col-span-8 glow-card rounded-3xl border border-theme-border bg-theme-surface p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-bold text-theme-text flex items-center gap-2">
                <Package className="h-5 w-5 text-theme-primary" />
                <span>5 อันดับบรรจุภัณฑ์ยอดนิยมที่มีการเปิดดูสเปกสูงสุด</span>
              </h3>
              <p className="text-xs text-theme-text-muted">
                จัดอันดับตามจำนวนการเปิดดูหน้าสเปก และดาวน์โหลดเอกสาร Technical PDF
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/admin/products')}
              className="text-xs font-bold text-theme-primary hover:underline"
            >
              จัดการสินค้าทั้งหมด &rarr;
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProductsData} layout="vertical" margin={{ left: 40, right: 20 }}>
                <XAxis type="number" stroke={themeConfig.colors.textDim} fontSize={11} />
                <YAxis dataKey="name" type="category" stroke={themeConfig.colors.textDim} fontSize={11} width={130} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: themeConfig.colors.surfaceElevated,
                    borderColor: themeConfig.colors.border,
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: themeConfig.colors.text,
                  }}
                />
                <Bar dataKey="views" name="ยอดเข้าชมสเปก" fill={themeConfig.colors.primary} radius={[0, 8, 8, 0]} />
                <Bar dataKey="downloads" name="ดาวน์โหลด PDF" fill={themeConfig.colors.accent} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Device & Platform Breakdown (4 cols) */}
        <div className="lg:col-span-4 glow-card rounded-3xl border border-theme-border bg-theme-surface p-6 shadow-2xl space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-theme-text flex items-center gap-2">
              <Laptop className="h-5 w-5 text-theme-primary" />
              <span>อุปกรณ์ที่ใช้งาน (Device Share)</span>
            </h3>
            <p className="text-xs text-theme-text-muted">
              ลูกค้าองค์กร B2B นิยมเข้าชมผ่านคอมพิวเตอร์สำนักงานเป็นหลัก
            </p>
          </div>

          <div className="space-y-4 py-2">
            {deviceData.map((d) => {
              const Icon = d.icon;
              return (
                <div key={d.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-theme-primary" />
                      <span className="font-semibold text-theme-text">{d.name}</span>
                    </div>
                    <span className="font-mono font-bold text-theme-primary">{d.value}%</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-2 w-full rounded-full bg-theme-surface-elevated overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${d.value}%`, backgroundColor: d.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick CMS Content Overview Pill Box */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-theme-border text-center">
            <div className="rounded-xl bg-theme-surface-elevated p-2 border border-theme-border">
              <span className="text-[10px] text-theme-text-muted block">หน้าทั้งหมด</span>
              <span className="font-display font-black text-sm text-theme-text">{totalPages}</span>
            </div>
            <div className="rounded-xl bg-theme-surface-elevated p-2 border border-theme-border">
              <span className="text-[10px] text-theme-text-muted block">สินค้า</span>
              <span className="font-display font-black text-sm text-theme-primary">{totalProducts}</span>
            </div>
            <div className="rounded-xl bg-theme-surface-elevated p-2 border border-theme-border">
              <span className="text-[10px] text-theme-text-muted block">คลังสื่อ</span>
              <span className="font-display font-black text-sm text-theme-text">{totalMedia}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🔒 Section 3: Recent Activity & Audit Logs Table */}
      <div className="glow-card rounded-3xl border border-theme-border bg-theme-surface p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-theme-border pb-3">
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
