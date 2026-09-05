import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { UserAdmin, AuditLog } from '../types/domain';

export const useAdminUsers = (search?: string) => {
  return useQuery<UserAdmin[]>({
    queryKey: ['admin', 'users', search],
    queryFn: async () => {
      try {
        const res = await apiClient<UserAdmin[]>(`/admin/users?search=${search || ''}`);
        return res.data ?? [];
      } catch (e) {
        return [
          {
            id: 'u-1',
            email: 'admin@localhost.co.th',
            fullName: 'Lohakit Administrator',
            status: 'ACTIVE',
            createdAt: '2026-09-01T00:00:00Z',
            roles: ['Superadmin'],
          },
          {
            id: 'u-2',
            email: 'editor@lohakit.co.th',
            fullName: 'Content Editor',
            status: 'ACTIVE',
            createdAt: '2026-09-02T00:00:00Z',
            roles: ['Editor'],
          },
        ];
      }
    },
  });
};

export const useAuditLogs = (resource?: string, action?: string) => {
  return useQuery<AuditLog[]>({
    queryKey: ['admin', 'audit-logs', resource, action],
    queryFn: async () => {
      try {
        const res = await apiClient<AuditLog[]>(`/admin/audit-logs?resource=${resource || ''}&action=${action || ''}`);
        return res.data ?? [];
      } catch (e) {
        return [
          {
            id: 'aud-1',
            userName: 'Lohakit Administrator',
            userEmail: 'admin@localhost.co.th',
            action: 'LOGIN',
            resource: 'auth',
            resourceId: 'u-1',
            ipAddress: '192.168.1.100',
            createdAt: '2026-09-02T04:30:00Z',
          },
          {
            id: 'aud-2',
            userName: 'Lohakit Administrator',
            userEmail: 'admin@localhost.co.th',
            action: 'PUBLISH',
            resource: 'page',
            resourceId: 'page-home',
            ipAddress: '192.168.1.100',
            createdAt: '2026-09-02T05:15:00Z',
          },
        ];
      }
    },
  });
};

export const useReAuthMutation = () => {
  return useMutation({
    mutationFn: async (password: string) => {
      const res = await apiClient('/admin/auth/reauth', {
        method: 'POST',
        body: JSON.stringify({ password }),
      });
      return res.data;
    },
  });
};

export const usePermanentDeleteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ entityType, id }: { entityType: string; id: string }) => {
      await apiClient(`/admin/trash/${entityType}/${id}/permanent`, { method: 'POST' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
};
