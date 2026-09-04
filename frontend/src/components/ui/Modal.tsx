import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | 'full';
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
  showCloseButton = true,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-[95vw]',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md bg-black/60 animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${maxWidthClasses[maxWidth]} max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-3.5rem)] flex flex-col rounded-2xl border border-theme-border-highlight bg-theme-surface-elevated shadow-2xl transition-all duration-200 animate-in zoom-in-95 overflow-hidden my-auto`}
      >
        <div className="flex-shrink-0 flex items-start justify-between border-b border-theme-border px-5 py-4 sm:px-6 sm:py-4.5 bg-theme-surface-elevated z-10">
          <div className="pr-4">
            <h3 className="text-base sm:text-lg font-bold text-theme-text leading-snug">{title}</h3>
            {subtitle && <p className="mt-1 text-xs text-theme-text-muted">{subtitle}</p>}
          </div>

          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="flex-shrink-0 rounded-xl p-1.5 text-theme-text-muted hover:bg-theme-surface hover:text-theme-text transition-colors border border-transparent hover:border-theme-border"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5 overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
};
