import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReAuthMutation, usePermanentDeleteMutation } from '../../hooks/useAdmin';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Trash2, RotateCcw, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface TrashItem {
  id: string;
  entityType: 'page' | 'product' | 'news' | 'media';
  title: string;
  deletedAt: string;
}

export const TrashManager: React.FC = () => {
  const { t } = useTranslation();
  const [trashItems, setTrashItems] = useState<TrashItem[]>([
    {
      id: 'trash-1',
      entityType: 'product',
      title: 'กระป๋องอาหารสำเร็จรูป ขนาดทดลอง 200x300',
      deletedAt: '2026-09-01T10:00:00Z',
    },
    {
      id: 'trash-2',
      entityType: 'media',
      title: 'old-chemical-drum-v1.png',
      deletedAt: '2026-08-30T14:20:00Z',
    },
  ]);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    item?: TrashItem;
    action: 'restore' | 'permanent_delete' | 'empty_trash';
  }>({
    isOpen: false,
    action: 'restore',
  });

  const reAuthMutation = useReAuthMutation();
  const permDeleteMutation = usePermanentDeleteMutation();

  const handleConfirmAction = async (password?: string) => {
    if (confirmDialog.action === 'permanent_delete' || confirmDialog.action === 'empty_trash') {
      // Re-authenticate password first
      if (password) {
        await reAuthMutation.mutateAsync(password);
      }
      if (confirmDialog.item) {
        await permDeleteMutation.mutateAsync({
          entityType: confirmDialog.item.entityType,
          id: confirmDialog.item.id,
        });
        setTrashItems(trashItems.filter((i) => i.id !== confirmDialog.item?.id));
      } else if (confirmDialog.action === 'empty_trash') {
        setTrashItems([]);
      }
    } else if (confirmDialog.action === 'restore' && confirmDialog.item) {
      setTrashItems(trashItems.filter((i) => i.id !== confirmDialog.item?.id));
    }
    setConfirmDialog({ ...confirmDialog, isOpen: false });
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-theme-border pb-6">
        <div>
          <h1 className="font-display text-2xl font-black text-theme-text flex items-center gap-2">
            <Trash2 className="h-6 w-6 text-red-400" />
            <span>{t('admin.trashTitle', 'ถังขยะและกู้คืนข้อมูล (Trash & Data Recovery)')}</span>
          </h1>
          <p className="text-xs text-theme-text-muted mt-1">
            {t('admin.trashSubtitle', 'กู้คืนหรือลบข้อมูลที่ถูกลบออกจากระบบอย่างถาวร')}
          </p>
        </div>

        {trashItems.length > 0 && (
          <button
            type="button"
            onClick={() =>
              setConfirmDialog({
                isOpen: true,
                action: 'empty_trash',
              })
            }
            className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all"
          >
            <ShieldAlert className="h-4 w-4" />
            <span>Empty Trash (ล้างถังขยะถาวร)</span>
          </button>
        )}
      </div>

      {trashItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-theme-border bg-theme-surface p-12 text-center space-y-2 text-theme-text-muted">
          <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-theme-text">ถังขยะว่างเปล่า</p>
          <p className="text-xs text-theme-text-dim">ไม่มีรายการที่ถูกลบชั่วคราวในขณะนี้</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-theme-border bg-theme-surface shadow-2xl overflow-hidden">
          <table className="w-full text-left text-xs text-theme-text-muted">
            <thead>
              <tr className="border-b border-theme-border bg-theme-surface-elevated text-theme-text font-semibold">
                <th className="py-3 px-4">{t('admin.tableEntity', 'Entity Type')}</th>
                <th className="py-3 px-4">{t('admin.tableProductName', 'Title / Name')}</th>
                <th className="py-3 px-4">{t('admin.tableDeletedAt', 'Deleted At')}</th>
                <th className="py-3 px-4 text-right">{t('admin.tableActions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {trashItems.map((item) => (
                <tr key={item.id} className="border-b border-theme-border/50 hover:bg-theme-surface-elevated/40">
                  <td className="py-3 px-4">
                    <span className="rounded bg-theme-surface-elevated px-2 py-0.5 font-mono text-[10px] uppercase font-bold text-theme-primary border border-theme-border">
                      {item.entityType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-theme-text">{item.title}</td>
                  <td className="py-3 px-4 font-mono text-theme-text-dim text-[11px]">
                    {new Date(item.deletedAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmDialog({
                          isOpen: true,
                          item,
                          action: 'restore',
                        })
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-theme-border bg-theme-surface px-2.5 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30"
                      title="Restore Item"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Restore</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setConfirmDialog({
                          isOpen: true,
                          item,
                          action: 'permanent_delete',
                        })
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-500/20"
                      title="Permanently Purge"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Permanent Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Central Re-Auth Protected Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={handleConfirmAction}
        title={
          confirmDialog.action === 'restore'
            ? 'Restore Item'
            : confirmDialog.action === 'empty_trash'
            ? 'Empty Trash Permanently'
            : 'Permanent Deletion Warning'
        }
        message={
          confirmDialog.action === 'restore'
            ? 'คุณต้องการกู้คืนข้อมูลนี้กลับสู่ระบบปกติใช่หรือไม่?'
            : 'การลบถาวรจะไม่สามารถกู้คืนข้อมูลหรือไฟล์สื่อได้อีกต่อไป ระบบต้องการการยืนยันรหัสผ่านของผู้ดูแลระบบ'
        }
        variant={confirmDialog.action === 'restore' ? 'info' : 'danger'}
        requiresPasswordVerification={confirmDialog.action !== 'restore'}
      />
    </div>
  );
};
