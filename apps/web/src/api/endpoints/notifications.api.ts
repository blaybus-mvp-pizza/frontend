import { apiClient } from '../client/apiClient'
import {
  NotificationListResult,
  MarkReadRequest,
  MarkReadResult,
  UnreadCountResult,
} from '../types'

export const notificationsApi = {
  // Get notifications list
  getNotifications: async (limit: number = 50): Promise<NotificationListResult> => {
    const response = await apiClient.get('/notifications', {
      params: { limit },
    })
    return response.data
  },

  // Mark notifications as read
  markAsRead: async (notificationIds: number[]): Promise<MarkReadResult> => {
    const response = await apiClient.post('/notifications/read', {
      notification_ids: notificationIds,
    })
    return response.data
  },

  // Get unread notifications count
  getUnreadCount: async (): Promise<UnreadCountResult> => {
    const response = await apiClient.get('/notifications/count/unread')
    return response.data
  },
}