import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: '인증',
    template: '%s | PopShop'
  },
  description: 'PopShop 로그인 및 회원가입',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}