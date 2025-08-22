import { Suspense } from 'react'

import StoryCardList from '@/components/story/story-card-list'

export default function StoryPage() {
  return (
    <div className="mx-auto max-w-[960px]">
      <div className="py-10 text-center">
        <div className="text-text-primary mb-4 text-2xl font-bold leading-[14text-text-primary0%]">
          NafaL 스토리
        </div>
        <p className="text-text-tertiary text-sm font-medium leading-[160%] tracking-[-0.025em]">
          버려질 뻔한 자산, 나팔을 만난 후의 새로운 여정을 확인해보세요
        </p>
      </div>
      <Suspense>
        <StoryCardList />
      </Suspense>
    </div>
  )
}
