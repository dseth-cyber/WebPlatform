import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Menu, X, Lock, Palette } from 'lucide-react';
import { useSiteContent } from '../../hooks/useSiteContent';
import { useTheme } from '../../theme/ThemeProvider';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const { t, i18n } = useTranslation();
  const { settings } = useSiteContent();
  const { theme, setTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');

  const isHome = currentPath === '/' || currentPath === '';
  const isTransparentOverDark = isHome && !isScrolled;

  // Detect window scroll to style sticky navbar and track active section (ScrollSpy)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (isHome) {
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
        )
          .filter((t) => t.enabled)
          .map((t) => t.key);

        const scrollPosition = window.scrollY + 140;

        for (let i = activeTabs.length - 1; i >= 0; i--) {
          const el = document.getElementById(activeTabs[i]);
          if (el) {
            const top = el.offsetTop;
            if (scrollPosition >= top) {
              setActiveSection(activeTabs[i]);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome, settings.navTabs]);

  const handleNavClick = (path: string) => {
    if (isHome) {
      const sectionId = path === '/' ? 'home' : path.replace('/', '');
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(sectionId);
        setMobileMenuOpen(false);
        return;
      }
    }
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const currentLang = i18n.language || 'th';
  const isEn = currentLang === 'en';

  const navLinks = (settings.navTabs && settings.navTabs.length > 0
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
  )
    .filter((tab) => tab.enabled)
    .map((tab) => ({
      label: isEn ? (tab.labelEn || tab.labelTh) : (tab.labelTh || tab.labelEn),
      path: tab.path,
    }));

  const checkIsActive = (path: string) => {
    if (isHome) {
      const sectionId = path === '/' ? 'home' : path.replace('/', '');
      return activeSection === sectionId;
    }
    return currentPath === path || (path !== '/' && currentPath.startsWith(path));
  };

  // Cycle theme function for public visitors
  const cycleTheme = () => {
    if (theme === 'DARK') setTheme('LIGHT');
    else if (theme === 'LIGHT') setTheme('MODERN');
    else setTheme('DARK');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 font-sans border-none shadow-none ${
        isScrolled
          ? 'bg-theme-bg/85 backdrop-blur-xl'
          : isHome
          ? 'bg-gradient-to-b from-black/80 via-black/25 to-transparent'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Brand Logo & Company Title (Point 1: Supports Custom Uploaded Logo or Dynamic Diamond) */}
          <div
            onClick={() => onNavigate('/')}
            className="flex cursor-pointer items-center gap-3 group"
          >
            {settings.logoImage ? (
              <img
                src={settings.logoImage}
                alt={settings.companyNameTh}
                className="h-11 w-auto max-w-[140px] object-contain rounded-lg drop-shadow-md group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="relative flex h-11 w-11 items-center justify-center">
                <div className="absolute inset-0 rotate-45 rounded-lg border-2 border-theme-primary/90 bg-gradient-to-br from-slate-900 via-slate-800 to-black shadow-lg shadow-theme-primary/30 group-hover:scale-105 transition-transform" />
                <span className="relative z-10 font-display font-black text-sm text-theme-primary tracking-tighter">
                  {settings.logoText || 'LC'}
                </span>
              </div>
            )}

            <div className="flex flex-col">
              <span
                className={`font-display text-sm sm:text-base font-black tracking-wide leading-tight group-hover:text-theme-primary transition-colors ${
                  isTransparentOverDark ? 'text-white drop-shadow-sm' : 'text-theme-text'
                }`}
              >
                {settings.companyNameTh || 'บริษัท ไคโอทรอน เทคโนโลยี จำกัด'}
              </span>
              <span
                className={`text-[10px] sm:text-[11px] font-bold tracking-wider uppercase ${
                  isTransparentOverDark ? 'text-slate-300 drop-shadow-sm' : 'text-theme-text-muted'
                }`}
              >
                {settings.companyNameEn || 'CHIOTRON TECHNOLOGY CO., LTD.'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-4">
            {navLinks.map((link) => {
              const isActive = checkIsActive(link.path);

              return (
                <button
                  key={link.path}
                  type="button"
                  onClick={() => handleNavClick(link.path)}
                  className={`group relative py-2 px-1 text-xs sm:text-sm transition-colors duration-200 ${
                    isActive
                      ? theme === 'MODERN'
                        ? 'text-[#00F0FF] font-bold'
                        : 'text-theme-primary font-bold'
                      : isTransparentOverDark
                      ? 'text-slate-200 hover:text-theme-primary font-medium'
                      : theme === 'LIGHT'
                      ? 'text-slate-600 hover:text-theme-primary font-medium'
                      : 'text-theme-text-muted hover:text-theme-primary font-medium'
                  }`}
                >
                  <span>{link.label}</span>

                  {/* Active Indicator Underline */}
                  {isActive && (
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                        theme === 'MODERN'
                          ? 'bg-[#00F0FF]'
                          : 'bg-theme-primary'
                      }`}
                    />
                  )}

                  {/* Subtle Hover Underline for inactive items */}
                  {!isActive && (
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full ${
                        isTransparentOverDark
                          ? 'bg-white/40'
                          : theme === 'MODERN'
                          ? 'bg-[#00F0FF]/40'
                          : 'bg-theme-primary/40'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Toolbar Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* 1. Theme Switcher */}
            {settings.showThemeSwitcher && (
              <button
                type="button"
                onClick={cycleTheme}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-all duration-200 ${
                  isTransparentOverDark
                    ? 'border border-white/30 bg-transparent text-white hover:border-theme-primary hover:text-theme-primary'
                    : 'border border-theme-border bg-theme-surface/60 text-theme-text hover:border-theme-primary hover:text-theme-primary hover:bg-theme-surface-hover'
                }`}
                title={`Theme: ${theme} (Click to switch)`}
              >
                <Palette className="h-3.5 w-3.5 text-theme-primary" />
                <span className="hidden md:inline">{theme}</span>
              </button>
            )}

            {/* 2. Language Switcher */}
            <LanguageSwitcher isTransparentOverDark={isTransparentOverDark} />

            {/* 3. CMS Admin Login Button */}
            {settings.showCMSButton && (
              <button
                type="button"
                onClick={() => onNavigate('/admin/login')}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold backdrop-blur-md transition-all duration-200 ${
                  isTransparentOverDark
                    ? 'border border-white/30 bg-transparent text-white hover:border-theme-primary hover:text-theme-primary'
                    : 'border border-theme-border bg-theme-surface/60 text-theme-text hover:border-theme-primary hover:text-theme-primary hover:bg-theme-surface-hover'
                }`}
                title="CMS Management Login"
              >
                <Lock className="h-3.5 w-3.5 text-theme-primary" />
                <span className="hidden sm:inline">CMS</span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden rounded-xl p-2 transition-colors ${
                isTransparentOverDark
                  ? 'border border-white/20 bg-transparent text-white hover:border-theme-primary'
                  : 'border border-theme-border bg-theme-surface text-theme-text hover:border-theme-primary'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Down Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-theme-border bg-theme-bg/98 px-4 pt-3 pb-6 space-y-3 backdrop-blur-2xl shadow-2xl">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = checkIsActive(link.path);

              return (
                <button
                  key={link.path}
                  type="button"
                  onClick={() => handleNavClick(link.path)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-colors ${
                    isActive
                      ? theme === 'MODERN'
                        ? 'bg-[#00F0FF]/15 text-[#00F0FF] border-l-4 border-[#00F0FF] font-bold'
                        : 'bg-theme-primary/15 text-theme-primary border-l-4 border-theme-primary font-bold'
                      : theme === 'LIGHT'
                      ? 'text-slate-700 hover:bg-slate-100 hover:text-theme-primary font-medium'
                      : 'text-theme-text hover:bg-theme-surface-hover hover:text-theme-primary font-medium'
                  }`}
                >
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
