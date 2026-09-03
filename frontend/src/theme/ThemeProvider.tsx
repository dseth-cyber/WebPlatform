import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeConfig, ThemeMode } from '../types/theme';
import { THEME_CONFIGS } from './themeConfig';

interface ThemeContextType {
  theme: ThemeMode;
  themeConfig: ThemeConfig;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('lohakit_theme') as ThemeMode;
    if (saved && THEME_CONFIGS[saved]) {
      return saved;
    }
    return 'MODERN'; // Default state-of-the-art modern metallic theme
  });

  const themeConfig = THEME_CONFIGS[theme];

  const setTheme = (mode: ThemeMode) => {
    if (THEME_CONFIGS[mode]) {
      setThemeState(mode);
      localStorage.setItem('lohakit_theme', mode);
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    const colors = themeConfig.colors;

    // Set CSS custom properties
    root.style.setProperty('--color-bg', colors.background);
    root.style.setProperty('--color-surface', colors.surface);
    root.style.setProperty('--color-surface-elevated', colors.surfaceElevated);
    root.style.setProperty('--color-surface-hover', colors.surfaceHover);
    root.style.setProperty('--color-border', colors.border);
    root.style.setProperty('--color-border-highlight', colors.borderHighlight);
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-text-muted', colors.textMuted);
    root.style.setProperty('--color-text-dim', colors.textDim);
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-hover', colors.primaryHover);
    root.style.setProperty('--color-primary-glow', colors.primaryGlow);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-badge-bg', colors.badgeBg);
    root.style.setProperty('--color-badge-text', colors.badgeText);
    root.style.setProperty('--theme-shadow', themeConfig.effects.shadow);
    root.style.setProperty('--theme-glow', themeConfig.effects.glow);
    root.style.setProperty('--theme-radius', themeConfig.effects.borderRadius);
    root.style.setProperty('--theme-backdrop', themeConfig.effects.backdropBlur);

    // Toggle body classes
    root.classList.remove('theme-dark', 'theme-light', 'theme-modern', 'dark');
    if (theme === 'DARK') {
      root.classList.add('theme-dark', 'dark');
    } else if (theme === 'LIGHT') {
      root.classList.add('theme-light');
    } else {
      root.classList.add('theme-modern', 'dark');
    }
  }, [theme, themeConfig]);

  return (
    <ThemeContext.Provider value={{ theme, themeConfig, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
