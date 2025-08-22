import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsApi } from '@/api/endpoints/notifications.api'
import { NotificationListResult, UnreadCountResult } from '@/api/types'
import { useUIStore } from '@/store/ui.store'

// Query keys
export const notificationKeys = {
  all: ['notifications'] as const,
  list: (limit?: number) => [...notificationKeys.all, 'list', { limit }] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
}

// Get notifications list
export const useNotifications = (limit: number = 50, enabled: boolean = true) => {
  return useQuery<NotificationListResult>({
    queryKey: notificationKeys.list(limit),
    queryFn: () => notificationsApi.getNotifications(limit),
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 2, // 2 minutes
    enabled,
  })
}

// Get unread notifications count
export const useUnreadNotificationsCount = (enabled: boolean = true) => {
  return useQuery<UnreadCountResult>({
    queryKey: notificationKeys.unreadCount(),
    queryFn: notificationsApi.getUnreadCount,
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60, // Refetch every minute
    enabled,
  })
}

// Mark notifications as read
export const useMarkNotificationsAsRead = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useUIStore()

  return useMutation({
    mutationFn: (notificationIds: number[]) => notificationsApi.markAsRead(notificationIds),
    onSuccess: () => {
      // Invalidate both list and count queries
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
      showSuccess('알림을 읽음 처리했습니다.')
    },
    onError: () => {
      showError('알림 읽음 처리에 실패했습니다.')
    },
  })
}