import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaLibrary, useDeleteMediaMutation } from '../../hooks/useMedia';
import { SearchableSelect, SelectOption } from '../../components/ui/SearchableSelect';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import {
  UploadCloud,
  Search,
  Trash2,
  Copy,
  Check,
  FileText,
  Image as ImageIcon,
  Film,
  Plus,
  Eye,
  EyeOff,
} from 'lucide-react';
import { MediaFile } from '../../types/domain';
import { compressImageFile } from '../../utils/imageCompressor';

export const MediaLibrary: React.FC = () => {
  const { t } = useTranslation();
  const [folderFilter, setFolderFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { data: initialMediaFiles, isLoading } = useMediaLibrary(
    folderFilter === 'all' ? undefined : folderFilter,
    undefined,
    searchTerm
  );

  const [localFiles, setLocalFiles] = useState<MediaFile[]>([]);

  React.useEffect(() => {
    const savedCustomMediaStr = localStorage.getItem('lohakit_custom_media');
    const customMedia: MediaFile[] = savedCustomMediaStr ? JSON.parse(savedCustomMediaStr) : [];

    if (initialMediaFiles) {
      // Merge custom uploaded files with default media
      const existingIds = new Set(customMedia.map((m) => m.id));
      const remainingInitial = initialMediaFiles.filter((m) => !existingIds.has(m.id));
      setLocalFiles([...customMedia, ...remainingInitial]);
    } else if (customMedia.length > 0 && localFiles.length === 0) {
      setLocalFiles(customMedia);
    }
  }, [initialMediaFiles]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const folderOptions: SelectOption[] = [
    { value: 'all', label: `✨ ${t('common.all')} (โฟลเดอร์ทั้งหมด)` },
    { value: 'products', label: '📦 products (รูปภาพสินค้า)' },
    { value: 'facility', label: '🏭 facility (โรงงานและเครื่องจักร)' },
    { value: 'news', label: '📰 news (ภาพข่าวสาร)' },
    { value: 'general', label: '📁 general (ทั่วไป)' },
  ];

  const handleCopyURL = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('คัดลอก URL ของไฟล์เรียบร้อยแล้ว');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newMediaList: MediaFile[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let dataUrl: string;
        try {
          if (file.type.startsWith('image/')) {
            dataUrl = await compressImageFile(file, 1920, 1080, 0.85);
          } else {
            dataUrl = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = (ev) => resolve((ev.target?.result as string) || '');
              reader.readAsDataURL(file);
            });
          }
        } catch (e) {
          continue;
        }

        newMediaList.push({
          id: 'media-' + Date.now() + '-' + i,
          filename: file.name,
          originalFilename: file.name,
          bucket: 'lohakit-media',
          storageKey: `${folderFilter === 'all' ? 'general' : folderFilter}/${file.name}`,
          mimeType: file.type || 'image/jpeg',
          fileSize: file.size,
          hashSha256: 'sha256-' + Date.now(),
          altText: { th: file.name, en: file.name },
          folder: folderFilter === 'all' ? 'general' : folderFilter,
          url: dataUrl,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      setLocalFiles((prev) => {
        const updated = [...newMediaList, ...prev];
        // Persist custom media safely
        try {
          const savedCustomMediaStr = localStorage.getItem('lohakit_custom_media');
          const customMedia: MediaFile[] = savedCustomMediaStr ? JSON.parse(savedCustomMediaStr) : [];
          localStorage.setItem('lohakit_custom_media', JSON.stringify([...newMediaList, ...customMedia]));
        } catch (e) {
          console.warn('localStorage quota exceeded for custom media');
        }
        return updated;
      });

      showToast(`อัปโหลดและบันทึกไฟล์สื่อสำเร็จ ${newMediaList.length} รายการ`);
      setUploadModalOpen(false);
    }
  };

  const handleDeleteMedia = (id: string) => {
    setLocalFiles((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      const savedCustomMediaStr = localStorage.getItem('lohakit_custom_media');
      if (savedCustomMediaStr) {
        const customMedia: MediaFile[] = JSON.parse(savedCustomMediaStr);
        const filteredCustom = customMedia.filter((f) => f.id !== id);
        localStorage.setItem('lohakit_custom_media', JSON.stringify(filteredCustom));
      }
      return updated;
    });
    setSelectedMedia(null);
    showToast('ลบไฟล์สื่อเรียบร้อยแล้ว');
  };

  const filteredMedia = localFiles.filter((f) => {
    if (folderFilter !== 'all' && f.folder !== folderFilter) return false;
    if (searchTerm && !f.filename.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-2xl animate-bounce">
          <Check className="h-5 w-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with Upload Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-theme-border pb-6">
        <div>
          <h1 className="font-display text-2xl font-black text-theme-text flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-theme-primary" />
            <span>{t('admin.mediaTitle', 'คลังไฟล์สื่อและรูปภาพ (Media Library Storage)')}</span>
          </h1>
          <p className="text-xs text-theme-text-muted mt-1">
            {t('admin.mediaSubtitle', 'อัปโหลดและจัดการรูปภาพสำหรับใช้งานบนเว็บไซต์และแคตตาล็อก')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-theme-primary px-5 py-2.5 text-xs font-black text-black shadow-lg shadow-theme-primary/25 hover:bg-theme-primary-hover transition-all"
        >
          <UploadCloud className="h-4 w-4 text-black" />
          <span>+ อัปโหลดไฟล์ใหม่</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="rounded-2xl border border-theme-border bg-theme-surface p-4 shadow-glass-edge flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-72">
          <SearchableSelect
            options={folderOptions}
            value={folderFilter}
            onChange={setFolderFilter}
          />
        </div>

        <div className="w-full sm:w-80 relative">
          <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-theme-text-dim" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาชื่อไฟล์..."
            className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated py-2 pl-9 pr-3 text-xs text-theme-text placeholder-theme-text-dim focus:border-theme-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredMedia.map((file) => (
          <div
            key={file.id}
            onClick={() => setSelectedMedia(file)}
            className="group cursor-pointer rounded-2xl border border-theme-border bg-theme-surface p-2.5 shadow-sm hover:border-theme-primary hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div className="aspect-square w-full rounded-xl overflow-hidden bg-theme-surface-elevated flex items-center justify-center relative">
              {file.mimeType.startsWith('image/') ? (
                <img
                  src={file.url}
                  alt={file.filename}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : file.mimeType.includes('pdf') ? (
                <FileText className="h-10 w-10 text-red-400" />
              ) : (
                <Film className="h-10 w-10 text-blue-400" />
              )}
            </div>

            <div className="pt-2">
              <p className="text-[11px] font-bold text-theme-text truncate">{file.filename}</p>
              <div className="flex items-center justify-between text-[10px] text-theme-text-dim font-mono mt-0.5">
                <span>{(file.fileSize / 1024).toFixed(0)} KB</span>
                <span className="uppercase text-theme-primary font-bold">{file.folder}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Media Details Modal with Actions */}
      <Modal
        isOpen={!!selectedMedia}
        onClose={() => setSelectedMedia(null)}
        title={selectedMedia?.filename || 'Media Details'}
        maxWidth="lg"
      >
        {selectedMedia && (
          <div className="space-y-4 text-xs font-sans">
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/40 border border-theme-border flex items-center justify-center">
              {selectedMedia.mimeType.startsWith('image/') ? (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.filename}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <FileText className="h-16 w-16 text-theme-primary" />
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 bg-theme-surface p-4 rounded-xl border border-theme-border font-mono text-[11px]">
              <div>
                <span className="text-theme-text-dim block">ชื่อไฟล์:</span>
                <span className="text-theme-text truncate block font-bold">{selectedMedia.filename}</span>
              </div>
              <div>
                <span className="text-theme-text-dim block">โฟลเดอร์:</span>
                <span className="text-theme-primary uppercase font-bold">{selectedMedia.folder}</span>
              </div>
              <div>
                <span className="text-theme-text-dim block">File Size:</span>
                <span className="text-theme-text">{(selectedMedia.fileSize / 1024).toFixed(1)} KB</span>
              </div>
              <div>
                <span className="text-theme-text-dim block">URL Path:</span>
                <span className="text-theme-text truncate block">{selectedMedia.url}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-theme-border">
              <button
                type="button"
                onClick={() => handleCopyURL(selectedMedia.url, selectedMedia.id)}
                className="flex items-center gap-1.5 rounded-xl border border-theme-border bg-theme-surface px-4 py-2 text-xs font-bold text-theme-text hover:text-theme-primary hover:border-theme-primary transition-all"
              >
                {copiedId === selectedMedia.id ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span>{copiedId === selectedMedia.id ? 'คัดลอก URL แล้ว!' : 'คัดลอก Asset URL'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDeleteMedia(selectedMedia.id)}
                className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all"
              >
                <Trash2 className="h-4 w-4" />
                <span>{t('admin.deleteFile', 'ลบไฟล์นี้')}</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Upload Drag & Drop Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="อัปโหลดไฟล์สื่อใหม่ (Upload Assets)"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs font-sans">
          <div className="rounded-2xl border-2 border-dashed border-theme-primary/40 bg-theme-surface/50 p-8 text-center space-y-3">
            <UploadCloud className="h-10 w-10 text-theme-primary mx-auto animate-bounce" />
            <p className="font-bold text-sm text-theme-text">{t('admin.dragDropMedia', 'ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์')}</p>
            <p className="text-[11px] text-theme-text-dim">รองรับ JPG, PNG, WEBP, SVG, PDF สูงสุด 50MB</p>
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload-input"
            />
            <button
              type="button"
              onClick={() => document.getElementById('file-upload-input')?.click()}
              className="mt-2 rounded-xl bg-theme-primary px-5 py-2.5 text-xs font-black text-black shadow-md hover:bg-theme-primary-hover"
            >
              เลือกไฟล์จากเครื่อง
            </button>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setUploadModalOpen(false)}
              className="rounded-xl border border-theme-border bg-theme-surface px-4 py-2 text-theme-text"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
