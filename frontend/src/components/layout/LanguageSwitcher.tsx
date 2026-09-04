import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Check } from 'lucide-react';

const EXACT_5_LANGUAGES = [
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'jp', name: '日本語', flag: '🇯🇵' },
  { code: 'cn', name: '中文', flag: '🇨🇳' },
  { code: 'mm', name: 'မြန်မာ', flag: '🇲🇲' },
];

export interface LanguageSwitcherProps {
  className?: string;
  isTransparentOverDark?: boolean;
  dropDirection?: 'down' | 'up' | 'auto';
  align?: 'left' | 'right' | 'auto';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  isTransparentOverDark = false,
  dropDirection = 'auto',
  align = 'auto',
}) => {
  const { i18n } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [computedPlacement, setComputedPlacement] = useState<{
    openUp: boolean;
    alignLeft: boolean;
  }>({
    openUp: false,
    alignLeft: false,
  });

  const currentLangCode = i18n.language || 'th';
  const currentLang = EXACT_5_LANGUAGES.find((l) => l.code === currentLangCode) || EXACT_5_LANGUAGES[0];

  useEffect(() => {
    if (dropdownOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      const shouldOpenUp =
        dropDirection === 'up' ||
        (dropDirection === 'auto' && spaceBelow < 260 && spaceAbove > spaceBelow);

      const shouldAlignLeft =
        align === 'left' ||
        (align === 'auto' && (rect.left < 200 || rect.right > window.innerWidth));

      setComputedPlacement({
        openUp: shouldOpenUp,
        alignLeft: shouldAlignLeft,
      });
    }
  }, [dropdownOpen, dropDirection, align]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLanguageChange = (newLang: string) => {
    i18n.changeLanguage(newLang);
    localStorage.setItem('lohakit_language', newLang);
    setDropdownOpen(false);
  };

  const isUp =
    dropDirection === 'up'
      ? true
      : dropDirection === 'down'
      ? false
      : computedPlacement.openUp;

  const isLeft =
    align === 'left'
      ? true
      : align === 'right'
      ? false
      : computedPlacement.alignLeft;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Dynamic Trigger Button */}
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all shadow-none group backdrop-blur-md ${
          isTransparentOverDark
            ? 'border border-white/30 bg-transparent text-white hover:border-theme-primary hover:text-theme-primary hover:bg-white/10'
            : 'border border-theme-border bg-theme-surface/60 text-theme-text hover:border-theme-primary hover:text-theme-primary hover:bg-theme-surface-hover'
        }`}
        title="เลือกภาษา / Change Language"
      >
        <span className="text-sm leading-none">{currentLang.flag}</span>
        <span
          className={`font-mono text-xs font-black tracking-wider uppercase group-hover:text-theme-primary transition-colors ${
            isTransparentOverDark ? 'text-white' : 'text-theme-text'
          }`}
        >
          {currentLang.code}
        </span>
        <ChevronDown
          className={`h-3 w-3 group-hover:text-theme-primary transition-transform duration-200 ${
            isTransparentOverDark ? 'text-slate-300' : 'text-theme-text-muted'
          } ${dropdownOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* 5-Language Dropdown Popover */}
      {dropdownOpen && (
        <div
          className={`absolute z-50 w-48 rounded-2xl border border-theme-border bg-theme-surface/98 backdrop-blur-2xl p-1.5 shadow-2xl space-y-1 animate-in fade-in duration-150 ${
            isUp ? 'bottom-full mb-2' : 'top-full mt-2'
          } ${isLeft ? 'left-0' : 'right-0'}`}
        >
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-theme-text-dim border-b border-theme-border">
            เลือกภาษา (5 Languages)
          </div>

          {EXACT_5_LANGUAGES.map((lang) => {
            const isSelected = currentLangCode === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex w-full items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all ${
                  isSelected
                    ? 'bg-theme-primary/15 text-theme-primary font-bold border border-theme-primary/30'
                    : 'text-theme-text hover:bg-theme-surface-hover hover:text-theme-primary'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{lang.flag}</span>
                  <span className="font-mono font-bold uppercase text-[11px]">
                    {lang.code}
                  </span>
                  <span className="text-[11px] text-theme-text-muted">{lang.name}</span>
                </div>

                {isSelected && <Check className="h-3.5 w-3.5 text-theme-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
