import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '홈',
  description: '팝업스토어 경매 플랫폼 PopShop에서 특별한 상품을 만나보세요. 마감임박, MD 추천, 신규 상품까지!',
  openGraph: {
    title: '홈 | PopShop',
    description: '팝업스토어 경매 플랫폼 PopShop에서 특별한 상품을 만나보세요.',
    url: 'https://popshop.co.kr/home',
  },
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}