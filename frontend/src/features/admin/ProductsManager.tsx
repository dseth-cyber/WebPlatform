import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProducts, useCategories } from '../../hooks/useProducts';
import { SearchableSelect, SelectOption } from '../../components/ui/SearchableSelect';
import { TableSkeleton } from '../../components/ui/TableSkeleton';
import { Pagination } from '../../components/ui/Pagination';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Plus, Edit, Trash2, Package, Search, Check, Image as ImageIcon, Eye, EyeOff, UploadCloud, Pin, Tag } from 'lucide-react';
import { LocalizedProduct } from '../../types/domain';
import { useSiteContent, CategoryCardSetting } from '../../hooks/useSiteContent';
import { compressImageFile } from '../../utils/imageCompressor';
import { MultiLangSectionEditor } from './MultiLangSectionEditor';

interface ExtendedProduct extends LocalizedProduct {
  isActive?: boolean;
  isPinned?: boolean;
  nameEn?: string;
  descriptionEn?: string;
  translations?: Record<string, Record<string, string>>;
}

export const ProductsManager: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'th';

  const { data: categories } = useCategories(currentLang);
  const { data: initialProducts, isLoading } = useProducts('all', '', currentLang);

  const [productsList, setProductsList] = useState<ExtendedProduct[]>([]);

  React.useEffect(() => {
    if (initialProducts && productsList.length === 0) {
      setProductsList(initialProducts.map((p: any) => ({ ...p, isActive: p.isActive !== false, isPinned: Boolean(p.isPinned) })));
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

  const { settings, updateSettings } = useSiteContent();
  const [activeAdminTab, setActiveAdminTab] = useState<'products' | 'categories'>('products');

  // Category Edit / Add Modal State
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCatIdx, setEditingCatIdx] = useState<number | null>(null);
  const [catFormId, setCatFormId] = useState('');
  const [catFormTitleTh, setCatFormTitleTh] = useState('');
  const [catFormTitleEn, setCatFormTitleEn] = useState('');
  const [catFormImage, setCatFormImage] = useState('');
  const [catFormPath, setCatFormPath] = useState('');
  const [catFormPinned, setCatFormPinned] = useState(false);
  const [catFormEnabled, setCatFormEnabled] = useState(true);
  const [catFormTranslations, setCatFormTranslations] = useState<Record<string, Record<string, string>>>({
    en: { title: '' },
    jp: { title: '' },
    cn: { title: '' },
    mm: { title: '' },
  });

  const [productTranslations, setProductTranslations] = useState<Record<string, Record<string, string>>>({
    en: { name: '', description: '', features: '', applications: '' },
    jp: { name: '', description: '', features: '', applications: '' },
    cn: { name: '', description: '', features: '', applications: '' },
    mm: { name: '', description: '', features: '', applications: '' },
  });

  const handleOpenEditCategory = (idx: number) => {
    const cat = settings.categoryCards?.[idx];
    if (!cat) return;
    setEditingCatIdx(idx);
    setCatFormId(cat.id);
    setCatFormTitleTh(cat.titleTh);
    setCatFormTitleEn(cat.titleEn);
    setCatFormImage(cat.image);
    setCatFormPath(cat.path);
    setCatFormPinned(cat.isPinned || false);
    setCatFormEnabled(cat.enabled !== false);
    setCatFormTranslations(
      cat.translations || {
        en: { title: cat.titleEn || '' },
        jp: { title: '' },
        cn: { title: '' },
        mm: { title: '' },
      }
    );
    setCategoryModalOpen(true);
  };

  const handleOpenAddCategory = () => {
    setEditingCatIdx(null);
    const newId = 'cat-' + Date.now();
    setCatFormId(newId);
    setCatFormTitleTh('');
    setCatFormTitleEn('');
    setCatFormImage('/images/cat-round-cans.jpg');
    setCatFormPath('/products?category=' + newId);
    setCatFormPinned(false);
    setCatFormEnabled(true);
    setCatFormTranslations({
      en: { title: '' },
      jp: { title: '' },
      cn: { title: '' },
      mm: { title: '' },
    });
    setCategoryModalOpen(true);
  };

  const handleCatImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        showToast('กำลังประมวลผลรูปภาพ...');
        const optimized = await compressImageFile(file, 800, 600, 0.85);
        setCatFormImage(optimized);
        showToast('อัปโหลดรูปภาพสำเร็จ!');
      } catch (err) {
        showToast('เกิดข้อผิดพลาดในการโหลดรูปภาพ');
      }
    }
  };

  const handleSaveCategory = async () => {
    if (!catFormTitleTh.trim()) {
      showToast('กรุณากรอกชื่อหมวดหมู่ภาษาไทย');
      return;
    }
    const currentList = [...(settings.categoryCards || [])];
    const catData: CategoryCardSetting = {
      id: catFormId || ('cat-' + Date.now()),
      titleTh: catFormTitleTh.trim(),
      titleEn: catFormTranslations.en?.title || catFormTitleEn.trim(),
      image: catFormImage.trim() || '/images/cat-round-cans.jpg',
      path: catFormPath.trim() || `/products?category=${catFormId}`,
      isPinned: catFormPinned,
      enabled: catFormEnabled,
      translations: catFormTranslations as any,
    };

    if (editingCatIdx !== null && currentList[editingCatIdx]) {
      currentList[editingCatIdx] = catData;
      showToast(`บันทึกการแก้ไขหมวดหมู่ "${catData.titleTh}" เรียบร้อยแล้ว`);
    } else {
      currentList.push(catData);
      showToast(`เพิ่มหมวดหมู่ใหม่ "${catData.titleTh}" เรียบร้อยแล้ว`);
    }

    await updateSettings({ categoryCards: currentList });
    setCategoryModalOpen(false);
  };

  const handleToggleCategoryPin = async (idx: number) => {
    const currentList = [...(settings.categoryCards || [])];
    if (!currentList[idx]) return;
    currentList[idx] = { ...currentList[idx], isPinned: !currentList[idx].isPinned };
    await updateSettings({ categoryCards: currentList });
    showToast(currentList[idx].isPinned ? `📌 ปักหมุด "${currentList[idx].titleTh}" บนหน้าแรกแล้ว` : `ยกเลิกการปักหมุด "${currentList[idx].titleTh}" แล้ว`);
  };

  const handleToggleCategoryEnabled = async (idx: number) => {
    const currentList = [...(settings.categoryCards || [])];
    if (!currentList[idx]) return;
    currentList[idx] = { ...currentList[idx], enabled: currentList[idx].enabled === false ? true : false };
    await updateSettings({ categoryCards: currentList });
    showToast(`เปลี่ยนสถานะการแสดงผล "${currentList[idx].titleTh}" เรียบร้อยแล้ว`);
  };

  const handleDeleteCategory = async (idx: number) => {
    const cat = settings.categoryCards?.[idx];
    if (!cat) return;
    if (confirm(`คุณต้องการลบหมวดหมู่ "${cat.titleTh}" หรือไม่?`)) {
      const currentList = [...(settings.categoryCards || [])];
      currentList.splice(idx, 1);
      await updateSettings({ categoryCards: currentList });
      showToast(`ลบหมวดหมู่ "${cat.titleTh}" เรียบร้อยแล้ว`);
    }
  };

  const syncProductsToDatabase = async (newList: ExtendedProduct[]) => {
    try {
      localStorage.setItem('lohakit_catalog_products', JSON.stringify(newList));
    } catch (e) {}
    window.dispatchEvent(new Event('lohakit_products_updated'));

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
    setProductTranslations({
      en: { name: '', description: '', features: '', applications: '' },
      jp: { name: '', description: '', features: '', applications: '' },
      cn: { name: '', description: '', features: '', applications: '' },
      mm: { name: '', description: '', features: '', applications: '' },
    });
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
    setProductTranslations(
      p.translations || {
        en: { name: p.nameEn || '', description: p.descriptionEn || '', features: '', applications: '' },
        jp: { name: '', description: '', features: '', applications: '' },
        cn: { name: '', description: '', features: '', applications: '' },
        mm: { name: '', description: '', features: '', applications: '' },
      }
    );
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
              nameEn: productTranslations.en?.name || name,
              descriptionEn: productTranslations.en?.description || description,
              categoryName,
              description,
              material,
              coatingType,
              isActive,
              translations: productTranslations,
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
        nameEn: productTranslations.en?.name || name,
        descriptionEn: productTranslations.en?.description || description,
        slug: sku.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        features: 'High precision seam welding, ISO 9001 certified',
        applications: 'Food, Canned Seafood, Fruits, Vegetable processing',
        material,
        coatingType,
        isActive,
        translations: productTranslations,
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
      setDeleteConfirmOpen(false);
      setDeletingId(null);
    }
  };

  const handleTogglePin = (id: string) => {
    const updatedList = productsList.map((item) => {
      if (item.id === id) {
        return { ...item, isPinned: !item.isPinned };
      }
      return item;
    });
    setProductsList(updatedList);
    syncProductsToDatabase(updatedList);
    const target = updatedList.find((i) => i.id === id);
    showToast(target?.isPinned ? '📌 ปักหมุดสินค้าแนะนำเรียบร้อยแล้ว' : 'ยกเลิกการปักหมุดสินค้านี้แล้ว');
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

      {/* Top View Switcher: Products Catalog vs Homepage Categories */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-theme-border bg-theme-surface w-fit shadow-sm">
        <button
          type="button"
          onClick={() => setActiveAdminTab('products')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all flex items-center gap-2 ${
            activeAdminTab === 'products'
              ? 'bg-theme-primary text-black shadow-md'
              : 'text-theme-text-muted hover:text-theme-text'
          }`}
        >
          <Package className="h-4 w-4" />
          <span>📦 รายการแคตตาล็อกสินค้า ({productsList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminTab('categories')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all flex items-center gap-2 ${
            activeAdminTab === 'categories'
              ? 'bg-theme-primary text-black shadow-md'
              : 'text-theme-text-muted hover:text-theme-text'
          }`}
        >
          <Tag className="h-4 w-4" />
          <span>🏷️ หมวดหมู่สินค้าและรูปภาพหน้าแรก ({(settings.categoryCards || []).length})</span>
        </button>
      </div>

      {activeAdminTab === 'categories' ? (
        /* Render Categories & Image Manager */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-theme-border pb-6">
            <div>
              <h1 className="font-display text-2xl font-black text-theme-text flex items-center gap-2">
                <Tag className="h-6 w-6 text-theme-primary" />
                <span>จัดการหมวดหมู่สินค้าและรูปภาพหน้าแรก (Homepage Categories & Images)</span>
              </h1>
              <p className="text-xs text-theme-text-muted mt-1">
                กำหนดรูปภาพหมวดหมู่ที่แสดงบนหน้าแรก (Homepage Products Section), เปลี่ยนรูปภาพ, แก้ไขชื่อภาษาไทย/อังกฤษ และปักหมุด
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddCategory}
              className="btn-primary-action text-sm font-black px-6 py-3 shadow-xl flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>+ เพิ่มหมวดหมู่ใหม่</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(settings.categoryCards || []).map((cat, idx) => (
              <div
                key={cat.id}
                className="flex flex-col justify-between p-5 rounded-3xl border border-theme-border bg-theme-surface hover:border-theme-primary/50 transition-all shadow-md gap-4"
              >
                <div className="space-y-3">
                  <div className="relative group/img aspect-video w-full rounded-2xl bg-white p-3 border border-theme-border flex items-center justify-center overflow-hidden shadow-inner">
                    <img
                      src={cat.image}
                      alt={cat.titleTh}
                      className="h-full w-full object-contain group-hover/img:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/cat-round-cans.jpg';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleOpenEditCategory(idx)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-xs text-white font-bold gap-1.5 backdrop-blur-xs"
                    >
                      <UploadCloud className="h-4 w-4 text-theme-primary" />
                      <span>คลิกเพื่อเปลี่ยนรูปภาพ</span>
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display font-black text-base text-theme-text truncate">{cat.titleTh}</h3>
                      {cat.isPinned && (
                        <span className="flex items-center gap-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold flex-shrink-0">
                          <Pin className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                          ปักหมุด
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-theme-text-muted font-mono uppercase font-bold tracking-wider">{cat.titleEn}</p>
                    <p className="text-[11px] text-theme-primary font-mono truncate">{cat.path}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-theme-border/60 gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditCategory(idx)}
                    className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold bg-theme-primary/10 text-theme-primary hover:bg-theme-primary hover:text-black transition-all border border-theme-primary/20"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>แก้ไขรูป & ข้อมูล</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleCategoryPin(idx)}
                      className={`flex items-center gap-1 rounded-xl px-2.5 py-2 text-xs font-bold transition-all ${
                        cat.isPinned
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                          : 'bg-theme-surface-elevated text-theme-text-muted hover:text-amber-400 border border-theme-border'
                      }`}
                      title={cat.isPinned ? 'ยกเลิกการปักหมุด' : 'ปักหมุดหมวดหมู่นี้บนหน้าแรก'}
                    >
                      <Pin className={`h-3.5 w-3.5 ${cat.isPinned ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleCategoryEnabled(idx)}
                      className={`flex items-center gap-1 rounded-xl px-2.5 py-2 text-xs font-bold transition-all ${
                        cat.enabled !== false
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-500/15 text-slate-400 border border-slate-500/30'
                      }`}
                      title={cat.enabled !== false ? 'คลิกเพื่อซ่อน' : 'คลิกเพื่อแสดง'}
                    >
                      {cat.enabled !== false ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5 text-slate-400" />}
                    </button>

                    {(settings.categoryCards || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(idx)}
                        className="p-2 text-theme-text-dim hover:text-red-400 rounded-xl transition-colors"
                        title="ลบหมวดหมู่นี้"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Render Products Catalog View */
        <>
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
                          onClick={() => handleTogglePin(p.id)}
                          className={`rounded-lg border p-1.5 transition-all ${
                            p.isPinned
                              ? 'border-amber-500/60 bg-amber-500/20 text-amber-300 shadow-sm'
                              : 'border-theme-border bg-theme-surface text-theme-text-muted hover:text-amber-400 hover:border-amber-500/40'
                          }`}
                          title={p.isPinned ? 'ยกเลิกการปักหมุดสินค้าแนะนำ' : 'ปักหมุดสินค้าแนะนำบนหน้าเว็บ'}
                        >
                          <Pin className={`h-3.5 w-3.5 ${p.isPinned ? 'fill-amber-400 text-amber-400' : ''}`} />
                        </button>
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
      </>
    )}

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

          {/* 5-Language Translation Tabs for Product */}
          <div className="pt-2">
            <MultiLangSectionEditor
              compact
              title="แปลภาษาสินค้า (Product Translations: EN, JP, CN, MM)"
              fields={[
                { key: 'name', label: 'ชื่อสินค้า (Product Name)' },
                { key: 'description', label: 'รายละเอียดสินค้า (Description)', type: 'textarea', rows: 2 },
                { key: 'features', label: 'คุณสมบัติเด่น (Features)' },
                { key: 'applications', label: 'การนำไปใช้งาน (Applications)' },
              ]}
              value={productTranslations}
              onChange={setProductTranslations}
            />
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

      {/* Category Edit / Add Modal */}
      <Modal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title={editingCatIdx !== null ? '✏️ แก้ไขรูปภาพและข้อมูลหมวดหมู่สินค้า' : '✨ เพิ่มหมวดหมู่สินค้าใหม่'}
      >
        <div className="space-y-4 text-xs font-sans">
          {/* Image Upload & Preview */}
          <div>
            <label className="font-bold text-theme-text block mb-1.5">
              รูปภาพหมวดหมู่สินค้า (Category Image) *
            </label>
            <div className="flex items-start gap-4 p-3 rounded-2xl border border-theme-border bg-theme-surface-elevated">
              <div className="h-20 w-20 rounded-xl bg-white p-2 border border-theme-border flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
                <img
                  src={catFormImage || '/images/cat-round-cans.jpg'}
                  alt="Preview"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/cat-round-cans.jpg';
                  }}
                />
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 rounded-xl bg-theme-primary/15 border border-theme-primary/40 px-3 py-1.5 text-xs font-bold text-theme-primary hover:bg-theme-primary hover:text-black cursor-pointer transition-all shadow-sm">
                    <UploadCloud className="h-3.5 w-3.5" />
                    <span>อัปโหลดรูปภาพใหม่ (PNG / JPG / WEBP)</span>
                    <input type="file" accept="image/*" onChange={handleCatImageUpload} className="hidden" />
                  </label>
                </div>
                <p className="text-[11px] text-theme-text-muted">
                  หรือระบุที่อยู่ไฟล์ / URL รูปภาพโดยตรง:
                </p>
                <input
                  type="text"
                  value={catFormImage}
                  onChange={(e) => setCatFormImage(e.target.value)}
                  placeholder="/images/cat-round-cans.jpg หรือ https://..."
                  className="w-full rounded-xl border border-theme-border bg-theme-surface px-3 py-1.5 text-[11px] text-theme-text font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-theme-text block mb-1">
                ชื่อหมวดหมู่ (ภาษาไทย) *
              </label>
              <input
                type="text"
                value={catFormTitleTh}
                onChange={(e) => setCatFormTitleTh(e.target.value)}
                placeholder="เช่น กระป๋องกลม, กระป๋องสเปรย์"
                className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text"
              />
            </div>
            <div>
              <label className="font-bold text-theme-text block mb-1">
                ชื่อหมวดหมู่ (English)
              </label>
              <input
                type="text"
                value={catFormTitleEn}
                onChange={(e) => setCatFormTitleEn(e.target.value.toUpperCase())}
                placeholder="e.g. ROUND CANS, AEROSOL CANS"
                className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text uppercase font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-theme-text block mb-1">
              ลิงก์ปลายทางเมื่อคลิก (Target Path)
            </label>
            <input
              type="text"
              value={catFormPath}
              onChange={(e) => setCatFormPath(e.target.value)}
              placeholder="เช่น /products?category=round-cans"
              className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3 py-2 text-theme-text font-mono"
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={catFormPinned}
                onChange={(e) => setCatFormPinned(e.target.checked)}
                className="h-4 w-4 rounded border-theme-border text-theme-primary focus:ring-theme-primary"
              />
              <span className="font-bold text-theme-text">📌 ปักหมุดแสดงบนหน้าแรก</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={catFormEnabled}
                onChange={(e) => setCatFormEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-theme-border text-theme-primary focus:ring-theme-primary"
              />
              <span className="font-bold text-theme-text">🟢 เปิดแสดงผล (Active)</span>
            </label>
          </div>

          {/* 5-Language Translation Tabs for Category */}
          <div className="pt-2">
            <MultiLangSectionEditor
              compact
              title="แปลภาษาหมวดหมู่สินค้า (Category Translations: EN, JP, CN, MM)"
              fields={[
                { key: 'title', label: 'ชื่อหมวดหมู่สินค้า (Category Title)' },
              ]}
              value={catFormTranslations}
              onChange={setCatFormTranslations}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-theme-border">
            <button
              type="button"
              onClick={() => setCategoryModalOpen(false)}
              className="rounded-xl border border-theme-border bg-theme-surface px-4 py-2 font-bold text-theme-text hover:bg-theme-surface-elevated"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleSaveCategory}
              className="btn-primary-action px-5 py-2 font-bold"
            >
              บันทึกการแก้ไข
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
