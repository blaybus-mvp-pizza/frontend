import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '스토리',
  description: '팝업스토어의 특별한 이야기들을 만나보세요. 브랜드 스토리, 제품 스토리, 고객 후기까지.',
  openGraph: {
    title: '스토리 | PopShop',
    description: '팝업스토어의 특별한 이야기들을 만나보세요.',
    url: 'https://popshop.co.kr/story',
  },
}

export default function StoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}