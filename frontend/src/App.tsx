import React, { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { HomePage } from './features/public/HomePage';
import { ProductsPage } from './features/public/ProductsPage';
import { ProductDetailPage } from './features/public/ProductDetailPage';
import { AboutPage } from './features/public/AboutPage';
import { ServicesPage } from './features/public/ServicesPage';
import { TechnologyPage } from './features/public/TechnologyPage';
import { QualityPage } from './features/public/QualityPage';
import { SustainabilityPage } from './features/public/SustainabilityPage';
import { CertificationsPage } from './features/public/CertificationsPage';
import { NewsPage } from './features/public/NewsPage';
import { NewsDetailPage } from './features/public/NewsDetailPage';
import { ContactPage } from './features/public/ContactPage';
import { CareersPage } from './features/public/CareersPage';
import { PrivacyPage, CookiePage, TermsPage } from './features/public/LegalPages';

import { AdminLayout } from './features/admin/AdminLayout';
import { AdminLoginPage } from './features/admin/AdminLoginPage';
import { DashboardPage } from './features/admin/DashboardPage';
import { PagesManager } from './features/admin/PagesManager';
import { PageEditor } from './features/admin/PageEditor';
import { AboutManager } from './features/admin/AboutManager';
import { ProductsManager } from './features/admin/ProductsManager';
import { ServicesManager } from './features/admin/ServicesManager';
import { TechnologyManager } from './features/admin/TechnologyManager';
import { SustainabilityManager } from './features/admin/SustainabilityManager';
import { CareersManager } from './features/admin/CareersManager';
import { NewsManager } from './features/admin/NewsManager';
import { ContactManager } from './features/admin/ContactManager';
import { MediaLibrary } from './features/admin/MediaLibrary';
import { ThemeManager } from './features/admin/ThemeManager';
import { SettingsManager } from './features/admin/SettingsManager';
import { UsersManager } from './features/admin/UsersManager';
import { AuditLogManager } from './features/admin/AuditLogManager';
import { TrashManager } from './features/admin/TrashManager';
import { ServiceManualPage } from './features/admin/ServiceManualPage';

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return (window.location.pathname + window.location.search) || '/';
  });

  const [adminUser, setAdminUser] = useState<any>(() => {
    const saved = localStorage.getItem('lohakit_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [editingPageId, setEditingPageId] = useState<string | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath((window.location.pathname + window.location.search) || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('lohakit_admin_user');
    localStorage.removeItem('csrf_token');
    setAdminUser(null);
    navigate('/');
  };

  const basePath = currentPath.split('?')[0];

  // Admin Route Handling
  if (basePath.startsWith('/admin')) {
    if (basePath === '/admin/login') {
      return (
        <AdminLoginPage
          onLoginSuccess={(user) => {
            setAdminUser(user);
            navigate('/admin');
          }}
          onNavigate={navigate}
        />
      );
    }

    if (!adminUser) {
      return (
        <AdminLoginPage
          onLoginSuccess={(user) => {
            setAdminUser(user);
            navigate('/admin');
          }}
          onNavigate={navigate}
        />
      );
    }

    if (editingPageId) {
      return (
        <AdminLayout currentPath={basePath} onNavigate={navigate} onLogout={handleLogout}>
          <PageEditor pageId={editingPageId} onBack={() => setEditingPageId(null)} />
        </AdminLayout>
      );
    }

    return (
      <AdminLayout currentPath={basePath} onNavigate={navigate} onLogout={handleLogout}>
        {basePath === '/admin' && <DashboardPage onNavigate={navigate} />}
        {basePath === '/admin/pages' && (
          <PagesManager onNavigate={navigate} onEditPage={(id) => setEditingPageId(id)} />
        )}
        {basePath === '/admin/about' && <AboutManager />}
        {basePath === '/admin/products' && <ProductsManager />}
        {basePath === '/admin/services' && <ServicesManager />}
        {basePath === '/admin/technology' && <TechnologyManager />}
        {basePath === '/admin/sustainability' && <SustainabilityManager />}
        {basePath === '/admin/careers' && <CareersManager />}
        {basePath === '/admin/news' && <NewsManager />}
        {basePath === '/admin/contact' && <ContactManager />}
        {basePath === '/admin/media' && <MediaLibrary />}
        {basePath === '/admin/themes' && <ThemeManager />}
        {basePath === '/admin/settings' && <SettingsManager />}
        {basePath === '/admin/users' && <UsersManager />}
        {basePath === '/admin/audit-log' && <AuditLogManager />}
        {basePath === '/admin/trash' && <TrashManager />}
        {basePath === '/admin/manual' && <ServiceManualPage />}
      </AdminLayout>
    );
  }

  // Public Route Handling with Master <Layout>
  const renderPublicView = () => {
    if (basePath === '/' || basePath === '') {
      return <HomePage onNavigate={navigate} />;
    }

    if (basePath.startsWith('/products/')) {
      const slug = basePath.replace('/products/', '');
      return <ProductDetailPage slug={slug} onNavigate={navigate} />;
    }

    if (basePath.startsWith('/products')) {
      return <ProductsPage onNavigate={navigate} currentPath={currentPath} />;
    }

    if (basePath === '/about' || basePath === '/company') {
      return <AboutPage onNavigate={navigate} />;
    }

    if (basePath.startsWith('/services')) {
      return <ServicesPage onNavigate={navigate} />;
    }

    if (basePath === '/technology') {
      return <TechnologyPage onNavigate={navigate} />;
    }

    if (basePath === '/quality') {
      return <QualityPage onNavigate={navigate} />;
    }

    if (basePath === '/sustainability') {
      return <SustainabilityPage onNavigate={navigate} />;
    }

    if (basePath === '/careers' || basePath === '/jobs') {
      return <CareersPage onNavigate={navigate} />;
    }

    if (basePath === '/certifications') {
      return <CertificationsPage onNavigate={navigate} />;
    }

    if (basePath.startsWith('/news/')) {
      const slug = basePath.replace('/news/', '');
      return <NewsDetailPage slug={slug} onNavigate={navigate} />;
    }

    if (basePath === '/news') {
      return <NewsPage onNavigate={navigate} />;
    }

    if (basePath === '/contact') {
      return <ContactPage onNavigate={navigate} />;
    }

    if (basePath === '/privacy') {
      return <PrivacyPage />;
    }

    if (basePath === '/cookies') {
      return <CookiePage />;
    }

    if (basePath === '/terms') {
      return <TermsPage />;
    }

    // Default Fallback
    return <HomePage onNavigate={navigate} />;
  };

  return (
    <Layout currentPath={basePath} onNavigate={navigate}>
      {renderPublicView()}
    </Layout>
  );
};
