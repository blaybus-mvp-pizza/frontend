import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '검색',
  description: '팝업스토어 상품을 검색하세요. 브랜드, 카테고리, 가격대별로 원하는 상품을 찾아보세요.',
  openGraph: {
    title: '검색 | PopShop',
    description: '팝업스토어 상품을 검색하세요.',
    url: 'https://popshop.co.kr/search',
  },
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}