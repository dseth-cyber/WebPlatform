import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSiteContent } from '../../hooks/useSiteContent';
import { Phone, Mail, MapPin, Save, Clock, Inbox, Check, Trash2, Eye, MessageSquare, Building2, User } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';

interface CustomerInquiry {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  interestCategory: string;
  status: 'NEW' | 'CONTACTED' | 'CLOSED';
  createdAt: string;
}

const INITIAL_INQUIRIES: CustomerInquiry[] = [
  {
    id: 'inq-1',
    name: 'คุณธนากร สมบูรณ์สุข',
    companyName: 'บริษัท สยามซีฟู้ดส์ โปรเซสซิ่ง จำกัด',
    email: 'thanakorn@siamseafood.co.th',
    phone: '081-999-8877',
    subject: 'ขอใบเสนอราคากระป๋องกลม 300x401 เกรดอาหารทะเล',
    message: 'ต้องการสั่งผลิตกระป๋องปลาทูน่า ขนาด 300x401 เคลือบแล็กเกอร์ BPA-NI จำนวน 200,000 ใบ/เดือน พร้อมส่งมอบที่สมุทรสาคร ขอทราบระยะเวลานำเข้าแผ่นเหล็กและราคาต่อหน่วย',
    interestCategory: 'Food Cans',
    status: 'NEW',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'inq-2',
    name: 'Mr. David Chen',
    companyName: 'Apex Food Industries Singapore',
    email: 'd.chen@apexfoods.sg',
    phone: '+65 9123 4567',
    subject: 'EOE Easy Open Ends 307# Inquiry',
    message: 'We are interested in sourcing 1,000,000 pcs of Easy Open Ends 307# with full aperture for canned fruits export. Please provide quotation and certificate of compliance.',
    interestCategory: 'EOE Closures',
    status: 'CONTACTED',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

export const ContactManager: React.FC = () => {
  const { t } = useTranslation();
  const { settings, updateSettings } = useSiteContent();

  const [address, setAddress] = useState(settings.factoryAddress || '');
  const [phoneNumber, setPhoneNumber] = useState(settings.phoneNumber || '');
  const [email, setEmail] = useState(settings.email || '');
  const [businessHours, setBusinessHours] = useState(settings.businessHours || 'จันทร์ - เสาร์ 08:00 - 17:00');

  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(() => {
    const saved = localStorage.getItem('lohakit_customer_inquiries');
    return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
  });
  const [selectedInquiry, setSelectedInquiry] = useState<CustomerInquiry | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Sync with global settings when loaded from DB
  React.useEffect(() => {
    if (settings) {
      if (settings.factoryAddress) setAddress(settings.factoryAddress);
      if (settings.phoneNumber) setPhoneNumber(settings.phoneNumber);
      if (settings.email) setEmail(settings.email);
      if (settings.businessHours) setBusinessHours(settings.businessHours);
    }
  }, [settings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveContactInfo = async () => {
    setIsSaving(true);
    try {
      await updateSettings({
        factoryAddress: address,
        phoneNumber,
        email,
        businessHours,
      });
      showToast('บันทึกข้อมูลการติดต่อโรงงานลงฐานข้อมูลเรียบร้อยแล้ว!');
    } catch (err) {
      showToast('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = (id: string) => {
    setInquiries((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          const nextStatus: 'NEW' | 'CONTACTED' | 'CLOSED' =
            item.status === 'NEW' ? 'CONTACTED' : item.status === 'CONTACTED' ? 'CLOSED' : 'NEW';
          return { ...item, status: nextStatus };
        }
        return item;
      });
      localStorage.setItem('lohakit_customer_inquiries', JSON.stringify(updated));
      return updated;
    });
    showToast('อัปเดตสถานะการติดต่อเรียบร้อยแล้ว');
  };

  const handleDeleteInquiry = () => {
    if (deletingId) {
      setInquiries((prev) => {
        const updated = prev.filter((item) => item.id !== deletingId);
        localStorage.setItem('lohakit_customer_inquiries', JSON.stringify(updated));
        return updated;
      });
      showToast('ลบรายการคำขอเรียบร้อยแล้ว');
      setDeleteConfirmOpen(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-5xl pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-2xl animate-bounce">
          <Check className="h-5 w-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-theme-border pb-6">
        <div>
          <h1 className="font-display text-2xl font-black text-theme-text flex items-center gap-2">
            <Phone className="h-6 w-6 text-theme-primary" />
            <span>จัดการข้อมูลการติดต่อ & ข้อความลูกค้า (Contact & Inquiries)</span>
          </h1>
          <p className="text-xs text-theme-text-muted mt-1">
            แก้ไขช่องทางติดต่อโรงงาน และบริหารจัดการคำขอใบเสนอราคาจากหน้าเว็บ
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveContactInfo}
          className="flex items-center gap-2 rounded-xl bg-theme-primary px-6 py-2.5 text-xs font-black text-black shadow-lg shadow-theme-primary/20 hover:bg-theme-primary-hover transition-all"
        >
          <Save className="h-4 w-4 text-black" />
          <span>บันทึกข้อมูลการติดต่อ</span>
        </button>
      </div>

      {/* 1. Contact Information Editor */}
      <div className="rounded-3xl border border-theme-border bg-theme-surface p-6 sm:p-8 shadow-2xl space-y-4 text-xs">
        <h3 className="font-display text-sm font-bold text-theme-text flex items-center gap-2 border-b border-theme-border pb-3">
          <MapPin className="h-4 w-4 text-theme-primary" />
          <span>ข้อมูลโรงงานและช่องทางการติดต่อ (Factory Contact Info)</span>
        </h3>

        <div>
          <label className="font-bold text-theme-text block mb-1">ที่อยู่โรงงาน (ภาษาไทย)</label>
          <textarea
            rows={2}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-theme-text block mb-1">เบอร์โทรศัพท์ติดต่อ</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text font-mono"
            />
          </div>
          <div>
            <label className="font-bold text-theme-text block mb-1">อีเมลติดต่อฝ่ายขาย (Sales Email)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text font-mono"
            />
          </div>
        </div>

          <div>
            <label className="font-bold text-theme-text block mb-1">เวลาทำการ (Business Hours)</label>
            <input
              type="text"
              value={businessHours}
              onChange={(e) => setBusinessHours(e.target.value)}
              placeholder="จันทร์ - เสาร์ 08:00 - 17:00"
              className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text font-semibold"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-theme-border">
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveContactInfo}
              className="btn-primary-action text-xs font-black px-6 py-2.5 shadow-xl flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="h-4 w-4 text-black" />
              <span>{isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูลการติดต่อโรงงาน'}</span>
            </button>
          </div>
        </div>

      {/* 2. Customer Inquiries Inbox */}
      <div className="rounded-3xl border border-theme-border bg-theme-surface shadow-2xl overflow-hidden space-y-4 p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-theme-border pb-4">
          <div className="space-y-1">
            <h3 className="font-display text-sm font-bold text-theme-text flex items-center gap-2">
              <Inbox className="h-4 w-4 text-theme-primary" />
              <span>กล่องข้อความคำขอใบเสนอราคา (Customer Leads & Quote Requests)</span>
            </h3>
            <p className="text-[11px] text-theme-text-muted">
              รายการข้อความที่ลูกค้าส่งเข้ามาผ่านฟอร์มหน้าเว็บ
            </p>
          </div>
          <span className="rounded-full bg-theme-primary/15 border border-theme-primary/30 px-3 py-1 text-xs font-bold text-theme-primary">
            {inquiries.length} คำขอ
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-theme-text-muted">
            <thead>
              <tr className="border-b border-theme-border bg-theme-surface-elevated text-theme-text font-semibold">
                <th className="py-3 px-4">วันที่</th>
                <th className="py-3 px-4">ชื่อผู้ติดต่อ / บริษัท</th>
                <th className="py-3 px-4">หัวข้อคำขอ</th>
                <th className="py-3 px-4">หมวดสินค้า</th>
                <th className="py-3 px-4">สถานะ</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => (
                <tr
                  key={inq.id}
                  className="border-b border-theme-border/50 hover:bg-theme-surface-elevated/40 transition-colors"
                >
                  <td className="py-3 px-4 font-mono text-[11px] text-theme-text-dim">
                    {new Date(inq.createdAt).toLocaleDateString('th-TH')}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-theme-text">{inq.name}</div>
                    <div className="text-[11px] text-theme-text-muted">{inq.companyName}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-theme-text max-w-xs truncate">
                    {inq.subject}
                  </td>
                  <td className="py-3 px-4">
                    <span className="rounded-md bg-theme-primary/10 border border-theme-primary/20 px-2 py-0.5 text-[10px] font-bold text-theme-primary">
                      {inq.interestCategory}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(inq.id)}
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-all ${
                        inq.status === 'NEW'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
                          : inq.status === 'CONTACTED'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                      title="คลิกเพื่อเปลี่ยนสถานะ"
                    >
                      {inq.status === 'NEW' ? 'รอดำเนินการ' : inq.status === 'CONTACTED' ? 'ติดต่อแล้ว' : 'ปิดงาน'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedInquiry(inq)}
                      className="rounded-lg border border-theme-border bg-theme-surface p-1.5 text-theme-text-muted hover:text-theme-primary hover:border-theme-primary transition-colors"
                      title="ดูรายละเอียดข้อความ"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeletingId(inq.id);
                        setDeleteConfirmOpen(true);
                      }}
                      className="rounded-lg border border-theme-border bg-theme-surface p-1.5 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-colors"
                      title="ลบรายการ"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiry Detail Modal */}
      <Modal
        isOpen={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        title="รายละเอียดคำขอใบเสนอราคา / ข้อความลูกค้า"
        maxWidth="xl"
      >
        {selectedInquiry && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 border-b border-theme-border pb-4">
              <div>
                <span className="text-[10px] text-theme-text-dim block">ผู้ติดต่อ</span>
                <div className="font-bold text-theme-text text-sm">{selectedInquiry.name}</div>
                <div className="text-theme-text-muted">{selectedInquiry.companyName}</div>
              </div>
              <div>
                <span className="text-[10px] text-theme-text-dim block">ช่องทางการติดต่อ</span>
                <div className="text-theme-primary font-mono font-bold">{selectedInquiry.phone}</div>
                <div className="text-theme-text-muted font-mono">{selectedInquiry.email}</div>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-theme-text-dim block mb-0.5">หัวข้อ</span>
              <div className="font-bold text-theme-text">{selectedInquiry.subject}</div>
            </div>

            <div className="rounded-2xl border border-theme-border bg-theme-surface-elevated p-4">
              <span className="text-[10px] text-theme-text-dim block mb-1">เนื้อหาข้อความ</span>
              <p className="text-theme-text leading-relaxed whitespace-pre-wrap">{selectedInquiry.message}</p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] text-theme-text-dim">
                ส่งเมื่อ: {new Date(selectedInquiry.createdAt).toLocaleString('th-TH')}
              </span>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="rounded-xl bg-theme-primary px-5 py-2 font-bold text-black"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteInquiry}
        title="ยืนยันการลบข้อความ"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบรายการข้อความลูกค้านี้?"
        variant="danger"
      />
    </div>
  );
};
