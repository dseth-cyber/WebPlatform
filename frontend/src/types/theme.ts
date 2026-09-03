export type ThemeMode = 'DARK' | 'LIGHT' | 'MODERN';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceHover: string;
  border: string;
  borderHighlight: string;
  text: string;
  textMuted: string;
  textDim: string;
  primary: string;
  primaryHover: string;
  primaryGlow: string;
  secondary: string;
  accent: string;
  badgeBg: string;
  badgeText: string;
}

export interface ThemeEffects {
  shadow: string;
  glow: string;
  borderRadius: string;
  backdropBlur: string;
  metallicGradient: string;
  cardStyle: 'glassmorphism' | 'elevated' | 'frosted-cyber';
  buttonStyle: 'glow' | 'solid' | 'neon-gradient';
}

export interface ThemeConfig {
  mode: ThemeMode;
  name: string;
  subtitle: string;
  colors: ThemeColors;
  effects: ThemeEffects;
}
