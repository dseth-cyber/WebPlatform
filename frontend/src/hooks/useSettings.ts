import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export const usePublicSettings = () => {
  return useQuery<Record<string, any>>({
    queryKey: ['settings', 'public'],
    queryFn: async () => {
      try {
        const res = await apiClient<Record<string, any>>('/public/settings');
        return res.data ?? {};
      } catch (e) {
        return {
          company_profile: {
            nameTh: 'บริษัท โลหะกิจรุ่งเจริญทรัพย์ จำกัด',
            nameEn: 'LOHAKIT RUNGCHAREONSAP CO., LTD.',
            taxId: '0745548001234',
            establishedYear: 1998,
            registeredCapital: '100,000,000 THB',
          },
          contact_details: {
            phone: '+66 (0) 34 878 999',
            email: 'sales@lohakit.co.th',
            businessHours: 'Mon - Sat: 08:00 - 17:00',
          },
        };
      }
    },
  });
};

export const useAdminSettings = () => {
  return useQuery<any[]>({
    queryKey: ['admin', 'settings'],
    queryFn: async () => {
      try {
        const res = await apiClient<any[]>('/admin/settings');
        return res.data ?? [];
      } catch (e) {
        return [];
      }
    },
  });
};
