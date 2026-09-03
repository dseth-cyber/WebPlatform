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
  };
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
            let list = json.data.catalog_products.map(normalizeProduct);
            if (categoryId && categoryId !== 'all') {
              list = list.filter((p: any) => p.categoryId === categoryId || p.categoryName === categoryId);
            }
            if (search) {
              list = list.filter(
                (p: any) =>
                  p.name.toLowerCase().includes(search.toLowerCase()) ||
                  p.sku.toLowerCase().includes(search.toLowerCase())
              );
            }
            return list;
          }
        }

        // 2. Try REST API endpoint
        const res = await apiClient<any[]>(
          `/public/products?categoryId=${categoryId || ''}&search=${search || ''}&lang=${lang}`
        );
        const rawList = res.data ?? [];
        if (rawList.length > 0) {
          return rawList.map(normalizeProduct);
        }
        return MOCK_PRODUCTS;
      } catch (e) {
        let prods = [...MOCK_PRODUCTS];
        if (categoryId && categoryId !== 'all') {
          prods = prods.filter((p) => p.categoryId === categoryId);
        }
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
