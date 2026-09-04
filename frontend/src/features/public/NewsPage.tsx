import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNews } from '../../hooks/useNews';
import { formatDate } from '../../utils/dateUtils';
import { Calendar, ArrowRight, Pin } from 'lucide-react';

export const NewsPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'th';
  const { data: newsList, isLoading } = useNews(undefined, currentLang);

  const sortedNews = React.useMemo(() => {
    if (!newsList) return [];
    return [...newsList].sort((a: any, b: any) => {
      if (Boolean(a.isPinned) && !Boolean(b.isPinned)) return -1;
      if (!Boolean(a.isPinned) && Boolean(b.isPinned)) return 1;
      return 0;
    });
  }, [newsList]);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-16 sm:px-6 lg:px-8 space-y-10 font-sans">
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-theme-primary">
          Press & Updates
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-theme-text leading-tight">
          {currentLang === 'jp'
            ? '企業ニュース＆アクティビティ'
            : currentLang === 'cn'
            ? '企业新闻与最新动态'
            : currentLang === 'mm'
            ? 'ကော်ပိုရိတ် သတင်းများနှင့် လှုပ်ရှားမှုများ'
            : currentLang === 'en'
            ? 'Corporate News & Updates'
            : 'ข่าวสารและกิจกรรมองค์กร'}
        </h1>
        <p className="text-sm text-theme-text-muted leading-relaxed">
          {currentLang === 'jp'
            ? 'CHIOTRON TECHNOLOGYの革新技術、CSR活動、持続可能性に関する最新情報をお届けします。'
            : currentLang === 'cn'
            ? '为您呈现 CHIOTRON TECHNOLOGY 的最新制造技术、CSR社会责任与可持续发展动态。'
            : currentLang === 'mm'
            ? 'CHIOTRON TECHNOLOGY ၏ နောက်ဆုံးပေါ် ဆန်းသစ်တီထွင်မှု၊ လူမှုရေးတာဝန်ယူမှုနှင့် ရေရှည်တည်တံ့မှုဆိုင်ရာ သတင်းများ။'
            : currentLang === 'en'
            ? 'Updates on innovations, manufacturing technologies, and sustainability initiatives from CHIOTRON TECHNOLOGY.'
            : 'อัปเดตนวัตกรรม เทคโนโลยีการผลิต และกิจกรรมเพื่อสังคมและความยั่งยืนของ บริษัท ไคโอทรอน เทคโนโลยี จำกัด (CHIOTRON TECHNOLOGY)'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedNews.map((news: any) => (
          <div
            key={news.id}
            onClick={() => onNavigate(`/news/${news.slug}`)}
            className="glow-card group cursor-pointer rounded-2xl border border-theme-border bg-theme-surface p-5 shadow-glass-edge flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-theme-surface-elevated relative">
                <img
                  src={news.featuredImageURL || '/images/hero-fullwidth.jpg'}
                  alt={news.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/hero-fullwidth.jpg';
                  }}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {Boolean(news.isPinned) && (
                  <span className="absolute top-3 left-3 flex items-center gap-1 rounded-md bg-amber-500/90 text-slate-950 font-bold px-2 py-0.5 text-[10px] shadow-sm backdrop-blur-md">
                    <Pin className="h-3 w-3 fill-slate-950" />
                    <span>{currentLang === 'en' ? 'Featured' : 'ข่าวเด่น'}</span>
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-theme-text-dim">
                  <span className="rounded bg-theme-primary/15 px-2 py-0.5 font-bold text-theme-primary uppercase text-[10px]">
                    {news.category}
                  </span>
                  {news.publishedAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-theme-primary" />
                      {formatDate(news.publishedAt, currentLang)}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-base font-bold text-theme-text group-hover:text-theme-primary transition-colors line-clamp-2">
                  {news.translations?.[currentLang]?.title || (currentLang === 'en' ? news.titleEn : news.title) || news.title}
                </h3>

                <p className="text-xs text-theme-text-muted line-clamp-3 leading-relaxed">
                  {news.translations?.[currentLang]?.summary || (currentLang === 'en' ? news.summaryEn : news.summary) || news.summary}
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-theme-border flex items-center justify-between text-xs font-semibold text-theme-text">
              <span>{t('common.readMore')}</span>
              <ArrowRight className="h-4 w-4 text-theme-primary group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
