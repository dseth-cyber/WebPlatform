import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import th from './locales/th.json';
import en from './locales/en.json';
import cn from './locales/cn.json';
import mm from './locales/mm.json';
import jp from './locales/jp.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'cn', name: '中文', flag: '🇨🇳' },
  { code: 'mm', name: 'မြန်မာ', flag: '🇲🇲' },
  { code: 'jp', name: '日本語', flag: '🇯🇵' },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      th: { translation: th },
      en: { translation: en },
      cn: { translation: cn },
      mm: { translation: mm },
      jp: { translation: jp },
    },
    fallbackLng: 'th',
    supportedLngs: ['th', 'en', 'cn', 'mm', 'jp'],
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'lohakit_language',
    },
  });

export default i18n;
