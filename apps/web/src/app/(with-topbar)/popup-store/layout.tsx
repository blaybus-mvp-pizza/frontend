import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '팝업스토어',
  description: '다양한 팝업스토어를 둘러보세요. 브랜드별 특별한 경매 상품을 만나보실 수 있습니다.',
  openGraph: {
    title: '팝업스토어 | PopShop',
    description: '다양한 팝업스토어를 둘러보세요.',
    url: 'https://popshop.co.kr/popup-store',
  },
}

export default function PopupStoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}