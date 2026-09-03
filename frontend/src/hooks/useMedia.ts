import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { MediaFile } from '../types/domain';
import { MOCK_MEDIA } from '../api/mockData';

export const useMediaLibrary = (folder?: string, mimeType?: string, search?: string) => {
  return useQuery<MediaFile[]>({
    queryKey: ['admin', 'media', folder, mimeType, search],
    queryFn: async () => {
      try {
        const res = await apiClient<MediaFile[]>(
          `/admin/media?folder=${folder || ''}&mimeType=${mimeType || ''}&search=${search || ''}`
        );
        return res.data ?? [];
      } catch (e) {
        return MOCK_MEDIA;
      }
    },
  });
};

export const useDeleteMediaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient(`/admin/media/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'media'] });
    },
  });
};
