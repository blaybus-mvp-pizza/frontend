import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '상품',
  description: '팝업스토어 경매 상품을 둘러보세요. 진행중인 경매, 종료된 경매, 예정된 경매까지 모든 상품을 확인하세요.',
  openGraph: {
    title: '상품 | PopShop',
    description: '팝업스토어 경매 상품을 둘러보세요.',
    url: 'https://popshop.co.kr/products',
  },
}

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}