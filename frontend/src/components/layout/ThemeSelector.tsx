import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { ThemeMode } from '../../types/theme';
import { Moon, Sun, Sparkles, RefreshCw } from 'lucide-react';

export const ThemeToggleButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    switch (theme) {
      case 'DARK':
        setTheme('LIGHT');
        break;
      case 'LIGHT':
        setTheme('MODERN');
        break;
      case 'MODERN':
        setTheme('DARK');
        break;
      default:
        setTheme('DARK');
    }
  };

  const getThemeDetails = () => {
    switch (theme) {
      case 'DARK':
        return {
          name: 'DARK',
          label: 'Industrial Dark',
          icon: <Moon className="h-4 w-4 text-blue-400" />,
        };
      case 'LIGHT':
        return {
          name: 'LIGHT',
          label: 'Corporate Light',
          icon: <Sun className="h-4 w-4 text-amber-500" />,
        };
      case 'MODERN':
        return {
          name: 'MODERN',
          label: 'Cyber Modern',
          icon: <Sparkles className="h-4 w-4 text-cyan-400" />,
        };
      default:
        return {
          name: 'DARK',
          label: 'Industrial Dark',
          icon: <Moon className="h-4 w-4 text-blue-400" />,
        };
    }
  };

  const details = getThemeDetails();

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className={`group relative flex items-center gap-2 rounded-xl border border-theme-border bg-theme-surface px-3 py-2 text-xs font-semibold text-theme-text hover:bg-theme-surface-elevated hover:border-theme-primary transition-all duration-300 shadow-sm hover:scale-[1.03] active:scale-95 ${className}`}
      title={`Current Theme: ${details.label} (คลิกเพื่อเปลี่ยนเป็นธีมถัดไป)`}
    >
      <div className="transition-transform duration-300 group-hover:rotate-45">
        {details.icon}
      </div>
      <span className="font-mono text-[11px] font-bold tracking-wider text-theme-text">
        {details.name}
      </span>
      <RefreshCw className="h-3 w-3 text-theme-text-dim group-hover:text-theme-primary group-hover:rotate-180 transition-all duration-500" />
    </button>
  );
};
