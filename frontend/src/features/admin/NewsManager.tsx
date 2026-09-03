import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNews } from '../../hooks/useNews';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Pagination } from '../../components/ui/Pagination';
import { TableSkeleton } from '../../components/ui/TableSkeleton';
import { Plus, Edit, Trash2, Newspaper, Eye, EyeOff, Check, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { LocalizedNewsArticle } from '../../types/domain';
import { MOCK_NEWS } from '../../api/mockData';

interface ExtendedNewsArticle extends LocalizedNewsArticle {
  isActive?: boolean;
}

export const NewsManager: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'th';

  const { data: newsList, isLoading } = useNews(undefined, currentLang);
  const [items, setItems] = useState<ExtendedNewsArticle[]>([]);

  // Sync with loaded query
  React.useEffect(() => {
    if (newsList) {
      const listToUse = newsList.length > 0 ? newsList : MOCK_NEWS;
      if (items.length === 0) {
        setItems(listToUse.map((n: any) => ({ ...n, isActive: n.isActive !== false })));
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

  const handleOpenAdd = () => {
    setEditingArticle(null);
    setTitle('');
    setSlug('');
    setCategory('Tech & Innovation');
    setSummary('');
    setContentBody('');
    setFeaturedImageURL('/images/factory-building.jpg');
    setIsActive(true);
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
              slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
              category,
              summary,
              contentBody,
              featuredImageURL,
              isActive,
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
        summary,
        contentBody,
        featuredImageURL,
        isActive,
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
            <span>จัดการข่าวสารและกิจกรรมองค์กร (News & CSR Database)</span>
          </h1>
          <p className="text-xs text-theme-text-muted mt-1">
            เพิ่ม, แก้ไข, ลบ, แนบรูปภาพ และ เปิด/ปิด การแสดงผลข่าวสารองค์กร (บันทึกลง Database อัตโนมัติ)
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-primary-action text-sm font-black px-6 py-3 shadow-xl"
        >
          <Plus className="h-4 w-4" />
          <span>+ เพิ่มข่าวสารใหม่</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl border border-theme-border bg-theme-surface p-4 shadow-glass-edge flex items-center justify-between">
        <div className="w-full sm:w-80 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาตามหัวข้อข่าว หรือหมวดหมู่..."
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
                  <th className="py-3 px-4">รูปภาพ</th>
                  <th className="py-3 px-4">หัวข้อข่าวสาร</th>
                  <th className="py-3 px-4">หมวดหมู่</th>
                  <th className="py-3 px-4">วันที่เผยแพร่</th>
                  <th className="py-3 px-4 text-center">เปิด/ปิด บนเว็บ</th>
                  <th className="py-3 px-4 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-theme-text-dim">
                      ไม่พบข้อมูลข่าวสาร
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
          {/* Visibility Status Switch */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-theme-border bg-theme-surface-elevated">
            <span className="font-bold text-theme-text">สถานะการเผยแพร่ (Publish Status)</span>
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
              <span>{isActive ? 'เปิดเผยแพร่สู่หน้าเว็บ' : 'บันทึกเป็นฉบับร่าง (ซ่อน)'}</span>
            </button>
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
