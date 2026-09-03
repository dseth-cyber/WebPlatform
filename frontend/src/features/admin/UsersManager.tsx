import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminUsers } from '../../hooks/useAdmin';
import { Users, Plus, Check, Edit, Trash2 } from 'lucide-react';
import { TableSkeleton } from '../../components/ui/TableSkeleton';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { UserAdmin } from '../../types/domain';

export const UsersManager: React.FC = () => {
  const { t } = useTranslation();
  const { data: initialUsers, isLoading } = useAdminUsers();

  const [usersList, setUsersList] = useState<UserAdmin[]>([]);

  React.useEffect(() => {
    if (initialUsers && usersList.length === 0) {
      setUsersList(initialUsers);
    }
  }, [initialUsers]);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAdmin | null>(null);

  // Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('CONTENT_EDITOR');
  const [status, setStatus] = useState<'ACTIVE' | 'SUSPENDED' | 'LOCKED'>('ACTIVE');

  // Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Delete Confirm Dialog
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFullName('');
    setEmail('');
    setRole('CONTENT_EDITOR');
    setStatus('ACTIVE');
    setModalOpen(true);
  };

  const handleOpenEdit = (u: UserAdmin) => {
    setEditingUser(u);
    setFullName(u.fullName);
    setEmail(u.email);
    setRole(u.roles[0] || 'CONTENT_EDITOR');
    setStatus(u.status);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!fullName.trim() || !email.trim()) {
      alert('กรุณากรอกชื่อ-นามสกุล และอีเมล');
      return;
    }

    if (editingUser) {
      // Update
      setUsersList((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                fullName,
                email,
                roles: [role],
                status,
              }
            : u
        )
      );
      showToast('บันทึกข้อมูลผู้ใช้งานเรียบร้อยแล้ว');
    } else {
      // Create
      const newUser: UserAdmin = {
        id: 'user-' + Date.now(),
        fullName,
        email,
        roles: [role],
        status,
        createdAt: new Date().toISOString(),
      };
      setUsersList((prev) => [newUser, ...prev]);
      showToast('เพิ่มผู้ใช้งานระบบใหม่เรียบร้อยแล้ว');
    }

    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deletingId) {
      setUsersList((prev) => prev.filter((u) => u.id !== deletingId));
      showToast('ลบผู้ใช้งานออกจากระบบเรียบร้อยแล้ว');
      setDeleteConfirmOpen(false);
      setDeletingId(null);
    }
  };

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
            <Users className="h-6 w-6 text-theme-primary" />
            <span>{t('admin.users')} & RBAC</span>
          </h1>
          <p className="text-xs text-theme-text-muted mt-1">
            จัดการบัญชีผู้ดูแลระบบ กำหนดสิทธิ์การเข้าถึงเมนู (Superadmin, Content Editor, Product Manager)
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-xl bg-theme-primary px-5 py-2.5 text-xs font-black text-black shadow-lg shadow-theme-primary/25 hover:bg-theme-primary-hover transition-all"
        >
          <Plus className="h-4 w-4 text-black" />
          <span>+ เพิ่มผู้ใช้งานใหม่</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-theme-border bg-theme-surface shadow-2xl overflow-hidden">
        {isLoading && usersList.length === 0 ? (
          <TableSkeleton rows={3} columns={5} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-theme-text-muted">
              <thead>
                <tr className="border-b border-theme-border bg-theme-surface-elevated text-theme-text font-semibold">
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Roles & Permissions</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-theme-border/50 hover:bg-theme-surface-elevated/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-theme-text flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-theme-primary/20 text-theme-primary flex items-center justify-center font-bold text-[10px]">
                        {u.fullName.slice(0, 2).toUpperCase()}
                      </div>
                      <span>{u.fullName}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-theme-text-dim">{u.email}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1.5 flex-wrap">
                        {u.roles.map((r: string) => (
                          <span
                            key={r}
                            className="rounded-md bg-theme-primary/15 border border-theme-primary/30 px-2 py-0.5 text-[10px] font-bold text-theme-primary"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/15 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(u)}
                        className="rounded-lg border border-theme-border bg-theme-surface p-1.5 text-theme-text-muted hover:text-theme-primary hover:border-theme-primary transition-colors"
                        title="แก้ไขสิทธิ์ผู้ใช้"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      {u.roles[0] !== 'SUPER_ADMIN' && (
                        <button
                          type="button"
                          onClick={() => {
                            setDeletingId(u.id);
                            setDeleteConfirmOpen(true);
                          }}
                          className="rounded-lg border border-theme-border bg-theme-surface p-1.5 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-colors"
                          title="ลบผู้ใช้งาน"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit User Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? `แก้ไขข้อมูลผู้ใช้: ${editingUser.fullName}` : 'เพิ่มผู้ใช้งานระบบใหม่'}
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-theme-text block mb-1">ชื่อ-นามสกุล (Full Name) *</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="เช่น สมชาย ใจดี"
              className="w-full rounded-xl border border-theme-border bg-theme-surface px-3 py-2 text-theme-text"
            />
          </div>

          <div>
            <label className="font-bold text-theme-text block mb-1">อีเมลผู้ใช้งาน (Email) *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="somchai@lohakit.co.th"
              className="w-full rounded-xl border border-theme-border bg-theme-surface px-3 py-2 text-theme-text font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-theme-text block mb-1">สิทธิ์การใช้งาน (Role)</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-theme-border bg-theme-surface px-3 py-2 text-theme-text"
              >
                <option value="SUPER_ADMIN">SUPER_ADMIN (ผู้ดูแลระบบสูงสุด)</option>
                <option value="CONTENT_EDITOR">CONTENT_EDITOR (ผู้จัดการเนื้อหา)</option>
                <option value="PRODUCT_MANAGER">PRODUCT_MANAGER (ผู้จัดการสินค้า)</option>
                <option value="AUDITOR">AUDITOR (ผู้ตรวจสอบ Log)</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-theme-text block mb-1">สถานะ (Status)</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'SUSPENDED' | 'LOCKED')}
                className="w-full rounded-xl border border-theme-border bg-theme-surface px-3 py-2 text-theme-text"
              >
                <option value="ACTIVE">ACTIVE (เปิดใช้งาน)</option>
                <option value="SUSPENDED">SUSPENDED (ระงับการใช้งาน)</option>
                <option value="LOCKED">LOCKED (ถูกล็อค)</option>
              </select>
            </div>
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
              className="rounded-xl bg-theme-primary px-6 py-2.5 font-black text-black shadow-lg shadow-theme-primary/25 hover:bg-theme-primary-hover transition-all"
            >
              บันทึกผู้ใช้
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="ยืนยันการลบผู้ใช้งาน"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีผู้ใช้งานนี้ออกจากระบบ?"
        variant="danger"
      />
    </div>
  );
};
