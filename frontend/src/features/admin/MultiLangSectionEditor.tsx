import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export type LocaleCode = 'en' | 'jp' | 'cn' | 'mm';

export interface TranslationField {
  key: string;
  label: string; // e.g. "Title", "Highlight", "Description"
  type?: 'text' | 'textarea';
  rows?: number;
  placeholder?: string;
  helperText?: string;
}

interface MultiLangSectionEditorProps {
  title?: string;
  badge?: string;
  fields: TranslationField[];
  value: Record<LocaleCode, Record<string, string>>;
  onChange: (updated: Record<LocaleCode, Record<string, string>>) => void;
  className?: string;
  compact?: boolean;
}

const LOCALE_TABS: Array<{ code: LocaleCode; label: string }> = [
  { code: 'en', label: 'US EN' },
  { code: 'jp', label: 'JP JP' },
  { code: 'cn', label: 'CN CN' },
  { code: 'mm', label: 'MM MM' },
];

export const MultiLangSectionEditor: React.FC<MultiLangSectionEditorProps> = ({
  title,
  badge = '4 Locales',
  fields,
  value,
  onChange,
  className = '',
  compact = false,
}) => {
  const { t } = useTranslation();
  const displayTitle = title || t('admin.multiLangTitle', 'แปลภาษา (Multi-Language)');
  const [activeTab, setActiveTab] = useState<LocaleCode>('en');

  const handleFieldChange = (key: string, val: string) => {
    const currentLocaleData = value[activeTab] || {};
    const updated = {
      ...value,
      [activeTab]: {
        ...currentLocaleData,
        [key]: val,
      },
    };
    onChange(updated);
  };

  if (compact) {
    return (
      <div className={`space-y-3 rounded-2xl border border-theme-border/80 bg-theme-surface-elevated/70 p-3.5 ${className}`}>
        <div className="flex items-center justify-between border-b border-theme-border/60 pb-2">
          <span className="font-bold text-xs text-theme-text flex items-center gap-1.5">
            <span>🌐</span>
            <span>{displayTitle}</span>
          </span>
          <span className="text-[10px] text-theme-text-muted font-mono">{badge}</span>
        </div>

        {/* 4 Language Tabs */}
        <div className="grid grid-cols-4 gap-1 rounded-xl bg-theme-surface p-1 border border-theme-border">
          {LOCALE_TABS.map((tab) => {
            const isActive = activeTab === tab.code;
            return (
              <button
                key={tab.code}
                type="button"
                onClick={() => setActiveTab(tab.code)}
                className={`rounded-lg py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-400 text-black font-black shadow-sm'
                    : 'text-theme-text-muted hover:text-theme-text'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Fields */}
        <div className="space-y-2.5 text-xs pt-0.5">
          {fields.map((field) => {
            const currentVal = value?.[activeTab]?.[field.key] || '';
            return (
              <div key={field.key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-theme-text block text-[11px]">
                    {field.label} ({activeTab.toUpperCase()})
                  </label>
                  {field.helperText && (
                    <span className="text-[9px] text-theme-text-muted">{field.helperText}</span>
                  )}
                </div>

                {field.type === 'textarea' ? (
                  <textarea
                    rows={field.rows || 2}
                    value={currentVal}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder || `${field.label} (${activeTab.toUpperCase()})`}
                    className="w-full rounded-xl border border-theme-border bg-theme-surface px-3 py-1.5 text-xs text-theme-text focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                ) : (
                  <input
                    type="text"
                    value={currentVal}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder || `${field.label} (${activeTab.toUpperCase()})`}
                    className="w-full rounded-xl border border-theme-border bg-theme-surface px-3 py-1.5 text-xs text-theme-text focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl border border-theme-border bg-theme-surface p-6 shadow-2xl space-y-4 ${className}`}>
      {/* Header */}
      <div className="border-b border-theme-border pb-3 flex items-center justify-between">
        <h2 className="font-display text-sm font-bold text-theme-text">{displayTitle}</h2>
        <span className="text-[10px] text-theme-text-muted font-mono">{badge}</span>
      </div>

      {/* 4 Language Tabs (Pill Buttons) */}
      <div className="grid grid-cols-4 gap-1.5 rounded-2xl bg-theme-surface-elevated p-1 border border-theme-border">
        {LOCALE_TABS.map((tab) => {
          const isActive = activeTab === tab.code;
          return (
            <button
              key={tab.code}
              type="button"
              onClick={() => setActiveTab(tab.code)}
              className={`rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-400 text-black font-black shadow-md border border-cyan-300'
                  : 'text-theme-text-muted hover:text-theme-text hover:bg-theme-surface'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Fields for the Active Locale */}
      <div className="space-y-4 text-xs pt-1">
        {fields.map((field) => {
          const currentVal = value[activeTab]?.[field.key] || '';
          return (
            <div key={field.key} className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-theme-text block">
                  {field.label} ({activeTab.toUpperCase()})
                </label>
                {field.helperText && (
                  <span className="text-[10px] text-theme-text-muted">{field.helperText}</span>
                )}
              </div>

              {field.type === 'textarea' ? (
                <textarea
                  rows={field.rows || 3}
                  value={currentVal}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  placeholder={field.placeholder || `${field.label} (${activeTab.toUpperCase()})`}
                  className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-xs text-theme-text focus:border-cyan-400 focus:outline-none transition-colors"
                />
              ) : (
                <input
                  type="text"
                  value={currentVal}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  placeholder={field.placeholder || `${field.label} (${activeTab.toUpperCase()})`}
                  className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-xs text-theme-text focus:border-cyan-400 focus:outline-none transition-colors"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
