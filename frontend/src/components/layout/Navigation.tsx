import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronRight, ShieldCheck, Factory, FileText, Layers, PhoneCall } from 'lucide-react';

interface NavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPath, onNavigate }) => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.products'), path: '/products' },
    { label: t('nav.services'), path: '/services' },
    { label: t('nav.technology'), path: '/technology' },
    { label: t('nav.quality'), path: '/quality' },
    { label: t('nav.sustainability'), path: '/sustainability' },
    { label: t('nav.certifications'), path: '/certifications' },
    { label: t('nav.news'), path: '/news' },
    { label: t('nav.contact'), path: '/contact' },
  ];

  const handleItemClick = (path: string) => {
    onNavigate(path);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation Bar */}
      <nav className="hidden lg:flex items-center gap-1 font-sans">
        {navItems.map((item) => {
          const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
          return (
            <button
              key={item.path}
              type="button"
              onClick={() => handleItemClick(item.path)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-theme-primary/15 text-theme-primary font-bold shadow-sm'
                  : 'text-theme-text-muted hover:bg-theme-surface hover:text-theme-text'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Mobile Hamburger Toggle Button */}
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="flex lg:hidden items-center justify-center rounded-lg border border-theme-border bg-theme-surface p-2 text-theme-text hover:bg-theme-surface-hover"
        aria-label="Toggle Navigation Menu"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 top-[70px] z-40 lg:hidden bg-black/80 backdrop-blur-xl animate-in slide-in-from-top duration-200">
          <div className="h-full overflow-y-auto border-t border-theme-border bg-theme-surface-elevated p-6 space-y-1">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleItemClick(item.path)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-theme-primary/20 text-theme-primary font-bold'
                      : 'text-theme-text hover:bg-theme-surface'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </button>
              );
            })}

            <div className="pt-6 border-t border-theme-border mt-4">
              <button
                type="button"
                onClick={() => handleItemClick('/contact')}
                className="w-full rounded-xl bg-theme-primary py-3 text-center text-sm font-bold text-black shadow-lg shadow-theme-primary/30"
              >
                {t('nav.quote')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
