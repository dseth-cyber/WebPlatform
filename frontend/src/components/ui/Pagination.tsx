import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SearchableSelect } from './SearchableSelect';

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
}) => {
  const { t } = useTranslation();

  if (totalItems === 0) return null;

  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const selectOptions = pageSizeOptions.map((size) => ({
    value: size.toString(),
    label: `${size} / ${t('common.items')}`,
  }));

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-theme-border px-4 py-3 text-xs text-theme-text-muted">
      <div className="flex items-center gap-3">
        <span>
          {t('common.showing')}{' '}
          <strong className="font-semibold text-theme-text">{startItem}</strong>{' '}
          {t('common.to')}{' '}
          <strong className="font-semibold text-theme-text">{endItem}</strong>{' '}
          {t('common.of')}{' '}
          <strong className="font-semibold text-theme-text">{totalItems}</strong>{' '}
          {t('common.items')}
        </span>

        <div className="w-28">
          <SearchableSelect
            options={selectOptions}
            value={pageSize.toString()}
            onChange={(val) => onPageSizeChange(parseInt(val, 10))}
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-theme-border bg-theme-surface text-theme-text transition-colors hover:bg-theme-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
          let pageNum = i + 1;
          if (totalPages > 5 && currentPage > 3) {
            pageNum = currentPage - 2 + i;
            if (pageNum > totalPages) pageNum = totalPages - 4 + i;
          }

          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-2 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-theme-primary text-black font-bold shadow-md shadow-theme-primary/30'
                  : 'border border-theme-border bg-theme-surface text-theme-text hover:bg-theme-surface-hover'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-theme-border bg-theme-surface text-theme-text transition-colors hover:bg-theme-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
