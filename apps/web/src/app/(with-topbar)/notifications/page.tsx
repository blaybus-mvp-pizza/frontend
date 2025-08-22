'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@workspace/ui/components/button'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Bell, ChevronLeft } from 'lucide-react'

import { useMarkNotificationsAsRead, useNotifications } from '@/api/hooks/queries/useNotifications'
import { NotificationItem } from '@/api/types'
import { Skeleton } from '@/components/ui/skeleton'
import { useRequireAuth } from '@/hooks/useAuth'
import { cn } from '@/utils/cn'

export default function NotificationsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth()
  const { data, isLoading } = useNotifications(50, isAuthenticated)
  const markAsRead = useMarkNotificationsAsRead(true) // Show toast for bulk actions
  const markAsReadSilent = useMarkNotificationsAsRead(false) // No toast for individual clicks

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return '방금 전'
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`
    } else if (diffInHours < 48) {
      return '어제'
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}일 전`
    } else {
      return format(date, 'MM월 dd일', { locale: ko })
    }
  }

  if (isLoading || authLoading) {
    return <NotificationPageSkeleton />
  }

  const notifications = data?.items || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="p-0 hover:bg-transparent"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold">알림</h1>
          </div>
          {notifications.some((n) => n.status === 'SENT') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const unreadIds = notifications
                  .filter((item) => item.status === 'SENT')
                  .map((item) => item.id)
                markAsRead.mutate(unreadIds)
              }}
              className="text-sm text-gray-600"
            >
              모두 읽음
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="w-full">
        {notifications.length === 0 ? (
          <EmptyNotifications />
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                formatDate={formatDate}
                onMarkAsRead={markAsReadSilent}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function NotificationCard({
  notification,
  formatDate,
  onMarkAsRead,
}: {
  notification: NotificationItem
  formatDate: (date: string) => string
  onMarkAsRead: ReturnType<typeof useMarkNotificationsAsRead>
}) {
  const isRead = notification.status === 'READ'

  const handleClick = () => {
    // Mark as read if it's unread
    if (!isRead) {
      onMarkAsRead.mutate([notification.id], {
        onSuccess: () => {
          // Optionally handle success (the mutation already shows a toast)
        },
      })
    }
    
    // Navigate to relevant page based on notification type/data if needed
    // For now, just mark as read
  }

  return (
    <div
      className={cn(
        'w-full cursor-pointer p-4 transition-colors hover:bg-gray-50',
        !isRead && 'bg-blue-50/30',
      )}
      onClick={handleClick}
    >
      <div className="flex gap-3">
        {notification.image_url ? (
          <img
            src={notification.image_url}
            alt=""
            className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gray-200">
            <Bell className="h-5 w-5 text-gray-500" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className={cn('text-sm font-medium', isRead ? 'text-gray-900' : 'text-black')}>
                {notification.title}
              </p>
              <p className={cn('mt-1 text-sm', isRead ? 'text-gray-500' : 'text-gray-700')}>
                {notification.body}
              </p>
            </div>
            {!isRead && <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />}
          </div>
          <p className="mt-1 text-xs text-gray-400">{formatDate(notification.sent_at)}</p>
        </div>
      </div>
    </div>
  )
}

function EmptyNotifications() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <Bell className="h-8 w-8 text-gray-400" />
      </div>
      <p className="text-center text-gray-500">알림이 없습니다</p>
    </div>
  )
}

function NotificationPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 border-b bg-white">
        <div className="flex items-center gap-3 px-4 py-3">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>

      <div className="mx-auto max-w-2xl divide-y divide-gray-200">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4">
            <div className="flex gap-3">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="mb-2 h-4 w-32" />
                <Skeleton className="mb-1 h-4 w-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
