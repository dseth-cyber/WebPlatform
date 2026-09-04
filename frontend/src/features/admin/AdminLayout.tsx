import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  FileText,
  Package,
  Image,
  Settings,
  Users,
  History,
  Trash2,
  BookOpen,
  LogOut,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Menu,
  X,
  Palette,
} from 'lucide-react';
import { LanguageSwitcher } from '../../components/layout/LanguageSwitcher';
import { useTheme } from '../../theme/ThemeProvider';
import { useSiteContent } from '../../hooks/useSiteContent';

interface AdminLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const ThemeToggleButton: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'DARK') setTheme('LIGHT');
    else if (theme === 'LIGHT') setTheme('MODERN');
    else setTheme('DARK');
  };

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className="flex items-center gap-1.5 rounded-xl border border-theme-border bg-theme-surface px-3 py-1.5 text-xs font-semibold text-theme-text hover:border-theme-primary transition-colors"
      title={`Theme: ${theme}`}
    >
      <Palette className="h-3.5 w-3.5 text-theme-primary" />
      <span className="hidden sm:inline">{theme}</span>
    </button>
  );
};

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentPath,
  onNavigate,
  onLogout,
  children,
}) => {
  const { t } = useTranslation();
  const { settings } = useSiteContent();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contentMenuOpen, setContentMenuOpen] = useState(true);

  const isContentActive =
    currentPath.startsWith('/admin/pages') ||
    currentPath.startsWith('/admin/about') ||
    currentPath.startsWith('/admin/products') ||
    currentPath.startsWith('/admin/services') ||
    currentPath.startsWith('/admin/technology') ||
    currentPath.startsWith('/admin/sustainability') ||
    currentPath.startsWith('/admin/careers') ||
    currentPath.startsWith('/admin/news') ||
    currentPath.startsWith('/admin/contact');

  const contentSubmenu = [
    { label: t('admin.menuHome', 'หน้าแรก'), path: '/admin/pages' },
    { label: t('admin.menuAbout', 'เกี่ยวกับเรา'), path: '/admin/about' },
    { label: t('admin.menuProducts', 'สินค้า'), path: '/admin/products' },
    { label: t('admin.menuServices', 'บริการ'), path: '/admin/services' },
    { label: t('admin.menuTechnology', 'เทคโนโลยี'), path: '/admin/technology' },
    { label: t('admin.menuSustainability', 'ความยั่งยืน'), path: '/admin/sustainability' },
    { label: t('admin.menuCareers', 'สมัครงาน'), path: '/admin/careers' },
    { label: t('admin.menuNews', 'ข่าวสาร'), path: '/admin/news' },
    { label: t('admin.menuContact', 'ติดต่อเรา'), path: '/admin/contact' },
  ];

  const getNavLinkClass = (isActive: boolean) =>
    `relative flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all duration-200 text-xs font-semibold ${
      isActive
        ? 'bg-theme-primary/15 text-theme-primary font-bold border border-theme-primary/40 shadow-[0_0_12px_var(--color-primary-glow)] scale-[1.01]'
        : 'text-theme-text-muted hover:bg-theme-surface hover:text-theme-text'
    }`;

  return (
    <div className="h-screen w-screen overflow-hidden bg-theme-bg text-theme-text font-sans flex flex-col lg:flex-row transition-colors">
      {/* Mobile Top Navbar */}
      <div className="lg:hidden flex items-center justify-between border-b border-theme-border bg-theme-surface p-4 flex-shrink-0 z-40">
        <div className="flex items-center gap-2">
          {settings.logoImage ? (
            <img
              src={settings.logoImage}
              alt="Logo"
              className="h-8 w-auto max-w-[80px] object-contain rounded"
            />
          ) : (
            <div className="relative flex h-8 w-8 items-center justify-center">
              <div className="absolute inset-0 rotate-45 rounded-md border border-theme-primary bg-gradient-to-br from-slate-900 to-black" />
              <span className="relative z-10 font-display font-black text-xs text-theme-primary">
                {settings.logoText || 'LC'}
              </span>
            </div>
          )}
          <span className="font-display font-bold text-sm text-theme-text">{t('admin.adminPanel', 'ADMIN PANEL')}</span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggleButton />
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg border border-theme-border p-2 text-theme-text"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Admin Sidebar: Fixed/Locked to height, stays in place while main content scrolls */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col justify-between border-r border-theme-border bg-theme-surface/95 backdrop-blur-md p-4 transition-all duration-300 lg:static lg:w-64 lg:h-screen flex-shrink-0 shadow-2xl lg:shadow-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Section */}
        <div className="space-y-4 flex-1 overflow-y-auto pr-1">
          {/* Logo & Brand */}
          <div className="flex items-center justify-between border-b border-theme-border pb-3">
            <div className="flex items-center gap-2.5">
              {settings.logoImage ? (
                <img
                  src={settings.logoImage}
                  alt="Logo"
                  className="h-8 w-auto max-w-[100px] object-contain rounded"
                />
              ) : (
                <div className="relative flex h-8 w-8 items-center justify-center">
                  <div className="absolute inset-0 rotate-45 rounded-md border border-theme-primary bg-gradient-to-br from-slate-900 to-black" />
                  <span className="relative z-10 font-display font-black text-xs text-theme-primary">
                    {settings.logoText || 'LC'}
                  </span>
                </div>
              )}
              <div>
                <h3 className="font-display font-black text-xs text-theme-text tracking-wider">
                  {t('admin.adminPanel', 'ADMIN PANEL')}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="rounded-lg p-1.5 text-theme-text-muted hover:text-theme-primary hover:bg-theme-surface transition-colors"
              title={t('admin.viewPublicSite', 'ดูหน้าเว็บไซต์จริง')}
            >
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="flex items-center gap-3 rounded-2xl border border-theme-border bg-theme-surface p-3">
            <div className="h-9 w-9 rounded-full bg-theme-primary/20 border border-theme-primary/40 flex items-center justify-center text-xs font-bold text-theme-primary font-mono">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-xs text-theme-text truncate">{t('admin.administrator', 'Administrator')}</h4>
              <span className="text-[10px] text-theme-primary font-semibold block">{t('admin.superAdmin', 'Super Admin')}</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5 text-xs font-semibold">
            {/* Dashboard */}
            <button
              type="button"
              onClick={() => onNavigate('/admin')}
              className={getNavLinkClass(currentPath === '/admin')}
            >
              <LayoutDashboard className="h-4 w-4 text-theme-primary" />
              <span>{t('admin.dashboard', 'แดชบอร์ด')}</span>
            </button>

            {/* Collapsible Content Management Menu */}
            <div>
              <button
                type="button"
                onClick={() => setContentMenuOpen(!contentMenuOpen)}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 transition-all text-xs font-semibold ${
                  isContentActive
                    ? 'text-theme-primary font-bold bg-theme-primary/10 border border-theme-primary/30'
                    : 'text-theme-text-muted hover:bg-theme-surface hover:text-theme-text'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-theme-primary" />
                  <span>{t('admin.contentManagement', 'จัดการเนื้อหา')}</span>
                </div>
                {contentMenuOpen ? <ChevronDown className="h-3.5 w-3.5 text-theme-primary" /> : <ChevronRight className="h-3.5 w-3.5" />}
              </button>

              {contentMenuOpen && (
                <div className="pl-6 pt-1 space-y-1">
                  {contentSubmenu.map((sub) => {
                    const isSubActive =
                      currentPath === sub.path ||
                      (sub.path === '/admin/products' && currentPath.startsWith('/admin/products')) ||
                      (sub.path === '/admin/news' && currentPath.startsWith('/admin/news'));

                    return (
                      <button
                        key={sub.path}
                        type="button"
                        onClick={() => onNavigate(sub.path)}
                        className={`block w-full text-left rounded-lg px-3 py-1.5 text-[11px] transition-all duration-200 ${
                          isSubActive
                            ? 'bg-theme-primary/20 text-theme-primary font-bold border-l-2 border-theme-primary pl-3'
                            : 'text-theme-text-muted hover:text-theme-primary hover:bg-theme-surface/60'
                        }`}
                      >
                        • {sub.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Media */}
            <button
              type="button"
              onClick={() => onNavigate('/admin/media')}
              className={getNavLinkClass(currentPath === '/admin/media')}
            >
              <Image className="h-4 w-4 text-theme-primary" />
              <span>{t('admin.media', 'คลังไฟล์สื่อ')}</span>
            </button>

            {/* Settings */}
            <button
              type="button"
              onClick={() => onNavigate('/admin/settings')}
              className={getNavLinkClass(currentPath === '/admin/settings')}
            >
              <Settings className="h-4 w-4 text-theme-primary" />
              <span>{t('admin.settings', 'ตั้งค่าองค์กรและระบบ')}</span>
            </button>

            {/* Users */}
            <button
              type="button"
              onClick={() => onNavigate('/admin/users')}
              className={getNavLinkClass(currentPath === '/admin/users')}
            >
              <Users className="h-4 w-4 text-theme-primary" />
              <span>{t('admin.users', 'จัดการผู้ใช้ & RBAC')}</span>
            </button>

            {/* Audit Log */}
            <button
              type="button"
              onClick={() => onNavigate('/admin/audit-log')}
              className={getNavLinkClass(currentPath === '/admin/audit-log')}
            >
              <History className="h-4 w-4 text-theme-primary" />
              <span>{t('admin.auditLog', 'ประวัติการทำงาน')}</span>
            </button>

            {/* Trash */}
            <button
              type="button"
              onClick={() => onNavigate('/admin/trash')}
              className={getNavLinkClass(currentPath === '/admin/trash')}
            >
              <Trash2 className="h-4 w-4 text-theme-primary" />
              <span>{t('admin.trash', 'ถังขยะและกู้คืน')}</span>
            </button>

            {/* Manual */}
            <button
              type="button"
              onClick={() => onNavigate('/admin/manual')}
              className={getNavLinkClass(currentPath === '/admin/manual')}
            >
              <BookOpen className="h-4 w-4 text-theme-primary" />
              <span>{t('admin.manual', 'คู่มือการใช้งาน')}</span>
            </button>
          </nav>
        </div>

        {/* Footer Sidebar (Always pinned at bottom) */}
        <div className="pt-3 border-t border-theme-border space-y-2.5 flex-shrink-0">
          <div className="flex items-center justify-between gap-2">
            <LanguageSwitcher dropDirection="up" align="left" />
            <ThemeToggleButton />
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>{t('admin.logout', 'ออกจากระบบ')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport: Scrolls independently */}
      <main className="flex-1 h-[calc(100vh-65px)] lg:h-full overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-full focus:outline-none">
        {children}
      </main>
    </div>
  );
};
