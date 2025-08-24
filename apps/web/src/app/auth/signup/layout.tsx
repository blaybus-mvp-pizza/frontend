import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '회원가입',
  description: 'PopShop 회원가입으로 특별한 팝업스토어 경매를 시작하세요.',
}

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}