import React from 'react';
import { PackageOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-theme-border bg-theme-surface/50 p-12 text-center">
      <div className="rounded-2xl bg-theme-surface-elevated p-4 border border-theme-border text-theme-primary mb-3 shadow-inner">
        {icon || <PackageOpen className="h-8 w-8 text-theme-primary/80" />}
      </div>
      <h4 className="text-sm font-semibold text-theme-text">
        {title || t('common.emptyState')}
      </h4>
      {description && (
        <p className="mt-1 max-w-sm text-xs text-theme-text-muted">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
