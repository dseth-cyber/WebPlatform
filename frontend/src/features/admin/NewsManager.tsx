import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNews } from '../../hooks/useNews';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Pagination } from '../../components/ui/Pagination';
import { TableSkeleton } from '../../components/ui/TableSkeleton';
import { Plus, Edit, Trash2, Newspaper, Eye, EyeOff, Check, Image as ImageIcon, UploadCloud, Pin } from 'lucide-react';
import { LocalizedNewsArticle } from '../../types/domain';
import { MOCK_NEWS } from '../../api/mockData';
import { MultiLangSectionEditor } from './MultiLangSectionEditor';

interface ExtendedNewsArticle extends LocalizedNewsArticle {
  isActive?: boolean;
  isPinned?: boolean;
  titleEn?: string;
  summaryEn?: string;
  translations?: Record<string, Record<string, string>>;
}

export const NewsManager: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'th';

  const { data: newsList, isLoading } = useNews(undefined, currentLang);
  const [items, setItems] = useState<ExtendedNewsArticle[]>([]);

  const getFullNewsTranslations = (article: Partial<ExtendedNewsArticle>) => {
    const defNews = MOCK_NEWS.find((m) => m.id === article.id || m.title === article.title);
    const baseTrans = article.translations || defNews?.translations || {};

    const enDef = baseTrans.en || defNews?.translations?.en || {};
    const jpDef = baseTrans.jp || defNews?.translations?.jp || {};
    const cnDef = baseTrans.cn || defNews?.translations?.cn || {};
    const mmDef = baseTrans.mm || defNews?.translations?.mm || {};

    const fallbackTitle = article.title || 'Corporate News Announcement';
    const fallbackSummary = article.summary || 'Latest corporate news, sustainability updates and announcements.';
    const fallbackBody = article.contentBody || `<p>${fallbackSummary}</p>`;

    const isTest = (fallbackTitle + fallbackSummary).includes('ทดสอบ');

    return {
      en: {
        title: enDef.title || (isTest ? 'Innovation & Packaging Tech Update' : article.titleEn || fallbackTitle),
        summary: enDef.summary || (isTest ? 'Operational and technological innovation testing for packaging production lines.' : article.summaryEn || fallbackSummary),
        contentBody: enDef.contentBody || (isTest ? '<p>System testing and operational verification for innovation reporting.</p>' : fallbackBody),
      },
      jp: {
        title: jpDef.title || (isTest ? '包装技術イノベーション・最新レポート' : '技術革新および持続可能性に関する最新情報'),
        summary: jpDef.summary || (isTest ? '製缶生産ラインの技術革新テストおよびシステム稼働検証。' : 'カイオトロン・テクノロジーの最新技術革新と持続可能な事業展開について。'),
        contentBody: jpDef.contentBody || (isTest ? '<p>イノベーションレポートの稼働テストおよびシステム検証を実施。</p>' : fallbackBody),
      },
      cn: {
        title: cnDef.title || (isTest ? '金属包装创新技术与发展公告' : '技术创新与可持续发展最新动态'),
        summary: cnDef.summary || (isTest ? '先进制罐生产线技术创新与系统运行测试验证。' : '凯奥创科技最新技术革新与可持续制造倡议最新进展。'),
        contentBody: cnDef.contentBody || (isTest ? '<p>系统测试与技术创新报告发布验证。</p>' : fallbackBody),
      },
      mm: {
        title: mmDef.title || (isTest ? 'ထုပ်ပိုးမှုနည်းပညာ ဆန်းသစ်တီထွင်မှု သတင်းလွှာ' : 'နည်းပညာနှင့် ရေရှည်တည်တံ့မှုဆိုင်ရာ နောက်ဆုံးရ သတင်း'),
        summary: mmDef.summary || (isTest ? 'သံဗူးထုတ်လုပ်မှုလိုင်း နည်းပညာဆန်းသစ်တီထွင်မှုနှင့် စနစ်စမ်းသပ်မှု စစ်ဆေးချက်။' : 'CHIOTRON TECHNOLOGY ၏ နောက်ဆုံးပေါ် နည်းပညာနှင့် စက်ရုံထုတ်လုပ်မှုဆိုင်ရာ သတင်းများ။'),
        contentBody: mmDef.contentBody || (isTest ? '<p>စနစ်ပိုင်းဆိုင်ရာ စမ်းသပ်မှုနှင့် နည်းပညာသတင်း စစ်ဆေးချက်။</p>' : fallbackBody),
      },
    };
  };

  // Sync with loaded query
  React.useEffect(() => {
    if (newsList) {
      const listToUse = newsList.length > 0 ? newsList : MOCK_NEWS;
      if (items.length === 0) {
        setItems(listToUse.map((n: any) => ({
          ...n,
          isActive: n.isActive !== false,
          translations: getFullNewsTranslations(n),
        })));
      }
    }
  }, [newsList]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ExtendedNewsArticle | null>(null);

  // Form States
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Tech & Innovation');
  const [summary, setSummary] = useState('');
  const [contentBody, setContentBody] = useState('');
  const [featuredImageURL, setFeaturedImageURL] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isPinned, setIsPinned] = useState(false);
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({
    en: { title: '', summary: '', contentBody: '' },
    jp: { title: '', summary: '', contentBody: '' },
    cn: { title: '', summary: '', contentBody: '' },
    mm: { title: '', summary: '', contentBody: '' },
  });

  // Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Confirm Delete Dialog
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const syncNewsToDatabase = async (newList: ExtendedNewsArticle[]) => {
    localStorage.setItem('lohakit_news_data', JSON.stringify(newList));
    window.dispatchEvent(new Event('lohakit_news_updated'));
    try {
      const csrfToken = localStorage.getItem('csrf_token') || '';
      const authToken = localStorage.getItem('auth_token') || '';
      const payload = JSON.stringify({
        group: 'news',
        key: 'site_news',
        value: newList,
        isPublic: true,
        description: 'Corporate News & CSR Database Repository',
      });

      const res = await fetch('/api/v1/public/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        credentials: 'include',
        body: payload,
      });

      if (!res.ok) {
        await fetch('/api/v1/admin/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
          credentials: 'include',
          body: payload,
        });
      }
    } catch (e) {
      console.warn('Failed to sync news:', e);
    }
  };

  const handleToggleStatus = (id: string) => {
    const updatedList = items.map((item) => {
      if (item.id === id) {
        const nextState = item.isActive === false ? true : false;
        return { ...item, isActive: nextState };
      }
      return item;
    });
    setItems(updatedList);
    syncNewsToDatabase(updatedList);
    showToast('เปลี่ยนสถานะการแสดงผลข่าวสารในฐานข้อมูลเรียบร้อยแล้ว');
  };

  const handleTogglePin = (id: string) => {
    const updatedList = items.map((item) => {
      if (item.id === id) {
        return { ...item, isPinned: !item.isPinned };
      }
      return item;
    });
    setItems(updatedList);
    syncNewsToDatabase(updatedList);
    const target = updatedList.find((i) => i.id === id);
    showToast(target?.isPinned ? '📌 ปักหมุดข่าวเด่นบนหน้าแรกเรียบร้อยแล้ว' : 'ยกเลิกการปักหมุดข่าวนี้แล้ว');
  };

  const handleOpenAdd = () => {
    setEditingArticle(null);
    setTitle('');
    setSlug('');
    setCategory('Tech & Innovation');
    setSummary('');
    setContentBody('');
    setFeaturedImageURL('/images/factory-building.jpg');
    setIsActive(true);
    setIsPinned(false);
    setTranslations({
      en: { title: '', summary: '', contentBody: '' },
      jp: { title: '', summary: '', contentBody: '' },
      cn: { title: '', summary: '', contentBody: '' },
      mm: { title: '', summary: '', contentBody: '' },
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (article: ExtendedNewsArticle) => {
    setEditingArticle(article);
    setTitle(article.title);
    setSlug(article.slug);
    setCategory(article.category);
    setSummary(article.summary || '');
    setContentBody(article.contentBody || '');
    setFeaturedImageURL(article.featuredImageURL || '/images/factory-building.jpg');
    setIsActive(article.isActive !== false);
    setIsPinned(Boolean(article.isPinned));
    setTranslations(getFullNewsTranslations(article));
    setModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        setFeaturedImageURL(base64);
        showToast('แนบไฟล์รูปภาพข่าวสารเรียบร้อยแล้ว');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('กรุณากรอกหัวข้อข่าวสาร');
      return;
    }

    let updatedList: ExtendedNewsArticle[];
    if (editingArticle) {
      // Update existing
      updatedList = items.map((item) =>
        item.id === editingArticle.id
          ? {
              ...item,
              title,
              titleEn: translations.en?.title || title,
              summaryEn: translations.en?.summary || summary,
              slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
              category,
              summary,
              contentBody,
              featuredImageURL,
              isActive,
              isPinned,
              translations,
            }
          : item
      );
      setItems(updatedList);
      syncNewsToDatabase(updatedList);
      showToast('บันทึกการแก้ไขข่าวสารลงฐานข้อมูลเรียบร้อยแล้ว');
    } else {
      // Create new
      const newArt: ExtendedNewsArticle = {
        id: 'news-' + Date.now(),
        slug: slug || 'news-' + Date.now(),
        category,
        language: currentLang,
        title,
        titleEn: translations.en?.title || title,
        summaryEn: translations.en?.summary || summary,
        summary,
        contentBody,
        featuredImageURL,
        isActive,
        isPinned,
        translations,
        publishedAt: new Date().toISOString(),
      };
      updatedList = [newArt, ...items];
      setItems(updatedList);
      syncNewsToDatabase(updatedList);
      showToast('เพิ่มข่าวสารใหม่ลงฐานข้อมูลกลางเรียบร้อยแล้ว');
    }

    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deletingId) {
      const updatedList = items.filter((item) => item.id !== deletingId);
      setItems(updatedList);
      syncNewsToDatabase(updatedList);
      showToast('ลบข่าวสารออกจากฐานข้อมูลเรียบร้อยแล้ว');
      setDeleteConfirmOpen(false);
      setDeletingId(null);
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-2xl animate-bounce">
          <Check className="h-5 w-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with High-Visibility Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-theme-border pb-6">
        <div>
          <h1 className="font-display text-2xl font-black text-theme-text flex items-center gap-2">
            <Newspaper className="h-6 w-6 text-theme-primary" />
            <span>{t('admin.newsTitle', 'จัดการข่าวสารและกิจกรรมองค์กร (News & CSR Database)')}</span>
          </h1>
          <p className="text-xs text-theme-text-muted mt-1">
            {t('admin.newsSubtitle', 'เพิ่ม, แก้ไข, แนบรูปภาพ และ เปิด/ปิด การแสดงผลข่าวสารองค์กร (บันทึกลง Database อัตโนมัติ)')}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-primary-action text-sm font-black px-6 py-3 shadow-xl"
        >
          <Plus className="h-4 w-4" />
          <span>{t('admin.addNewNews', '+ เพิ่มข่าวสารใหม่')}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl border border-theme-border bg-theme-surface p-4 shadow-glass-edge flex items-center justify-between">
        <div className="w-full sm:w-80 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('admin.searchNewsPlaceholder', 'ค้นหาตามหัวข้อข่าว หรือหมวดหมู่...')}
            className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated py-2 px-3 text-xs text-theme-text placeholder-theme-text-dim focus:border-theme-primary focus:outline-none"
          />
        </div>
      </div>

      {/* News Table with Status Toggle Column */}
      <div className="rounded-2xl border border-theme-border bg-theme-surface shadow-2xl overflow-hidden">
        {isLoading && items.length === 0 ? (
          <TableSkeleton rows={4} columns={6} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-theme-text-muted">
              <thead>
                <tr className="border-b border-theme-border bg-theme-surface-elevated text-theme-text font-semibold">
                  <th className="py-3 px-4">{t('admin.tableImage', 'รูปภาพ')}</th>
                  <th className="py-3 px-4">{t('admin.tableNewsTitle', 'หัวข้อข่าวสาร')}</th>
                  <th className="py-3 px-4">{t('admin.tableCategory', 'หมวดหมู่')}</th>
                  <th className="py-3 px-4">{t('admin.tablePublishedDate', 'วันที่เผยแพร่')}</th>
                  <th className="py-3 px-4 text-center">{t('admin.tableVisibility', 'เปิด/ปิด บนเว็บ')}</th>
                  <th className="py-3 px-4 text-right">{t('admin.tableActions', 'จัดการ')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-theme-text-dim">
                      {t('admin.tableNoData', 'ไม่พบข้อมูลข่าวสาร')}
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((article) => (
                    <tr
                      key={article.id}
                      className="border-b border-theme-border/50 hover:bg-theme-surface-elevated/40 transition-colors"
                    >
                      <td className="py-2.5 px-4">
                        <img
                          src={article.featuredImageURL || '/images/factory-building.jpg'}
                          alt={article.title}
                          className="h-10 w-14 object-cover rounded-lg border border-theme-border"
                        />
                      </td>
                      <td className="py-3 px-4 font-bold text-theme-text max-w-sm truncate">
                        {article.title}
                      </td>
                      <td className="py-3 px-4">
                        <span className="rounded-full bg-theme-primary/10 border border-theme-primary/30 px-2.5 py-0.5 text-[10px] font-bold text-theme-primary">
                          {article.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-theme-text-dim">
                        {new Date(article.publishedAt || Date.now()).toLocaleDateString('th-TH')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(article.id)}
                          className={`rounded-full px-3 py-1 text-[10px] font-bold inline-flex items-center gap-1.5 transition-all ${
                            article.isActive !== false
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                              : 'bg-slate-500/20 text-slate-400 border border-slate-500/30 hover:bg-slate-500/30'
                          }`}
                          title="คลิกเพื่อ เปิด/ปิด การแสดงผลข่าวสารนี้บนหน้าเว็บ"
                        >
                          {article.isActive !== false ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                          <span>{article.isActive !== false ? 'เผยแพร่' : 'ซ่อน'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleTogglePin(article.id)}
                          className={`rounded-lg border p-1.5 transition-all ${
                            article.isPinned
                              ? 'border-amber-500/60 bg-amber-500/20 text-amber-300 shadow-sm'
                              : 'border-theme-border bg-theme-surface text-theme-text-muted hover:text-amber-400 hover:border-amber-500/40'
                          }`}
                          title={article.isPinned ? 'ยกเลิกการปักหมุดข่าวเด่น' : 'ปักหมุดข่าวเด่นบนหน้าแรก'}
                        >
                          <Pin className={`h-3.5 w-3.5 ${article.isPinned ? 'fill-amber-400 text-amber-400' : ''}`} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(article)}
                          className="rounded-lg border border-theme-border bg-theme-surface p-1.5 text-theme-text-muted hover:text-theme-primary hover:border-theme-primary transition-colors"
                          title="แก้ไขข่าวสาร"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeletingId(article.id);
                            setDeleteConfirmOpen(true);
                          }}
                          className="rounded-lg border border-theme-border bg-theme-surface p-1.5 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-colors"
                          title="ลบข่าวสาร"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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
          totalItems={filteredItems.length}
          totalPages={Math.ceil(filteredItems.length / pageSize) || 1}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Add/Edit Modal with Image Attachment & Show/Hide Switch */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingArticle ? 'แก้ไขข่าวสาร (Edit Article)' : 'เพิ่มข่าวสารใหม่ (Create Article)'}
        maxWidth="2xl"
      >
        <div className="space-y-4 text-xs">
          {/* Status Switches (Visibility & Pin to Homepage) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 rounded-xl border border-theme-border bg-theme-surface-elevated">
              <span className="font-bold text-theme-text">สถานะการเผยแพร่</span>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`rounded-full px-3 py-1 text-xs font-bold inline-flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {isActive ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                <span>{isActive ? 'เผยแพร่' : 'ฉบับร่าง'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-theme-border bg-theme-surface-elevated">
              <span className="font-bold text-theme-text flex items-center gap-1.5">
                <Pin className="h-3.5 w-3.5 text-amber-400" />
                <span>ปักหมุดหน้าแรก</span>
              </span>
              <button
                type="button"
                onClick={() => setIsPinned(!isPinned)}
                className={`rounded-full px-3 py-1 text-xs font-bold inline-flex items-center gap-1.5 transition-all ${
                  isPinned
                    ? 'bg-amber-500 text-black shadow-sm font-black'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                <Pin className={`h-3 w-3 ${isPinned ? 'fill-black' : ''}`} />
                <span>{isPinned ? '📌 ปักหมุดแล้ว' : 'ไม่ปักหมุด'}</span>
              </button>
            </div>
          </div>

          <div>
            <label className="font-bold text-theme-text block mb-1">หัวข้อข่าวสาร (Title) *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น บริษัท โลหะกิจฯ เปิดตัวสายการผลิตใหม่ความเร็วสูง..."
              className="w-full rounded-xl border border-theme-border bg-theme-surface px-3 py-2 text-theme-text"
            />
          </div>

          <div>
            <label className="font-bold text-theme-text block mb-1">หมวดหมู่ (Category)</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-theme-border bg-theme-surface px-3 py-2 text-theme-text"
            >
              <option value="Tech & Innovation">Tech & Innovation</option>
              <option value="CSR & Environment">CSR & Environment</option>
              <option value="Corporate News">Corporate News</option>
              <option value="Awards & Standards">Awards & Standards</option>
            </select>
          </div>

          {/* Image Attachment & Preview */}
          <div className="rounded-2xl border border-theme-border bg-theme-surface-elevated p-3.5 space-y-3">
            <label className="font-bold text-theme-text block">รูปภาพหน้าปกข่าวสาร (Featured Image)</label>
            <div className="flex items-center gap-4">
              <img
                src={featuredImageURL || '/images/factory-building.jpg'}
                alt="News Preview"
                className="h-16 w-24 object-cover rounded-xl border border-theme-border"
              />
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={featuredImageURL}
                  onChange={(e) => setFeaturedImageURL(e.target.value)}
                  placeholder="URL รูปภาพ หรือเลือกไฟล์จากเครื่อง"
                  className="w-full rounded-xl border border-theme-border bg-theme-surface px-3 py-1.5 text-theme-text font-mono text-[11px]"
                />
                <label className="inline-flex items-center gap-1.5 rounded-lg border border-theme-border bg-theme-surface px-3 py-1 text-[11px] font-bold text-theme-primary hover:border-theme-primary cursor-pointer transition-all">
                  <UploadCloud className="h-3.5 w-3.5" />
                  <span>เลือกรูปภาพจากคอมพิวเตอร์ / อัปโหลด</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="font-bold text-theme-text block mb-1">เนื้อหาย่อ (Summary)</label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="สรุปเนื้อหาสำคัญของข่าวสาร..."
              className="w-full rounded-xl border border-theme-border bg-theme-surface px-3 py-2 text-theme-text"
            />
          </div>

          <div>
            <label className="font-bold text-theme-text block mb-1">เนื้อหาข่าวฉบับเต็ม (Full Content Body)</label>
            <textarea
              rows={4}
              value={contentBody}
              onChange={(e) => setContentBody(e.target.value)}
              placeholder="รายละเอียดข่าวสารทั้งหมด..."
              className="w-full rounded-xl border border-theme-border bg-theme-surface px-3 py-2 text-theme-text font-sans"
            />
          </div>

          {/* 5-Language Translation Tabs for News Article */}
          <div className="pt-2">
            <MultiLangSectionEditor
              compact
              title="แปลภาษาข่าวสาร (News Translations: EN, JP, CN, MM)"
              fields={[
                { key: 'title', label: 'หัวข้อข่าวสาร (Title)' },
                { key: 'summary', label: 'เนื้อหาย่อ (Summary)', type: 'textarea', rows: 2 },
                { key: 'contentBody', label: 'เนื้อหาข่าวฉบับเต็ม (Full Content Body)', type: 'textarea', rows: 3 },
              ]}
              value={translations}
              onChange={setTranslations}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-theme-border">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-xl border border-theme-border bg-theme-surface px-4 py-2 font-semibold text-theme-text hover:bg-theme-surface-elevated transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn-primary-action text-xs font-black px-6 py-2.5"
            >
              บันทึกข่าวสาร (ลง Database)
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="ยืนยันการลบข่าวสาร"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบรายการข่าวสารนี้ออกจากฐานข้อมูล?"
        variant="danger"
      />
    </div>
  );
};
