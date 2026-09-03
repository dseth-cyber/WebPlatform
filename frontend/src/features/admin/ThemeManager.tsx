import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme/ThemeProvider';
import { THEME_CONFIGS } from '../../theme/themeConfig';
import { ThemeMode } from '../../types/theme';
import { Palette, Check, Moon, Sun, Sparkles } from 'lucide-react';

export const ThemeManager: React.FC = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  const themes: { id: ThemeMode; name: string; subtitle: string; icon: React.ReactNode; bg: string }[] = [
    {
      id: 'DARK',
      name: 'Industrial Dark Steel',
      subtitle: 'Brushed Charcoal & Polished Chrome (ความคมเข้มสไตล์อุตสาหกรรมโลหะ)',
      icon: <Moon className="h-6 w-6 text-blue-400" />,
      bg: 'bg-[#0B0F17] border-gray-700',
    },
    {
      id: 'LIGHT',
      name: 'Corporate Clean Titanium',
      subtitle: 'Precision Silver & Crisp White (โทนสีสว่าง สะอาด เรียบหรูแบบสากล)',
      icon: <Sun className="h-6 w-6 text-amber-500" />,
      bg: 'bg-white border-slate-200 text-slate-900',
    },
    {
      id: 'MODERN',
      name: 'Cybernetic Metal Precision',
      subtitle: 'Deep Void Blue & Electric Cyan (นีออนเมทัลลิกล้ำสมัย ไฮเทค)',
      icon: <Sparkles className="h-6 w-6 text-cyan-400" />,
      bg: 'bg-[#070B14] border-cyan-500/40 shadow-neon-glow',
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      <div className="border-b border-theme-border pb-6">
        <h1 className="font-display text-2xl font-black text-theme-text flex items-center gap-2">
          <Palette className="h-6 w-6 text-theme-primary" />
          <span>{t('admin.themes')}</span>
        </h1>
        <p className="text-xs text-theme-text-muted mt-1">
          สลับธีมของทั้งเว็บไซต์แบบ Real-time โดยไม่ต้องรีโหลดหน้าเว็บ ทุกคอมโพเนนต์จะดึง Theme Tokens อัตโนมัติ
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {themes.map((item) => {
          const isActive = theme === item.id;
          const config = THEME_CONFIGS[item.id];

          return (
            <div
              key={item.id}
              onClick={() => setTheme(item.id)}
              className={`cursor-pointer rounded-3xl border-2 p-6 shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-6 ${
                item.bg
              } ${
                isActive
                  ? 'border-theme-primary scale-105 ring-4 ring-theme-primary/30'
                  : 'opacity-70 hover:opacity-100 hover:border-theme-border-highlight'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="rounded-2xl bg-black/40 p-3 border border-white/10">
                    {item.icon}
                  </div>
                  {isActive && (
                    <span className="flex items-center gap-1 rounded-full bg-theme-primary/20 border border-theme-primary/40 px-3 py-1 text-xs font-bold text-theme-primary">
                      <Check className="h-3.5 w-3.5" />
                      Active
                    </span>
                  )}
                </div>

                <h3 className="font-display text-lg font-bold text-theme-text">{item.name}</h3>
                <p className="text-xs text-theme-text-muted leading-relaxed">{item.subtitle}</p>
              </div>

              <div className="space-y-2 pt-4 border-t border-theme-border/50 text-[11px] font-mono">
                <div className="flex justify-between">
                  <span className="text-theme-text-dim">Background:</span>
                  <span className="text-theme-text">{config.colors.background}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-theme-text-dim">Surface:</span>
                  <span className="text-theme-text">{config.colors.surface}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-theme-text-dim">Primary:</span>
                  <span className="text-theme-primary font-bold">{config.colors.primary}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
