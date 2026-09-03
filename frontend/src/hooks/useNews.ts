import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { LocalizedNewsArticle } from '../types/domain';
import { MOCK_NEWS } from '../api/mockData';

export const useNews = (category?: string, lang: string = 'th') => {
  return useQuery<LocalizedNewsArticle[]>({
    queryKey: ['news', category, lang],
    queryFn: async () => {
      try {
        // 1. Try public settings DB key first
        const settingsRes = await fetch('/api/v1/public/settings');
        if (settingsRes.ok) {
          const json = await settingsRes.json();
          if (json && json.data && Array.isArray(json.data.site_news) && json.data.site_news.length > 0) {
            let list = json.data.site_news;
            if (category && category !== 'all') {
              list = list.filter((n: any) => n.category === category);
            }
            return list;
          }
        }

        // 2. Try REST API endpoint
        const res = await apiClient<LocalizedNewsArticle[]>(
          `/public/news?category=${category || ''}&lang=${lang}`
        );
        return (res.data && res.data.length > 0) ? res.data : MOCK_NEWS;
      } catch (e) {
        return MOCK_NEWS;
      }
    },
  });
};

export const useNewsBySlug = (slug: string, lang: string = 'th') => {
  return useQuery<LocalizedNewsArticle | null>({
    queryKey: ['news-article', slug, lang],
    queryFn: async () => {
      try {
        const settingsRes = await fetch('/api/v1/public/settings');
        if (settingsRes.ok) {
          const json = await settingsRes.json();
          if (json && json.data && Array.isArray(json.data.site_news)) {
            const found = json.data.site_news.find((n: any) => n.slug === slug);
            if (found) return found;
          }
        }

        const res = await apiClient<LocalizedNewsArticle>(`/public/news/${slug}?lang=${lang}`);
        return res.data ?? MOCK_NEWS[0];
      } catch (e) {
        const found = MOCK_NEWS.find((n) => n.slug === slug);
        return found || MOCK_NEWS[0];
      }
    },
  });
};

export const useNewsArticle = useNewsBySlug;
