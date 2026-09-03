import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { LocalizedPage, PageAdmin } from '../types/domain';
import { MOCK_HOME_PAGE } from '../api/mockData';

export const useLocalizedPage = (slug: string, lang: string) => {
  return useQuery<LocalizedPage>({
    queryKey: ['page', slug, lang],
    queryFn: async () => {
      try {
        const res = await apiClient<LocalizedPage>(`/public/pages/${slug}?lang=${lang}`);
        return res.data;
      } catch (e) {
        // Safe fallback for demo / offline
        if (slug === 'home' || slug === '') {
          return MOCK_HOME_PAGE;
        }
        return {
          ...MOCK_HOME_PAGE,
          slug,
          title: `Lohakit Rungchareonsap - ${slug.toUpperCase()}`,
        };
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAdminPages = (status?: string, search?: string) => {
  return useQuery<PageAdmin[]>({
    queryKey: ['admin', 'pages', status, search],
    queryFn: async () => {
      try {
        const res = await apiClient<PageAdmin[]>(`/admin/pages?status=${status || ''}&search=${search || ''}`);
        return res.data ?? [];
      } catch (e) {
        return [
          {
            id: 'page-home',
            slug: 'home',
            status: 'PUBLISHED',
            publishedAt: '2026-09-01T00:00:00Z',
            createdAt: '2026-09-01T00:00:00Z',
            updatedAt: '2026-09-02T00:00:00Z',
            translations: {
              th: { title: 'หน้าแรก - ผู้นำบรรจุภัณฑ์โลหะ' },
              en: { title: 'Home - Premium Metal Packaging' },
            },
            sections: [],
          },
          {
            id: 'page-about',
            slug: 'about',
            status: 'PUBLISHED',
            publishedAt: '2026-09-01T00:00:00Z',
            createdAt: '2026-09-01T00:00:00Z',
            updatedAt: '2026-09-02T00:00:00Z',
            translations: {
              th: { title: 'เกี่ยวกับเรา - ประวัติองค์กร' },
              en: { title: 'About Us - Company Profile' },
            },
            sections: [],
          },
        ];
      }
    },
  });
};

export const usePublishPageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (pageId: string) => {
      const res = await apiClient(`/admin/pages/${pageId}/publish`, { method: 'POST' });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pages'] });
      queryClient.invalidateQueries({ queryKey: ['page'] });
    },
  });
};
