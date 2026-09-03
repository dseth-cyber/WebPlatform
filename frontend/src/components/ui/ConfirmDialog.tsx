import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle, Info, Lock } from 'lucide-react';
import { Modal } from './Modal';
import { useTranslation } from 'react-i18next';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password?: string) => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  requiresPasswordVerification?: boolean;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  variant = 'warning',
  requiresPasswordVerification = false,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (requiresPasswordVerification && !password.trim()) {
      setError(t('common.required'));
      return;
    }
    setError('');
    await onConfirm(password);
    setPassword('');
  };

  const icons = {
    danger: <ShieldAlert className="h-6 w-6 text-red-500" />,
    warning: <AlertTriangle className="h-6 w-6 text-amber-500" />,
    info: <Info className="h-6 w-6 text-blue-500" />,
    success: <CheckCircle className="h-6 w-6 text-emerald-500" />,
  };

  const confirmBtnStyles = {
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/30',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-900/30',
    info: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/30',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/30',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 rounded-xl bg-theme-surface p-2.5 border border-theme-border">
            {icons[variant]}
          </div>
          <div className="text-sm text-theme-text-muted leading-relaxed">
            {message}
          </div>
        </div>

        {requiresPasswordVerification && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-red-400">
              <Lock className="h-3.5 w-3.5" />
              <span>{t('common.reauthRequired')}</span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder={t('common.password')}
              className="w-full rounded-lg border border-theme-border bg-theme-surface px-3 py-2 text-xs text-theme-text placeholder-theme-text-dim focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            {error && <p className="text-[11px] text-red-400">{error}</p>}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 border-t border-theme-border pt-4">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="rounded-lg border border-theme-border bg-theme-surface px-4 py-2 text-xs font-medium text-theme-text hover:bg-theme-surface-hover transition-colors"
          >
            {cancelText || t('common.cancel')}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={handleConfirm}
            className={`rounded-lg px-4 py-2 text-xs font-semibold shadow-lg transition-all ${confirmBtnStyles[variant]} ${
              isLoading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? t('common.loading') : confirmText || t('common.confirm')}
          </button>
        </div>
      </div>
    </Modal>
  );
};
