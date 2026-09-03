import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProducts, useCategories } from '../../hooks/useProducts';
import { SearchableSelect, SelectOption } from '../../components/ui/SearchableSelect';
import { TableSkeleton } from '../../components/ui/TableSkeleton';
import { Pagination } from '../../components/ui/Pagination';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Plus, Edit, Trash2, Package, Search, Check, Image as ImageIcon, Eye, EyeOff, UploadCloud } from 'lucide-react';
import { LocalizedProduct } from '../../types/domain';

interface ExtendedProduct extends LocalizedProduct {
  isActive?: boolean;
}

export const ProductsManager: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'th';

  const { data: categories } = useCategories(currentLang);
  const { data: initialProducts, isLoading } = useProducts('all', '', currentLang);

  const [productsList, setProductsList] = useState<ExtendedProduct[]>([]);

  React.useEffect(() => {
    if (initialProducts && productsList.length === 0) {
      setProductsList(initialProducts.map((p: any) => ({ ...p, isActive: p.isActive !== false })));
    }
  }, [initialProducts]);

  const [selectedCat, setSelectedCat] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Modal States
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ExtendedProduct | null>(null);

  // Form Fields
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [categoryName, setCategoryName] = useState('Food Cans');
  const [description, setDescription] = useState('');
  const [material, setMaterial] = useState('ETP Tinplate 0.20mm');
  const [coatingType, setCoatingType] = useState('BPA-NI Gold Epoxy');
  const [dimensions, setDimensions] = useState('D: 73mm x H: 110mm');
  const [primaryImageURL, setPrimaryImageURL] = useState('/images/cat-round-cans.jpg');
  const [isActive, setIsActive] = useState(true);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Delete Confirm
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const syncProductsToDatabase = async (newList: ExtendedProduct[]) => {
    try {
      const csrfToken = localStorage.getItem('csrf_token') || '';
      const authToken = localStorage.getItem('auth_token') || '';
      const payload = JSON.stringify({
        group: 'catalog',
        key: 'catalog_products',
        value: newList,
        isPublic: true,
        description: 'Catalog Products Database',
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
      console.warn('Failed to sync products:', e);
    }
  };

  const handleToggleProductStatus = (id: string) => {
    const updatedList = productsList.map((item) => {
      if (item.id === id) {
        const nextState = item.isActive === false ? true : false;
        return { ...item, isActive: nextState };
      }
      return item;
    });
    setProductsList(updatedList);
    syncProductsToDatabase(updatedList);
    showToast('เปลี่ยนสถานะการแสดงผลสินค้าในฐานข้อมูลเรียบร้อยแล้ว');
  };

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setSku('LK-CAN-' + Math.floor(100 + Math.random() * 900));
    setName('');
    setCategoryName('Food Cans');
    setDescription('');
    setMaterial('ETP Tinplate 0.20mm');
    setCoatingType('BPA-NI Gold Epoxy');
    setDimensions('D: 73mm x H: 110mm');
    setPrimaryImageURL('/images/cat-round-cans.jpg');
    setIsActive(true);
    setEditModalOpen(true);
  };

  const handleOpenEdit = (p: ExtendedProduct) => {
    setSelectedProduct(p);
    setSku(p.sku);
    setName(p.name);
    setCategoryName(p.categoryName);
    setDescription(p.description || '');
    setMaterial(p.material || 'ETP Tinplate 0.20mm');
    setCoatingType(p.coatingType || 'BPA-NI Gold Epoxy');
    setDimensions(p.specifications?.dimensions || 'D: 73mm x H: 110mm');
    setPrimaryImageURL(p.primaryImageURL || '/images/cat-round-cans.jpg');
    setIsActive(p.isActive !== false);
    setEditModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        setPrimaryImageURL(base64);
        showToast('แนบไฟล์รูปภาพสินค้าเรียบร้อยแล้ว');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('กรุณากรอกชื่อสินค้า');
      return;
    }

    let updatedList: ExtendedProduct[];
    if (selectedProduct) {
      // Update
      updatedList = productsList.map((item) =>
        item.id === selectedProduct.id
          ? {
              ...item,
              sku,
              name,
              categoryName,
              description,
              material,
              coatingType,
              isActive,
              specifications: {
                ...item.specifications,
                dimensions,
              },
              primaryImageURL,
            }
          : item
      );
      setProductsList(updatedList);
      syncProductsToDatabase(updatedList);
      showToast('บันทึกการแก้ไขสินค้าลงฐานข้อมูลเรียบร้อยแล้ว');
    } else {
      // Create
      const newProd: ExtendedProduct = {
        id: 'prod-' + Date.now(),
        categoryId: 'cat-food',
        categoryName,
        categorySlug: categoryName.toLowerCase().replace(/\s+/g, '-'),
        sku,
        language: currentLang,
        name,
        slug: sku.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        features: 'High precision seam welding, ISO 9001 certified',
        applications: 'Food, Canned Seafood, Fruits, Vegetable processing',
        material,
        coatingType,
        isActive,
        specifications: {
          dimensions,
          thickness: '0.20mm',
        },
        primaryImageURL,
        galleryImages: [primaryImageURL],
      };
      updatedList = [newProd, ...productsList];
      setProductsList(updatedList);
      syncProductsToDatabase(updatedList);
      showToast('เพิ่มสินค้าใหม่ลงฐานข้อมูลกลางเรียบร้อยแล้ว');
    }

    setEditModalOpen(false);
  };

  const handleDelete = () => {
    if (deletingId) {
      const updatedList = productsList.filter((item) => item.id !== deletingId);
      setProductsList(updatedList);
      syncProductsToDatabase(updatedList);
      showToast('ลบสินค้าออกจากฐานข้อมูลเรียบร้อยแล้ว');
      setDeleteConfirmOpen(false);
      setDeletingId(null);
    }
  };

  const categoryOptions: SelectOption[] = [
    { value: 'all', label: `✨ ${t('common.all')} (${t('common.categories')})` },
    ...(categories ?? []).map((cat) => ({
      value: cat.name,
      label: cat.name,
    })),
  ];

  const filteredProducts = productsList.filter((p) => {
    if (selectedCat !== 'all' && p.categoryName !== selectedCat) return false;
    if (
      searchTerm &&
      !p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

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
            <Package className="h-6 w-6 text-theme-primary" />
            <span>จัดการแคตตาล็อกสินค้า (Products Catalog Database)</span>
          </h1>
          <p className="text-xs text-theme-text-muted mt-1">
            เพิ่ม, แก้ไข, แนบรูปภาพ และ เปิด/ปิด การแสดงผลบรรจุภัณฑ์โลหะ (บันทึกลง Database อัตโนมัติ)
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="btn-primary-action text-sm font-black px-6 py-3 shadow-xl"
        >
          <Plus className="h-4 w-4" />
          <span>+ เพิ่มสินค้าใหม่</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="rounded-2xl border border-theme-border bg-theme-surface p-4 shadow-glass-edge flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-72">
          <SearchableSelect
            options={categoryOptions}
            value={selectedCat}
            onChange={setSelectedCat}
          />
        </div>

        <div className="w-full sm:w-80 relative">
          <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-theme-text-dim" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาตามชื่อสินค้า หรือ SKU..."
            className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated py-2 pl-9 pr-3 text-xs text-theme-text placeholder-theme-text-dim focus:border-theme-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Products Table with Status Toggle Column */}
      <div className="rounded-2xl border border-theme-border bg-theme-surface shadow-2xl overflow-hidden">
        {isLoading && productsList.length === 0 ? (
          <TableSkeleton rows={4} columns={6} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-theme-text-muted">
              <thead>
                <tr className="border-b border-theme-border bg-theme-surface-elevated text-theme-text font-semibold">
                  <th className="py-3 px-4">รูปภาพ</th>
                  <th className="py-3 px-4">รหัส SKU</th>
                  <th className="py-3 px-4">ชื่อสินค้า</th>
                  <th className="py-3 px-4">หมวดหมู่</th>
                  <th className="py-3 px-4 text-center">เปิด/ปิด บนเว็บ</th>
                  <th className="py-3 px-4 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-theme-text-dim">
                      ไม่พบรายการสินค้า
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-theme-border/50 hover:bg-theme-surface-elevated/40 transition-colors"
                    >
                      <td className="py-2.5 px-4">
                        <img
                          src={p.primaryImageURL || '/images/cat-round-cans.jpg'}
                          alt={p.name}
                          className="h-11 w-11 object-cover rounded-lg border border-theme-border bg-white"
                        />
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-theme-primary">{p.sku}</td>
                      <td className="py-3 px-4 font-bold text-theme-text max-w-xs truncate">{p.name}</td>
                      <td className="py-3 px-4 text-theme-text-muted">{p.categoryName}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleProductStatus(p.id)}
                          className={`rounded-full px-3 py-1 text-[10px] font-bold inline-flex items-center gap-1.5 transition-all ${
                            p.isActive !== false
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                              : 'bg-slate-500/20 text-slate-400 border border-slate-500/30 hover:bg-slate-500/30'
                          }`}
                          title="คลิกเพื่อ เปิด/ปิด การแสดงผลสินค้านี้บนหน้าเว็บ"
                        >
                          {p.isActive !== false ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                          <span>{p.isActive !== false ? 'เปิดแสดง' : 'ซ่อน'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="rounded-lg border border-theme-border bg-theme-surface p-1.5 text-theme-text-muted hover:text-theme-primary hover:border-theme-primary transition-colors"
                          title="แก้ไขสินค้า"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeletingId(p.id);
                            setDeleteConfirmOpen(true);
                          }}
                          className="rounded-lg border border-theme-border bg-theme-surface p-1.5 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-colors"
                          title="ลบสินค้า"
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
          totalItems={filteredProducts.length}
          totalPages={Math.ceil(filteredProducts.length / pageSize) || 1}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Product Edit / Add Modal with Image Attachment & Show/Hide Switch */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={selectedProduct ? `แก้ไขสินค้า: ${selectedProduct.sku}` : 'เพิ่มสินค้าบรรจุภัณฑ์โลหะใหม่'}
        maxWidth="2xl"
      >
        <div className="space-y-4 text-xs">
          {/* Status Switch */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-theme-border bg-theme-surface-elevated">
            <span className="font-bold text-theme-text">การแสดงผลบนหน้าเว็บ (Visibility Status)</span>
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
              <span>{isActive ? 'เปิดแสดงบนเว็บ' : 'ซ่อนไว้ (ไม่แสดง)'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-theme-text block mb-1">รหัสสินค้า SKU Code *</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full rounded-xl border border-theme-border bg-theme-surface px-3 py-2 text-theme-text font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-theme-text block mb-1">ชื่อสินค้า (Product Name) *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น กระป๋องอาหารสำเร็จรูป 300x401"
                className="w-full rounded-xl border border-theme-border bg-theme-surface px-3 py-2 text-theme-text"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-theme-text block mb-1">หมวดหมู่ (Category)</label>
            <select
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full rounded-xl border border-theme-border bg-theme-surface px-3 py-2 text-theme-text"
            >
              <option value="Food Cans">Food Cans (กระป๋องอาหาร)</option>
              <option value="Chemical Pails">Chemical Pails (ถังเคมีภัณฑ์)</option>
              <option value="Aerosol Cans">Aerosol Cans (กระป๋องสเปรย์)</option>
              <option value="EOE Closures">EOE Closures (ฝาดึงเปิดง่าย)</option>
              <option value="General Packaging">General Packaging (บรรจุภัณฑ์ทั่วไป)</option>
            </select>
          </div>

          {/* Image Attachment & Preview */}
          <div className="rounded-2xl border border-theme-border bg-theme-surface-elevated p-3.5 space-y-3">
            <label className="font-bold text-theme-text block">รูปภาพสินค้า (Product Image)</label>
            <div className="flex items-center gap-4">
              <img
                src={primaryImageURL || '/images/cat-round-cans.jpg'}
                alt="Product Preview"
                className="h-16 w-16 object-cover rounded-xl border border-theme-border bg-white"
              />
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={primaryImageURL}
                  onChange={(e) => setPrimaryImageURL(e.target.value)}
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
            <label className="font-bold text-theme-text block mb-1">รายละเอียดสินค้า (Description)</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="สเปกการใช้งาน เหมาะสำหรับบรรจุอาหารทะเล ผัก ผลไม้แปรรูป..."
              className="w-full rounded-xl border border-theme-border bg-theme-surface px-3 py-2 text-theme-text"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-theme-text block mb-1">วัสดุ (Material)</label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full rounded-xl border border-theme-border bg-theme-surface px-3 py-2 text-theme-text font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="font-bold text-theme-text block mb-1">การเคลือบแล็กเกอร์</label>
              <input
                type="text"
                value={coatingType}
                onChange={(e) => setCoatingType(e.target.value)}
                className="w-full rounded-xl border border-theme-border bg-theme-surface px-3 py-2 text-theme-text font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="font-bold text-theme-text block mb-1">ขนาดมิติ (Dimensions)</label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                className="w-full rounded-xl border border-theme-border bg-theme-surface px-3 py-2 text-theme-text font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-theme-border">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="rounded-xl border border-theme-border bg-theme-surface px-4 py-2 font-semibold text-theme-text hover:bg-theme-surface-elevated transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn-primary-action text-xs font-black px-6 py-2.5"
            >
              บันทึกข้อมูลสินค้า (ลง Database)
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="ยืนยันการลบสินค้า"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบรายการสินค้านี้ออกจากแคตตาล็อกฐานข้อมูล?"
        variant="danger"
      />
    </div>
  );
};
