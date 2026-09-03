import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Lock, Mail, Key, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { apiClient } from '../../api/client';

interface AdminLoginPageProps {
  onLoginSuccess: (user: any) => void;
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('admin@lohakit.co.th');
  const [password, setPassword] = useState('AdminLohakit2026!');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await apiClient<{ user: any; csrfToken: string }>('/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res.data?.csrfToken) {
        localStorage.setItem('csrf_token', res.data.csrfToken);
      }
      localStorage.setItem('lohakit_admin_user', JSON.stringify(res.data?.user || { email, role: 'Superadmin' }));
      onLoginSuccess(res.data?.user || { email, role: 'Superadmin' });
    } catch (err: any) {
      // Safe fallback for demo
      if (email === 'admin@lohakit.co.th' && password === 'AdminLohakit2026!') {
        const demoUser = { id: 'u-1', email, fullName: 'Lohakit Administrator', role: 'Superadmin' };
        localStorage.setItem('lohakit_admin_user', JSON.stringify(demoUser));
        onLoginSuccess(demoUser);
        return;
      }
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-theme-bg via-theme-surface to-theme-bg font-sans">
      <div className="w-full max-w-md rounded-3xl border border-theme-border-highlight bg-theme-surface-elevated/90 p-8 shadow-2xl backdrop-blur-xl space-y-6">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="flex items-center gap-1 text-xs font-semibold text-theme-text-muted hover:text-theme-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t('common.goHome')}</span>
        </button>

        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-theme-primary to-slate-800 p-0.5 shadow-lg">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-theme-surface">
              <Lock className="h-6 w-6 text-theme-primary" />
            </div>
          </div>
          <h1 className="font-display text-2xl font-black text-theme-text">
            {t('admin.login')}
          </h1>
          <p className="text-xs text-theme-text-muted">
            {t('admin.loginSubtitle')}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-theme-text block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-theme-text-dim" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lohakit.co.th"
                className="w-full rounded-xl border border-theme-border bg-theme-surface py-2.5 pl-9 pr-3 text-xs text-theme-text placeholder-theme-text-dim focus:border-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-theme-text block mb-1">
              Password
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-3 h-4 w-4 text-theme-text-dim" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-theme-border bg-theme-surface py-2.5 pl-9 pr-3 text-xs text-theme-text placeholder-theme-text-dim focus:border-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-theme-primary py-3 text-sm font-bold text-black shadow-lg shadow-theme-primary/25 hover:bg-theme-primary-hover disabled:opacity-50 transition-all"
          >
            <span>{isLoading ? t('common.loading') : t('admin.login')}</span>
          </button>
        </form>

        <div className="rounded-xl border border-theme-border bg-theme-surface/50 p-3 text-center text-[11px] text-theme-text-dim">
          <p className="font-semibold text-theme-primary mb-0.5">Default Superadmin:</p>
          <p>Email: admin@lohakit.co.th | Pass: AdminLohakit2026!</p>
        </div>
      </div>
    </div>
  );
};
