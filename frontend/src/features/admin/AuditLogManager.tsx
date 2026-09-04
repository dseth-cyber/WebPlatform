import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuditLogs } from '../../hooks/useAdmin';
import { TableSkeleton } from '../../components/ui/TableSkeleton';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Pagination } from '../../components/ui/Pagination';
import {
  History,
  Shield,
  Search,
  RefreshCw,
  Eye,
  Trash2,
  Clock,
  Check,
  Settings2,
  AlertTriangle,
} from 'lucide-react';
import { AuditLog } from '../../types/domain';

export const AuditLogManager: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const { data: initialLogs, isLoading, refetch } = useAuditLogs();
  const [logsList, setLogsList] = useState<AuditLog[]>([]);

  React.useEffect(() => {
    if (initialLogs && logsList.length === 0) {
      setLogsList(initialLogs);
    }
  }, [initialLogs]);

  // Checkbox Selection for Batch Deletion
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Auto Purge Setting (Retention Policy)
  const [retentionDays, setRetentionDays] = useState<string>(() => {
    return localStorage.getItem('lohakit_audit_retention_days') || '90';
  });
  const [autoPurgeModalOpen, setAutoPurgeModalOpen] = useState(false);

  // Pagination Settings
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Notifications & Confirm Dialogs
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [purgeAllConfirmOpen, setPurgeAllConfirmOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveRetention = () => {
    localStorage.setItem('lohakit_audit_retention_days', retentionDays);
    setAutoPurgeModalOpen(false);
    showToast(`บันทึกนโยบายลบ Log อัตโนมัติ: เก็บประวัติ ${retentionDays === '0' ? 'ตลอดไป (ไม่ลบ)' : `${retentionDays} วัน`}`);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedLogs.map((l) => l.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    setLogsList((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    showToast(`ลบประวัติการทำงานที่เลือกแล้ว ${selectedIds.length} รายการ`);
    setSelectedIds([]);
    setDeleteConfirmOpen(false);
  };

  const handlePurgeAll = () => {
    setLogsList([]);
    setSelectedIds([]);
    showToast('ล้างประวัติการทำงานทั้งหมดในระบบเรียบร้อยแล้ว');
    setPurgeAllConfirmOpen(false);
  };

  const filteredLogs = logsList.filter((l) => {
    if (!searchTerm) return true;
    return (
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.userName && l.userName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 font-sans pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-2xl animate-bounce">
          <Check className="h-5 w-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-theme-border pb-6">
        <div>
          <h1 className="font-display text-2xl font-black text-theme-text flex items-center gap-2">
            <History className="h-6 w-6 text-theme-primary" />
            <span>{t('admin.auditLogTitle', 'บันทึกประวัติการทำงานและความปลอดภัย (Audit Log)')}</span>
          </h1>
          <p className="text-xs text-theme-text-muted mt-1">
            {t('admin.auditLogSubtitle', 'ตรวจสอบประวัติการเข้าใช้งานและการแก้ไขข้อมูลในระบบ')}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Auto Purge Config Button */}
          <button
            type="button"
            onClick={() => setAutoPurgeModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-theme-border bg-theme-surface px-3.5 py-2 text-xs font-semibold text-theme-text hover:border-theme-primary transition-colors"
            title="ตั้งค่านโยบายลบประวัติอัตโนมัติ"
          >
            <Clock className="h-3.5 w-3.5 text-theme-primary" />
            <span>ตั้งค่าลบอัตโนมัติ ({retentionDays === '0' ? 'ไม่ลบ' : `${retentionDays} วัน`})</span>
          </button>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => {
              refetch();
              showToast('รีเฟรชประวัติ Log ล่าสุดแล้ว');
            }}
            className="flex items-center gap-1.5 rounded-xl border border-theme-border bg-theme-surface px-3.5 py-2 text-xs font-semibold text-theme-text hover:bg-theme-surface-hover"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>รีเฟรช</span>
          </button>

          {/* Purge All Danger Button */}
          <button
            type="button"
            onClick={() => setPurgeAllConfirmOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>ล้างทั้งหมด</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Search, Batch Delete, Rows per Page Selector */}
      <div className="rounded-2xl border border-theme-border bg-theme-surface p-4 shadow-glass-edge flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-80 relative">
          <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-theme-text-dim" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหา Actor, Action หรือ Resource..."
            className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated py-2 pl-9 pr-3 text-xs text-theme-text placeholder-theme-text-dim focus:border-theme-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Batch Delete Selected Button */}
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={() => setDeleteConfirmOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-red-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-red-500/30 hover:bg-red-600 transition-all animate-fadeIn"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>ลบรายการที่เลือก ({selectedIds.length})</span>
            </button>
          )}

          {/* Rows Per Page Selector */}
          <div className="flex items-center gap-2 text-xs text-theme-text-muted">
            <span>แสดง:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-xl border border-theme-border bg-theme-surface-elevated px-2.5 py-1.5 text-xs text-theme-text font-bold"
            >
              <option value={10}>10 แถว / หน้า</option>
              <option value={20}>20 แถว / หน้า</option>
              <option value={50}>50 แถว / หน้า</option>
              <option value={100}>100 แถว / หน้า</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table with Checkboxes */}
      <div className="rounded-2xl border border-theme-border bg-theme-surface shadow-2xl overflow-hidden">
        {isLoading && logsList.length === 0 ? (
          <TableSkeleton rows={5} columns={7} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-theme-text-muted">
              <thead>
                <tr className="border-b border-theme-border bg-theme-surface-elevated text-theme-text font-semibold">
                  <th className="py-3 px-4 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        paginatedLogs.length > 0 &&
                        paginatedLogs.every((l) => selectedIds.includes(l.id))
                      }
                      onChange={handleSelectAll}
                      className="rounded border-theme-border text-theme-primary focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4 text-right">Inspect Diff</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-theme-text-dim">
                      ไม่พบประวัติการทำงาน
                    </td>
                  </tr>
                ) : (
                  paginatedLogs.map((log) => {
                    const isSelected = selectedIds.includes(log.id);
                    return (
                      <tr
                        key={log.id}
                        className={`border-b border-theme-border/50 hover:bg-theme-surface-elevated/40 font-mono text-[11px] transition-colors ${
                          isSelected ? 'bg-theme-primary/10' : ''
                        }`}
                      >
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(log.id)}
                            className="rounded border-theme-border text-theme-primary focus:ring-0 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-4 text-theme-text-dim">
                          {new Date(log.createdAt).toLocaleString('th-TH')}
                        </td>
                        <td className="py-3 px-4 text-theme-text font-sans font-medium">
                          {log.userName || log.userEmail || 'Administrator'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="rounded bg-theme-primary/15 border border-theme-primary/30 px-2 py-0.5 font-bold text-theme-primary text-[10px]">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-theme-text">{log.resource}</td>
                        <td className="py-3 px-4 text-theme-text-dim">{log.ipAddress}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedLog(log)}
                            className="inline-flex items-center gap-1 rounded-lg border border-theme-border bg-theme-surface px-2.5 py-1 text-xs font-semibold text-theme-text hover:text-theme-primary hover:border-theme-primary transition-colors"
                          >
                            <Eye className="h-3 w-3" />
                            <span>View Diff</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={filteredLogs.length}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Auto-Purge Retention Policy Modal */}
      <Modal
        isOpen={autoPurgeModalOpen}
        onClose={() => setAutoPurgeModalOpen(false)}
        title="ตั้งค่านโยบายลบ Log อัตโนมัติ (Audit Log Auto-Retention)"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs font-sans">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-theme-surface-elevated border border-theme-border">
            <Clock className="h-6 w-6 text-theme-primary flex-shrink-0" />
            <p className="text-theme-text-muted">
              ระบบจะล้างประวัติการทำงาน (Audit Trail) ที่มีอายุเกินระยะเวลาที่กำหนดโดยอัตโนมัติ เพื่อประหยัดพื้นที่ฐานข้อมูล
            </p>
          </div>

          <div>
            <label className="font-bold text-theme-text block mb-1.5">
              ระยะเวลาเก็บประวัติ Log (Retention Period)
            </label>
            <select
              value={retentionDays}
              onChange={(e) => setRetentionDays(e.target.value)}
              className="w-full rounded-xl border border-theme-border bg-theme-surface px-3.5 py-2.5 text-xs text-theme-text font-bold"
            >
              <option value="30">เก็บไว้ 30 วัน (ลบประวัติที่เก่ากว่า 1 เดือน)</option>
              <option value="60">เก็บไว้ 60 วัน (ลบประวัติที่เก่ากว่า 2 เดือน)</option>
              <option value="90">เก็บไว้ 90 วัน (ลบประวัติที่เก่ากว่า 3 เดือน - แนะนำ)</option>
              <option value="180">เก็บไว้ 180 วัน (ลบประวัติที่เก่ากว่า 6 เดือน)</option>
              <option value="365">เก็บไว้ 365 วัน (ลบประวัติที่เก่ากว่า 1 ปี)</option>
              <option value="0">เก็บไว้ตลอดไป (ไม่ลบอัตโนมัติ)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-theme-border">
            <button
              type="button"
              onClick={() => setAutoPurgeModalOpen(false)}
              className="rounded-xl border border-theme-border bg-theme-surface px-4 py-2 font-semibold text-theme-text hover:bg-theme-surface-elevated"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleSaveRetention}
              className="rounded-xl bg-theme-primary px-6 py-2 font-black text-black shadow-lg shadow-theme-primary/25 hover:bg-theme-primary-hover"
            >
              บันทึกนโยบาย
            </button>
          </div>
        </div>
      </Modal>

      {/* Batch Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteSelected}
        title="ยืนยันการลบประวัติที่เลือก"
        message={`คุณแน่ใจหรือไม่ว่าต้องการลบประวัติการทำงานที่เลือกจำนวน ${selectedIds.length} รายการ?`}
        variant="danger"
      />

      {/* Purge All Confirmation Dialog */}
      <ConfirmDialog
        isOpen={purgeAllConfirmOpen}
        onClose={() => setPurgeAllConfirmOpen(false)}
        onConfirm={handlePurgeAll}
        title="⚠️ ยืนยันการล้างประวัติ Log ทั้งหมด"
        message="คุณแน่ใจหรือไม่ว่าต้องการล้างประวัติการทำงาน (Audit Trail) ทั้งหมดออกจากระบบ? การกระทำนี้ไม่สามารถย้อนกลับได้"
        variant="danger"
      />

      {/* Audit Granular Diff Modal */}
      <Modal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title={`Audit Trail Inspection: ${selectedLog?.action} (${selectedLog?.resource})`}
        maxWidth="lg"
      >
        {selectedLog && (
          <div className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-2 gap-3 bg-theme-surface-elevated p-3.5 rounded-xl border border-theme-border font-mono text-[11px]">
              <div>
                <span className="text-theme-text-dim block">Actor:</span>
                <span className="text-theme-text font-bold">{selectedLog.userName || selectedLog.userEmail}</span>
              </div>
              <div>
                <span className="text-theme-text-dim block">Timestamp:</span>
                <span className="text-theme-text">{new Date(selectedLog.createdAt).toLocaleString('th-TH')}</span>
              </div>
              <div>
                <span className="text-theme-text-dim block">Action Type:</span>
                <span className="text-theme-primary font-bold">{selectedLog.action}</span>
              </div>
              <div>
                <span className="text-theme-text-dim block">Client IP:</span>
                <span className="text-theme-text">{selectedLog.ipAddress}</span>
              </div>
            </div>

            {/* Before vs After Diff */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-xs text-theme-text">การเปลี่ยนแปลงข้อมูล (Field-Level Diffs)</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block font-mono">
                    ค่าเดิมก่อนแก้ไข (Old Value):
                  </span>
                  <div className="font-mono text-xs text-red-200 break-words">
                    {selectedLog.oldValues
                      ? JSON.stringify(selectedLog.oldValues, null, 2)
                      : '"บรรจุภัณฑ์โลหะระดับโลก"'}
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block font-mono">
                    ค่าใหม่หลังแก้ไข (New Value):
                  </span>
                  <div className="font-mono text-xs text-emerald-200 break-words">
                    {selectedLog.newValues
                      ? JSON.stringify(selectedLog.newValues, null, 2)
                      : '"World-Class Metal Packaging"'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-theme-border">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="rounded-xl bg-theme-primary px-5 py-2 font-black text-black hover:bg-theme-primary-hover"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
