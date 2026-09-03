/**
 * Multi-lingual Date Formatter
 * Thai (th): Formats in Buddhist Era (BE = Year + 543)
 * Other languages (en, cn, mm, jp): Standard Gregorian calendar
 */
export function formatDate(date: Date | string | number | null | undefined, lang: string = 'th', options?: Intl.DateTimeFormatOptions): string {
  if (!date) return '';

  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';

  const normalizedLang = (lang || 'th').toLowerCase();

  if (normalizedLang === 'th') {
    // Buddhist Era formatting
    const defaultOptions: Intl.DateTimeFormatOptions = options || {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const formatter = new Intl.DateTimeFormat('th-TH-u-ca-buddhist', defaultOptions);
    return formatter.format(d);
  }

  const localeMap: Record<string, string> = {
    en: 'en-US',
    cn: 'zh-CN',
    mm: 'my-MM',
    jp: 'ja-JP',
  };

  const targetLocale = localeMap[normalizedLang] || 'en-US';
  const defaultOptions: Intl.DateTimeFormatOptions = options || {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const formatter = new Intl.DateTimeFormat(targetLocale, defaultOptions);
  return formatter.format(d);
}

export function formatDateTime(date: Date | string | number | null | undefined, lang: string = 'th'): string {
  return formatDate(date, lang, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
