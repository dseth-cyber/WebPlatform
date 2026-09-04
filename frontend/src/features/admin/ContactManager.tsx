import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSiteContent, BranchLocationSetting } from '../../hooks/useSiteContent';
import {
  Phone,
  Mail,
  MapPin,
  Save,
  Clock,
  Inbox,
  Check,
  Trash2,
  Eye,
  EyeOff,
  MessageSquare,
  Building2,
  User,
  Factory,
  Warehouse,
  Plus,
  Edit,
  ExternalLink,
  Star,
} from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { formatGoogleMapsUrl } from '../../utils/mapUtils';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { MultiLangSectionEditor } from './MultiLangSectionEditor';

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

  const [contactTranslations, setContactTranslations] = useState<any>(
    settings.contactTranslations || {
      en: { bio: '', businessHours: '' },
      jp: { bio: '', businessHours: '' },
      cn: { bio: '', businessHours: '' },
      mm: { bio: '', businessHours: '' },
    }
  );

  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(() => {
    const saved = localStorage.getItem('lohakit_customer_inquiries');
    return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
  });
  const [selectedInquiry, setSelectedInquiry] = useState<CustomerInquiry | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Multi-Branch Management State
  const [branches, setBranches] = useState<BranchLocationSetting[]>(settings.branches || []);
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [editingBranchIdx, setEditingBranchIdx] = useState<number | null>(null);

  // Branch Modal Form Fields
  const [bNameTh, setBNameTh] = useState('');
  const [bNameEn, setBNameEn] = useState('');
  const [bType, setBType] = useState<'headquarters' | 'factory' | 'warehouse' | 'branch'>('headquarters');
  const [bAddressTh, setBAddressTh] = useState('');
  const [bAddressEn, setBAddressEn] = useState('');
  const [bPhone, setBPhone] = useState('');
  const [bEmail, setBEmail] = useState('');
  const [bHours, setBHours] = useState('');
  const [bMapUrl, setBMapUrl] = useState('');
  const [bIsPrimary, setBIsPrimary] = useState(false);

  // Sync with global settings when loaded from DB
  React.useEffect(() => {
    if (settings) {
      if (settings.factoryAddress) setAddress(settings.factoryAddress);
      if (settings.phoneNumber) setPhoneNumber(settings.phoneNumber);
      if (settings.email) setEmail(settings.email);
      if (settings.businessHours) setBusinessHours(settings.businessHours);
      if (settings.branches) setBranches(settings.branches);
      if (settings.contactTranslations) setContactTranslations(settings.contactTranslations);
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
        contactTranslations,
      });
      showToast('บันทึกข้อมูลการติดต่อโรงงานลงฐานข้อมูลเรียบร้อยแล้ว!');
    } catch (err) {
      showToast('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenAddBranch = () => {
    setEditingBranchIdx(null);
    setBNameTh('');
    setBNameEn('');
    setBType('branch');
    setBAddressTh('');
    setBAddressEn('');
    setBPhone('');
    setBEmail('');
    setBHours('จันทร์ - ศุกร์ 08:30 - 17:30 น.');
    setBMapUrl('');
    setBIsPrimary(false);
    setBranchModalOpen(true);
  };

  const handleOpenEditBranch = (idx: number) => {
    const b = branches[idx];
    if (!b) return;
    setEditingBranchIdx(idx);
    setBNameTh(b.nameTh);
    setBNameEn(b.nameEn || '');
    setBType(b.type || 'branch');
    setBAddressTh(b.addressTh);
    setBAddressEn(b.addressEn || '');
    setBPhone(b.phone || '');
    setBEmail(b.email || '');
    setBHours(b.businessHoursTh || '');
    setBMapUrl(b.mapUrl || '');
    setBIsPrimary(Boolean(b.isPrimary));
    setBranchModalOpen(true);
  };

  const handleSaveBranch = async () => {
    if (!bNameTh.trim() || !bAddressTh.trim()) {
      alert('กรุณากรอกชื่อสาขาและที่อยู่สาขา');
      return;
    }

    let updated: BranchLocationSetting[];
    if (editingBranchIdx !== null) {
      updated = branches.map((item, idx) =>
        idx === editingBranchIdx
          ? {
              ...item,
              nameTh: bNameTh,
              nameEn: bNameEn,
              type: bType,
              addressTh: bAddressTh,
              addressEn: bAddressEn,
              phone: bPhone,
              email: bEmail,
              businessHoursTh: bHours,
              mapUrl: bMapUrl,
              isPrimary: bIsPrimary,
            }
          : bIsPrimary
          ? { ...item, isPrimary: false }
          : item
      );
    } else {
      const newB: BranchLocationSetting = {
        id: 'branch-' + Date.now(),
        nameTh: bNameTh,
        nameEn: bNameEn,
        type: bType,
        addressTh: bAddressTh,
        addressEn: bAddressEn,
        phone: bPhone,
        email: bEmail,
        businessHoursTh: bHours,
        mapUrl: bMapUrl,
        isPrimary: bIsPrimary,
        enabled: true,
      };
      if (bIsPrimary) {
        updated = [newB, ...branches.map((b) => ({ ...b, isPrimary: false }))];
      } else {
        updated = [...branches, newB];
      }
    }

    setBranches(updated);
    await updateSettings({ branches: updated });
    setBranchModalOpen(false);
    showToast('บันทึกข้อมูลสาขาเรียบร้อยแล้ว');
  };

  const handleDeleteBranch = async (idx: number) => {
    if (confirm(`คุณต้องการลบสาขา "${branches[idx]?.nameTh}" หรือไม่?`)) {
      const updated = branches.filter((_, i) => i !== idx);
      setBranches(updated);
      await updateSettings({ branches: updated });
      showToast('ลบข้อมูลสาขาเรียบร้อยแล้ว');
    }
  };

  const handleToggleBranchEnabled = async (idx: number) => {
    const updated = branches.map((b, i) =>
      i === idx ? { ...b, enabled: !b.enabled } : b
    );
    setBranches(updated);
    await updateSettings({ branches: updated });
    showToast(updated[idx].enabled ? 'เปิดแสดงผลสาขาบนหน้าเว็บแล้ว' : 'ซ่อนสาขานี้จากหน้าเว็บแล้ว');
  };

  const handleSetPrimaryBranch = async (idx: number) => {
    const updated = branches.map((b, i) => ({
      ...b,
      isPrimary: i === idx,
    }));
    setBranches(updated);
    await updateSettings({
      branches: updated,
      factoryAddress: updated[idx].addressTh,
      phoneNumber: updated[idx].phone || settings.phoneNumber,
      email: updated[idx].email || settings.email,
    });
    showToast(`ตั้ง "${updated[idx].nameTh}" เป็นสาขาหลักเรียบร้อยแล้ว`);
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

      {/* 1.5 Multi-Language Translations (EN, JP, CN, MM) */}
      <MultiLangSectionEditor
        title="แปลภาษา (Multi-Language) - ติดต่อเรา & ข้อมูลองค์กร"
        fields={[
          { key: 'bio', label: 'Company Bio / Overview', type: 'textarea', rows: 3 },
          { key: 'businessHours', label: 'Business Hours' },
        ]}
        value={contactTranslations}
        onChange={setContactTranslations}
      />

      {/* 2. Multi-Branch Locations Manager */}
      <div className="rounded-3xl border border-theme-border bg-theme-surface p-6 sm:p-8 shadow-2xl space-y-4 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-theme-border pb-4">
          <div>
            <h3 className="font-display text-sm font-bold text-theme-text flex items-center gap-2">
              <Building2 className="h-4 w-4 text-theme-primary" />
              <span>ระบบจัดการสาขาและสถานที่ตั้ง (Multi-Branch & Locations Manager)</span>
            </h3>
            <p className="text-[11px] text-theme-text-muted mt-0.5">
              💡 สำหรับองค์กรที่มีหลายสาขา สามารถเพิ่ม แก้ไข และกำหนดสาขาหลัก (สำนักงานใหญ่, โรงงานผลิต, คลังสินค้า) เพื่อให้ผู้เข้าชมเลือกดูได้
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddBranch}
            className="btn-primary-action text-xs font-black px-4 py-2 shadow-lg flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4 text-black" />
            <span>+ เพิ่มสาขาใหม่</span>
          </button>
        </div>

        {branches.length === 0 ? (
          <div className="p-8 text-center text-xs text-theme-text-muted rounded-2xl border border-dashed border-theme-border">
            ยังไม่มีข้อมูลสาขา กดปุ่ม "+ เพิ่มสาขาใหม่" เพื่อเริ่มต้น
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {branches.map((b, idx) => {
              const typeLabel =
                b.type === 'headquarters'
                  ? '🏢 สำนักงานใหญ่'
                  : b.type === 'factory'
                  ? '🏭 โรงงานผลิต'
                  : b.type === 'warehouse'
                  ? '📦 คลังสินค้า'
                  : '📍 สาขาย่อย';

              return (
                <div
                  key={b.id}
                  className={`rounded-2xl border p-4 space-y-3 flex flex-col justify-between transition-all ${
                    b.isPrimary
                      ? 'border-theme-primary/60 bg-theme-primary/5 shadow-md'
                      : 'border-theme-border bg-theme-surface-elevated/60'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-full bg-theme-surface border border-theme-border px-2.5 py-0.5 text-[10px] font-bold text-theme-primary">
                        {typeLabel}
                      </span>
                      <div className="flex items-center gap-1">
                        {b.isPrimary ? (
                          <span className="flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[9px] font-black text-amber-300">
                            <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                            สาขาหลัก
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryBranch(idx)}
                            className="rounded-full bg-theme-surface border border-theme-border px-2 py-0.5 text-[9px] font-bold text-theme-text-muted hover:text-theme-primary"
                            title="คลิกเพื่อตั้งเป็นสาขาหลัก"
                          >
                            ตั้งเป็นสาขาหลัก
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-display text-sm font-bold text-theme-text">{b.nameTh}</h4>
                      {b.nameEn && <span className="text-[10px] text-theme-text-muted block">{b.nameEn}</span>}
                    </div>

                    <div className="space-y-1.5 pt-1 text-[11px] text-theme-text-muted">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-theme-primary flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2 leading-relaxed">{b.addressTh}</span>
                      </div>
                      {b.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-theme-primary flex-shrink-0" />
                          <span className="font-mono">{b.phone}</span>
                        </div>
                      )}
                      {b.email && (
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-theme-primary flex-shrink-0" />
                          <span className="font-mono">{b.email}</span>
                        </div>
                      )}
                      {b.businessHoursTh && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-theme-primary flex-shrink-0" />
                          <span>{b.businessHoursTh}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-theme-border/50">
                    <div className="flex items-center gap-1">
                      {b.mapUrl && (
                        <a
                          href={formatGoogleMapsUrl(b.mapUrl, b.addressTh)}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg p-1.5 text-theme-text-dim hover:text-theme-primary"
                          title="เปิดดูแผนที่ Google Maps"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => handleToggleBranchEnabled(idx)}
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold inline-flex items-center gap-1 ${
                          b.enabled !== false
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-500/15 text-slate-400 border border-slate-500/30'
                        }`}
                        title={b.enabled !== false ? 'คลิกเพื่อซ่อน' : 'คลิกเพื่อแสดง'}
                      >
                        {b.enabled !== false ? <Eye className="h-2.5 w-2.5" /> : <EyeOff className="h-2.5 w-2.5" />}
                        <span>{b.enabled !== false ? 'แสดง' : 'ซ่อน'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditBranch(idx)}
                        className="rounded-lg border border-theme-border bg-theme-surface p-1.5 text-theme-text-muted hover:text-theme-primary hover:border-theme-primary transition-colors"
                        title="แก้ไขข้อมูลสาขา"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBranch(idx)}
                        className="rounded-lg border border-theme-border bg-theme-surface p-1.5 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-colors"
                        title="ลบสาขา"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Customer Inquiries Inbox */}
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

      {/* Add / Edit Branch Modal */}
      <Modal
        isOpen={branchModalOpen}
        onClose={() => setBranchModalOpen(false)}
        title={editingBranchIdx !== null ? 'แก้ไขข้อมูลสาขา / โรงงาน' : 'เพิ่มสาขา / โรงงานใหม่'}
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-theme-text block mb-1">ชื่อสาขา (ภาษาไทย) *</label>
              <input
                type="text"
                value={bNameTh}
                onChange={(e) => setBNameTh(e.target.value)}
                placeholder="เช่น สำนักงานใหญ่, โรงงานสมุทรสาคร"
                className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text"
              />
            </div>
            <div>
              <label className="font-bold text-theme-text block mb-1">ชื่อสาขา (English)</label>
              <input
                type="text"
                value={bNameEn}
                onChange={(e) => setBNameEn(e.target.value)}
                placeholder="e.g. Head Office, Samut Sakhon Plant"
                className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-theme-text block mb-1">ประเภทสาขา</label>
              <select
                value={bType}
                onChange={(e) => setBType(e.target.value as any)}
                className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text"
              >
                <option value="headquarters">🏢 สำนักงานใหญ่ (Headquarters)</option>
                <option value="factory">🏭 โรงงานผลิต (Manufacturing Plant)</option>
                <option value="warehouse">📦 คลังสินค้า / ศูนย์กระจายสินค้า (Warehouse)</option>
                <option value="branch">📍 สาขาภูมิภาค (Regional Branch)</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-theme-text block mb-1">เบอร์โทรศัพท์ติดต่อ</label>
              <input
                type="text"
                value={bPhone}
                onChange={(e) => setBPhone(e.target.value)}
                placeholder="เช่น +66 (0) 2 123 4567"
                className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-theme-text block mb-1">ที่อยู่สาขา (ภาษาไทย) *</label>
            <textarea
              rows={2}
              value={bAddressTh}
              onChange={(e) => setBAddressTh(e.target.value)}
              placeholder="บ้านเลขที่, ถนน, ตำบล/แขวง, อำเภอ/เขต, จังหวัด, รหัสไปรษณีย์"
              className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text"
            />
          </div>

          <div>
            <label className="font-bold text-theme-text block mb-1">ที่อยู่สาขา (English)</label>
            <textarea
              rows={2}
              value={bAddressEn}
              onChange={(e) => setBAddressEn(e.target.value)}
              placeholder="Address in English for international visitors..."
              className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-theme-text block mb-1">อีเมลติดต่อสาขา</label>
              <input
                type="email"
                value={bEmail}
                onChange={(e) => setBEmail(e.target.value)}
                placeholder="branch@chiotron.co.th"
                className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-theme-text block mb-1">เวลาทำการ</label>
              <input
                type="text"
                value={bHours}
                onChange={(e) => setBHours(e.target.value)}
                placeholder="เช่น จันทร์ - ศุกร์: 08:30 - 17:30 น."
                className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-theme-text block">ลิงก์ Google Maps (สำหรับให้ลูกค้ากดเปิดแผนที่นำทาง)</label>
              {bMapUrl && (
                <a
                  href={formatGoogleMapsUrl(bMapUrl, bAddressTh)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-bold text-theme-primary hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  ทดสอบเปิดดูแผนที่
                </a>
              )}
            </div>
            <input
              type="text"
              value={bMapUrl}
              onChange={(e) => setBMapUrl(e.target.value)}
              placeholder="เช่น https://maps.app.goo.gl/... หรือ 13.6265, 100.2642 หรือ ชื่อสถานที่"
              className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text font-mono text-xs"
            />
            <div className="mt-1.5 p-2.5 rounded-xl bg-theme-surface border border-theme-border/70 text-[11px] text-theme-text-muted space-y-1">
              <span className="font-bold text-theme-text block">💡 สามารถเลือกใส่ได้ 3 รูปแบบตามสะดวก:</span>
              <p>• <strong>วิธีที่ 1 (แนะนำ):</strong> ลิงก์แชร์จาก Google Maps &gt; เปิด Google Maps &gt; กด <strong>"แชร์" (Share)</strong> &gt; <strong>"คัดลอกลิงก์"</strong> (เช่น <code className="text-theme-primary font-mono">https://maps.app.goo.gl/...</code>)</p>
              <p>• <strong>วิธีที่ 2 (พิกัด):</strong> ใส่ตัวเลข ละติจูด,ลองจิจูด ตรงๆ ได้เลย เช่น <code className="text-theme-primary font-mono">13.6265, 100.2642</code> (คลิกขวาบนแผนที่จะมีตัวเลขพิกัดให้คัดลอก)</p>
              <p>• <strong>วิธีที่ 3 (ชื่อสถานที่):</strong> พิมพ์ชื่อบริษัทหรือที่อยู่ เช่น <code className="text-theme-primary font-mono">บริษัท ไคโอทรอน เทคโนโลยี จำกัด สมุทรสาคร</code> (ระบบจะสร้างลิงก์ค้นหาให้อัตโนมัติ)</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="branchPrimaryCheck"
              checked={bIsPrimary}
              onChange={(e) => setBIsPrimary(e.target.checked)}
              className="h-4 w-4 rounded border-theme-border text-theme-primary focus:ring-theme-primary"
            />
            <label htmlFor="branchPrimaryCheck" className="font-bold text-theme-text cursor-pointer">
              ⭐ ตั้งเป็นสาขาหลัก (Primary Branch) — ที่อยู่นี้จะแสดงเป็นค่าเริ่มต้นใน Footer และหน้าติดต่อเรา
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-theme-border">
            <button
              type="button"
              onClick={() => setBranchModalOpen(false)}
              className="rounded-xl border border-theme-border bg-theme-surface px-5 py-2 font-bold text-theme-text hover:bg-theme-surface-elevated"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleSaveBranch}
              className="btn-primary-action px-6 py-2 font-black text-black shadow-lg"
            >
              บันทึกข้อมูลสาขา
            </button>
          </div>
        </div>
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
