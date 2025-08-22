import { Suspense } from 'react'

import StoryCardList from '@/components/story/story-card-list'

export default function StoryPage() {
  return (
    <div className="mx-auto max-w-[960px]">
      <div className="py-10 text-center">
        <div className="mb-4 text-2xl font-bold leading-[140%] tracking-[0%] text-[#111111]">
          NafaL 스토리
        </div>
        <p className="text-sm font-medium leading-[160%] tracking-[-0.025em] text-[#767676]">
          버려질 뻔한 자산, 나팔을 만난 후의 새로운 여정을 확인해보세요
        </p>
      </div>
      <Suspense>
        <StoryCardList />
      </Suspense>
    </div>
  )
}
