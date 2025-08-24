import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '로그인',
  description: 'PopShop에 로그인하여 특별한 팝업스토어 경매에 참여하세요.',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}