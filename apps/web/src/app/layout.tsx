import type { Metadata } from 'next'

import '@workspace/ui/globals.css'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title: {
    default: 'PopShop - 팝업스토어 경매 플랫폼',
    template: '%s | PopShop',
  },
  description:
    '특별한 팝업스토어 상품을 경매로 만나보세요. 한정판 아이템, 독점 컬렉션, 프리미엄 상품까지.',
  keywords: ['팝업스토어', '경매', '한정판', '컬렉션', '프리미엄 상품', '온라인 경매'],
  authors: [{ name: 'PopShop' }],
  creator: 'PopShop',
  publisher: 'PopShop',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://popshop.co.kr'),
  openGraph: {
    title: 'PopShop - 팝업스토어 경매 플랫폼',
    description: '특별한 팝업스토어 상품을 경매로 만나보세요.',
    url: 'https://popshop.co.kr',
    siteName: 'PopShop',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    title: 'PopShop - 팝업스토어 경매 플랫폼',
    description: '특별한 팝업스토어 상품을 경매로 만나보세요.',
    creator: '@popshop',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  alternates: {
    canonical: 'https://popshop.co.kr',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
