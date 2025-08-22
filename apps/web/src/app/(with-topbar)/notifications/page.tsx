'use client'

import { useEffect } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Bell, Check, ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@workspace/ui/components/button'
import { cn } from '@/utils/cn'
import { useAuthStore } from '@/store/auth.store'
import { useNotifications, useMarkNotificationsAsRead } from '@/api/hooks/queries/useNotifications'
import { NotificationItem } from '@/api/types'
import { Skeleton } from '@/components/ui/skeleton'

export default function NotificationsPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { data, isLoading } = useNotifications(50, isAuthenticated)
  const markAsRead = useMarkNotificationsAsRead()
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  // Auto-mark unread notifications as read when viewing
  useEffect(() => {
    if (data?.items) {
      const unreadIds = data.items
        .filter((item) => item.status === 'SENT')
        .map((item) => item.id)
      
      if (unreadIds.length > 0) {
        markAsRead.mutate(unreadIds)
      }
    }
  }, [data?.items])

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

  if (isLoading) {
    return <NotificationPageSkeleton />
  }

  const notifications = data?.items || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
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
          {notifications.some(n => n.status === 'SENT') && (
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
      <div className="max-w-2xl mx-auto">
        {notifications.length === 0 ? (
          <EmptyNotifications />
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} formatDate={formatDate} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function NotificationCard({ 
  notification, 
  formatDate 
}: { 
  notification: NotificationItem
  formatDate: (date: string) => string 
}) {
  const isRead = notification.status === 'READ'
  
  return (
    <div className={cn(
      'p-4 hover:bg-gray-50 transition-colors cursor-pointer',
      !isRead && 'bg-blue-50/30'
    )}>
      <div className="flex gap-3">
        {notification.image_url ? (
          <img 
            src={notification.image_url} 
            alt="" 
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
            <Bell className="h-5 w-5 text-gray-500" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className={cn(
                'text-sm font-medium',
                isRead ? 'text-gray-900' : 'text-black'
              )}>
                {notification.title}
              </p>
              <p className={cn(
                'text-sm mt-1',
                isRead ? 'text-gray-500' : 'text-gray-700'
              )}>
                {notification.body}
              </p>
            </div>
            {!isRead && (
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {formatDate(notification.sent_at)}
          </p>
        </div>
      </div>
    </div>
  )
}

function EmptyNotifications() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Bell className="h-8 w-8 text-gray-400" />
      </div>
      <p className="text-gray-500 text-center">
        알림이 없습니다
      </p>
    </div>
  )
}

function NotificationPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto divide-y divide-gray-200">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4">
            <div className="flex gap-3">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}