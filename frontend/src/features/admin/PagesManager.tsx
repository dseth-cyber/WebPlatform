import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminPages, usePublishPageMutation } from '../../hooks/usePages';
import { SearchableSelect, SelectOption } from '../../components/ui/SearchableSelect';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Pagination } from '../../components/ui/Pagination';
import { TableSkeleton } from '../../components/ui/TableSkeleton';
import {
  FileText,
  Plus,
  Edit,
  Eye,
  Search,
} from 'lucide-react';

interface PagesManagerProps {
  onNavigate: (path: string) => void;
  onEditPage: (pageId: string) => void;
}

export const PagesManager: React.FC<PagesManagerProps> = ({ onNavigate, onEditPage }) => {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { data: pages, isLoading } = useAdminPages(
    statusFilter === 'all' ? undefined : statusFilter,
    searchTerm
  );

  const statusOptions: SelectOption[] = [
    { value: 'all', label: `✨ ${t('common.all')} (${t('common.status')})` },
    { value: 'PUBLISHED', label: `PUBLISHED (${t('admin.statusPublished', 'เผยแพร่แล้ว')})` },
    { value: 'DRAFT', label: `DRAFT (${t('admin.statusDraft', 'ฉบับร่าง')})` },
    { value: 'REVIEW', label: `REVIEW (${t('admin.statusReview', 'รอตรวจสอบ')})` },
  ];

  const handleEdit = (slug: string, id: string) => {
    if (slug === 'products' || slug === '/products') {
      onNavigate('/admin/products');
    } else if (slug === 'news' || slug === '/news') {
      onNavigate('/admin/news');
    } else if (slug === 'about' || slug === '/about') {
      onNavigate('/admin/about');
    } else if (slug === 'contact' || slug === '/contact') {
      onNavigate('/admin/contact');
    } else {
      onEditPage(id);
    }
  };

  const filteredPages = (pages ?? []).filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (searchTerm && !p.slug.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 font-sans pb-24">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-theme-border pb-6">
        <div>
          <h1 className="font-display text-2xl font-black text-theme-text flex items-center gap-2">
            <FileText className="h-6 w-6 text-theme-primary" />
            <span>{t('admin.pagesTitle', 'Pages & Section Builder (Pages & Structure CMS)')}</span>
          </h1>
          <p className="text-xs text-theme-text-muted mt-1">
            {t('admin.pagesSubtitle', 'จัดการหน้าเว็บไซต์และเนื้อหาแต่ละส่วน (หน้าแรก, เกี่ยวกับเรา, สินค้า, ข่าวสาร, ติดต่อเรา)')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('/admin/products')}
          className="flex items-center gap-2 rounded-xl bg-theme-primary px-5 py-2.5 text-xs font-black text-black shadow-lg shadow-theme-primary/25 hover:bg-theme-primary-hover transition-all"
        >
          <Plus className="h-4 w-4 text-black" />
          <span>{t('admin.addNewContent', '+ เพิ่มสินค้า / เนื้อหาใหม่')}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-theme-border bg-theme-surface p-4 shadow-glass-edge flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-64">
          <SearchableSelect
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder={t('common.status')}
          />
        </div>

        <div className="w-full sm:w-80 relative">
          <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-theme-text-dim" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('admin.searchSlugPlaceholder', 'ค้นหาตาม Slug หรือ Title...')}
            className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated py-2 pl-9 pr-3 text-xs text-theme-text placeholder-theme-text-dim focus:border-theme-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Pages Table */}
      <div className="rounded-2xl border border-theme-border bg-theme-surface shadow-2xl overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={5} columns={5} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-theme-text-muted">
              <thead>
                <tr className="border-b border-theme-border bg-theme-surface-elevated text-theme-text font-semibold">
                  <th className="py-3 px-4">{t('admin.tableSlug', 'Slug / Path')}</th>
                  <th className="py-3 px-4">{t('admin.tablePageTitle', 'ชื่อหน้าเว็บ (Page Title)')}</th>
                  <th className="py-3 px-4">{t('admin.tableStatus', 'สถานะ')}</th>
                  <th className="py-3 px-4">{t('admin.tableLastUpdated', 'อัปเดตล่าสุด')}</th>
                  <th className="py-3 px-4 text-right">{t('admin.tableActions', 'จัดการ')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredPages.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-theme-text-dim">
                      {t('common.emptyState')}
                    </td>
                  </tr>
                ) : (
                  filteredPages.map((page) => (
                    <tr
                      key={page.id}
                      className="border-b border-theme-border/50 hover:bg-theme-surface-elevated/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-theme-text flex items-center gap-2">
                        <FileText className="h-4 w-4 text-theme-primary" />
                        <span>/{page.slug}</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-theme-text">
                        {page.translations?.th?.title || page.slug}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            page.status === 'PUBLISHED'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {page.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-theme-text-dim">
                        {new Date(page.updatedAt || Date.now()).toLocaleDateString('th-TH')}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(page.slug, page.id)}
                          className="rounded-lg border border-theme-border bg-theme-surface p-1.5 text-theme-text-muted hover:text-theme-primary hover:border-theme-primary transition-colors"
                          title="แก้ไขเนื้อหาหน้านี้"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onNavigate(`/${page.slug === 'home' ? '' : page.slug}`)}
                          className="rounded-lg border border-theme-border bg-theme-surface p-1.5 text-theme-text-muted hover:text-theme-primary hover:border-theme-primary transition-colors"
                          title="ดูตัวอย่างหน้าเว็บ"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={filteredPages.length}
          totalPages={Math.ceil(filteredPages.length / pageSize) || 1}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
};
