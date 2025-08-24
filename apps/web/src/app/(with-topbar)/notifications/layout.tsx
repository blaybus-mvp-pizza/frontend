import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '알림',
  description: '경매 알림 및 소식을 확인하세요.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}