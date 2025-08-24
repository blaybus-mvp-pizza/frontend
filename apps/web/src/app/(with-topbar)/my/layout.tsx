import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '마이페이지',
  description: '내 프로필, 입찰 내역, 관심 상품을 관리하세요.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function MyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}