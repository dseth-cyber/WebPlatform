import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { LocalizedProduct, ProductCategory } from '../types/domain';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../api/mockData';

const normalizeProduct = (p: any): LocalizedProduct => {
  const specs = p.specifications || {};
  return {
    id: p.id || '',
    categoryId: p.categoryId || p.category_id || '',
    categorySlug: p.categorySlug || p.category_slug || 'food-beverage-cans',
    categoryName: p.categoryName || p.category_name || (p.categorySlug === 'food-beverage-cans' ? 'กระป๋องอาหารและเครื่องดื่ม' : 'บรรจุภัณฑ์โลหะ'),
    sku: p.sku || 'LK-CAN',
    language: p.language || 'th',
    name: p.name || p.sku || 'บรรจุภัณฑ์โลหะเกรดพรีเมียม',
    slug: p.slug || p.sku || 'metal-packaging',
    description: p.description || 'บรรจุภัณฑ์โลหะคุณภาพสูงมาตรฐานสากล สำหรับอาหารพร้อมทานและอุตสาหกรรม',
    material: p.material || specs.material || 'Electrolytic Tinplate (ETP) 0.20mm',
    coatingType: p.coatingType || specs.coating_type || specs.coating || 'BPA-NI Food Grade',
    unRating: p.unRating || specs.un_rating || 'UN 1A2/Y1.4/100',
    applications: p.applications || 'อาหารสำเร็จรูป, อาหารทะเลกระป๋อง, ผักผลไม้แปรรูป',
    features: p.features || 'โครงสร้างแข็งแรง ทนความร้อนสูง ป้องกันการซึมผ่าน 100%',
    primaryImageURL:
      p.primaryImageURL ||
      p.featuredImageUrl ||
      p.featured_image_url ||
      '/images/cat-round-cans.jpg',
    galleryImages: p.galleryImages || (p.primaryImageURL ? [p.primaryImageURL] : ['/images/cat-round-cans.jpg']),
    pdfSpecURL: p.pdfSpecURL || p.pdf_spec_url || '/specs/lohakit-spec.pdf',
    specifications: specs,
    isPinned: Boolean(p.isPinned),
    isActive: p.isActive !== false,
  };
};

export const matchesCategory = (p: any, categoryId?: string): boolean => {
  if (!categoryId || categoryId === 'all') return true;

  const target = categoryId.toLowerCase().trim();
  const pCatId = (p.categoryId || '').toLowerCase();
  const pCatName = (p.categoryName || '').toLowerCase();
  const pCatSlug = (p.categorySlug || '').toLowerCase();
  const pName = (p.name || '').toLowerCase();
  const pSku = (p.sku || '').toLowerCase();
  const pDesc = (p.description || '').toLowerCase();

  // 1. Direct match
  if (pCatId === target || pCatSlug === target || pCatName === target) return true;

  // 2. Homepage Category: round-cans (กระป๋องกลม)
  if (target === 'round-cans') {
    return (
      pCatId === 'round-cans' ||
      pCatSlug.includes('food') ||
      pCatName.includes('อาหาร') ||
      pCatName.includes('กลม') ||
      pName.includes('กระป๋องอาหาร') ||
      pName.includes('กระป๋องกลม') ||
      pSku.includes('CAN') ||
      pCatSlug.includes('aerosol')
    );
  }

  // 3. Homepage Category: rect-cans (กระป๋องเหลี่ยม / ถังเหล็ก)
  if (target === 'rect-cans') {
    return (
      pCatId === 'rect-cans' ||
      pCatSlug.includes('chemical') ||
      pCatSlug.includes('paint') ||
      pCatName.includes('เคมี') ||
      pCatName.includes('ถัง') ||
      pCatName.includes('เหลี่ยม') ||
      pName.includes('ถัง') ||
      pName.includes('เหลี่ยม') ||
      pSku.includes('PAIL')
    );
  }

  // 4. Homepage Category: can-lids (ฝาปิดกระป๋อง)
  if (target === 'can-lids') {
    return (
      pCatId === 'can-lids' ||
      pCatSlug.includes('closures') ||
      pCatSlug.includes('lids') ||
      pCatName.includes('ฝา') ||
      pCatName.includes('eoe') ||
      pName.includes('ฝา') ||
      pSku.includes('EOE') ||
      pSku.includes('LID')
    );
  }

  // 5. Homepage Category: can-ends (ก้นกระป๋อง)
  if (target === 'can-ends') {
    return (
      pCatId === 'can-ends' ||
      pCatSlug.includes('closures') ||
      pCatSlug.includes('ends') ||
      pCatSlug.includes('lids') ||
      pCatName.includes('ก้น') ||
      pCatName.includes('ฝา') ||
      pName.includes('ก้น') ||
      pSku.includes('END') ||
      pSku.includes('EOE')
    );
  }

  // 6. Homepage Category: printed-cans (กระป๋องพิมพ์ลาย)
  if (target === 'printed-cans') {
    return (
      pCatId === 'printed-cans' ||
      pName.includes('พิมพ์') ||
      pDesc.includes('พิมพ์') ||
      pCatName.includes('พิมพ์') ||
      pSku.includes('PRINT')
    );
  }

  // 7. Standard Catalog categories
  if (target === 'food-beverage-cans' || target === 'cat-1') {
    return pCatSlug.includes('food') || pCatName.includes('อาหาร') || pName.includes('กระป๋องอาหาร');
  }

  if (target === 'chemical-paint-pails' || target === 'cat-2') {
    return pCatSlug.includes('chemical') || pCatSlug.includes('paint') || pCatName.includes('เคมี') || pName.includes('ถัง');
  }

  if (target === 'aerosol-spray-cans' || target === 'cat-3') {
    return pCatSlug.includes('aerosol') || pCatSlug.includes('spray') || pCatName.includes('สเปรย์') || pName.includes('สเปรย์');
  }

  if (target === 'metal-closures-lids' || target === 'cat-4') {
    return pCatSlug.includes('closures') || pCatSlug.includes('lids') || pCatName.includes('ฝา') || pName.includes('ฝา');
  }

  // 8. General fallback
  return pCatName.includes(target) || pCatSlug.includes(target) || pName.includes(target);
};

export const useProducts = (categoryId?: string, search?: string, lang: string = 'th') => {
  return useQuery<LocalizedProduct[]>({
    queryKey: ['products', categoryId, search, lang],
    queryFn: async () => {
      try {
        // 1. Try public settings DB key first
        const settingsRes = await fetch('/api/v1/public/settings');
        if (settingsRes.ok) {
          const json = await settingsRes.json();
          if (json && json.data && Array.isArray(json.data.catalog_products) && json.data.catalog_products.length > 0) {
            try {
              localStorage.setItem('lohakit_catalog_products', JSON.stringify(json.data.catalog_products));
            } catch (e) {}
            let list = json.data.catalog_products.map(normalizeProduct);
            // Combine with mock products if list doesn't have enough items
            const mockMapped = MOCK_PRODUCTS.map(normalizeProduct);
            const combinedList = [...list];
            for (const mp of mockMapped) {
              if (!combinedList.some((p) => p.sku === mp.sku)) {
                combinedList.push(mp);
              }
            }

            let filtered = combinedList.filter((p: any) => matchesCategory(p, categoryId));
            if (search) {
              filtered = filtered.filter(
                (p: any) =>
                  p.name.toLowerCase().includes(search.toLowerCase()) ||
                  p.sku.toLowerCase().includes(search.toLowerCase())
              );
            }
            return filtered;
          }
        }

        // Check local storage if backend didn't return
        const cached = localStorage.getItem('lohakit_catalog_products');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            let list = parsed.map(normalizeProduct);
            return list.filter((p: any) => matchesCategory(p, categoryId));
          }
        }

        // 2. Try REST API endpoint
        const res = await apiClient<any[]>(
          `/public/products?categoryId=${categoryId || ''}&search=${search || ''}&lang=${lang}`
        );
        const rawList = res.data ?? [];
        if (rawList.length > 0) {
          let list = rawList.map(normalizeProduct);
          return list.filter((p: any) => matchesCategory(p, categoryId));
        }
        return MOCK_PRODUCTS.filter((p: any) => matchesCategory(p, categoryId));
      } catch (e) {
        let prods = [...MOCK_PRODUCTS].filter((p: any) => matchesCategory(p, categoryId));
        if (search) {
          prods = prods.filter(
            (p) =>
              p.name.toLowerCase().includes(search.toLowerCase()) ||
              p.sku.toLowerCase().includes(search.toLowerCase())
          );
        }
        return prods;
      }
    },
  });
};

export const useProductBySlug = (slug: string, lang: string = 'th') => {
  return useQuery<LocalizedProduct | null>({
    queryKey: ['product', slug, lang],
    queryFn: async () => {
      try {
        const settingsRes = await fetch('/api/v1/public/settings');
        if (settingsRes.ok) {
          const json = await settingsRes.json();
          if (json && json.data && Array.isArray(json.data.catalog_products)) {
            const found = json.data.catalog_products.find((p: any) => p.slug === slug || p.sku.toLowerCase() === slug.toLowerCase());
            if (found) return normalizeProduct(found);
          }
        }

        const res = await apiClient<any>(`/public/products/${slug}?lang=${lang}`);
        if (res.data) {
          return normalizeProduct(res.data);
        }
        const found = MOCK_PRODUCTS.find((p) => p.slug === slug);
        return found || MOCK_PRODUCTS[0];
      } catch (e) {
        const found = MOCK_PRODUCTS.find((p) => p.slug === slug);
        return found || MOCK_PRODUCTS[0];
      }
    },
  });
};

export const useCategories = (lang: string = 'th') => {
  return useQuery<ProductCategory[]>({
    queryKey: ['categories', lang],
    queryFn: async () => {
      try {
        const res = await apiClient<ProductCategory[]>(`/public/categories?lang=${lang}`);
        return res.data ?? MOCK_CATEGORIES;
      } catch (e) {
        return MOCK_CATEGORIES;
      }
    },
  });
};
