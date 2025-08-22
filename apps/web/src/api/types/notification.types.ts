// Notification types

export interface NotificationItem {
  id: number
  title: string
  body: string
  sent_at: string // ISO date string
  status: 'SENT' | 'READ'
  image_url?: string
}

export interface NotificationListResult {
  items: NotificationItem[]
}

export interface MarkReadRequest {
  notification_ids: number[]
}

export interface MarkReadResult {
  ok: boolean
}

export interface UnreadCountResult {
  count: number
}