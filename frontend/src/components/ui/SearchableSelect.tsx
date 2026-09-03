import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  id?: string;
  isClearable?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  disabled = false,
  isLoading = false,
  className = '',
  id,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (opt.sublabel && opt.sublabel.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setHighlightedIndex(0);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || isLoading) return;

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[highlightedIndex] && !filteredOptions[highlightedIndex].disabled) {
          onChange(filteredOptions[highlightedIndex].value);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', zIndex: isOpen ? 999 : 'auto' }}
      className={`inline-block w-full text-left font-sans ${className}`}
      onKeyDown={handleKeyDown}
      id={id}
    >
      <button
        type="button"
        disabled={disabled || isLoading}
        onClick={() => !disabled && !isLoading && setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-lg border px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-theme-primary/40 ${
          disabled
            ? 'cursor-not-allowed opacity-50 bg-theme-surface/50 border-theme-border'
            : 'cursor-pointer bg-theme-surface hover:bg-theme-surface-hover border-theme-border text-theme-text shadow-sm'
        } ${isOpen ? 'border-theme-primary ring-2 ring-theme-primary/30' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2 truncate">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-theme-primary" />
          ) : selectedOption?.icon ? (
            <span className="text-theme-primary">{selectedOption.icon}</span>
          ) : null}

          <span className={selectedOption ? 'text-theme-text font-medium' : 'text-theme-text-dim'}>
            {selectedOption ? selectedOption.label : placeholder || t('common.filter')}
          </span>
        </span>

        <ChevronDown
          className={`h-4 w-4 text-theme-text-muted transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-theme-primary' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          style={{ position: 'absolute', zIndex: 9999 }}
          className="mt-1.5 w-full rounded-xl border border-theme-border-highlight bg-theme-surface-elevated p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="relative mb-1.5 px-1 pt-1">
            <Search className="absolute left-3 top-3.5 h-3.5 w-3.5 text-theme-text-dim" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setHighlightedIndex(0);
              }}
              placeholder={searchPlaceholder || t('common.search')}
              className="w-full rounded-lg border border-theme-border bg-theme-surface/80 py-1.5 pl-8 pr-3 text-xs text-theme-text placeholder-theme-text-dim focus:border-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-primary"
            />
          </div>

          <ul className="max-h-60 overflow-y-auto py-1 scrollbar-thin" role="listbox">
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-4 text-center text-xs text-theme-text-dim">
                {t('common.emptyState')}
              </li>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = option.value === value;
                const isHighlighted = index === highlightedIndex;

                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      if (!option.disabled) {
                        onChange(option.value);
                        setIsOpen(false);
                      }
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors ${
                      option.disabled
                        ? 'cursor-not-allowed opacity-40'
                        : isHighlighted
                        ? 'bg-theme-primary/15 text-theme-text font-medium'
                        : 'text-theme-text hover:bg-theme-surface-hover'
                    } ${isSelected ? 'bg-theme-primary/20 text-theme-primary font-semibold' : ''}`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {option.icon && <span>{option.icon}</span>}
                      <div>
                        <div className="truncate">{option.label}</div>
                        {option.sublabel && (
                          <div className="text-[10px] text-theme-text-dim truncate">{option.sublabel}</div>
                        )}
                      </div>
                    </div>

                    {isSelected && <Check className="h-3.5 w-3.5 text-theme-primary flex-shrink-0" />}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
