import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNewsArticle } from '../../hooks/useNews';
import { formatDate } from '../../utils/dateUtils';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import DOMPurify from 'dompurify';

export const NewsDetailPage: React.FC<{ slug: string; onNavigate: (path: string) => void }> = ({
  slug,
  onNavigate,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'th';
  const { data: article, isLoading } = useNewsArticle(slug, currentLang);

  if (isLoading || !article) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-sm text-theme-text-muted">
        {t('common.loading')}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 font-sans">
      <button
        type="button"
        onClick={() => onNavigate('/news')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-theme-text-muted hover:text-theme-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>{t('nav.news')}</span>
      </button>

      <div className="space-y-4">
        <span className="rounded-md bg-theme-primary/15 px-2.5 py-1 text-xs font-bold text-theme-primary uppercase">
          {article.category}
        </span>
        <h1 className="font-display text-2xl sm:text-4xl font-black text-theme-text leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center gap-4 text-xs text-theme-text-dim border-b border-theme-border pb-4">
          {article.publishedAt && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-theme-primary" />
              {formatDate(article.publishedAt, currentLang)}
            </span>
          )}
        </div>
      </div>

      {article.featuredImageURL && (
        <div className="aspect-video w-full overflow-hidden rounded-2xl border border-theme-border bg-theme-surface-elevated shadow-xl">
          <img src={article.featuredImageURL} alt={article.title} className="h-full w-full object-cover" />
        </div>
      )}

      {/* Content Body with Sanitized HTML */}
      <div
        className="prose prose-invert prose-sm sm:prose-base max-w-none text-theme-text-muted leading-relaxed"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.contentBody || article.summary) }}
      />
    </div>
  );
};
