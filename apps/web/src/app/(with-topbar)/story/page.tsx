import { Suspense } from 'react'

import StoryCardList from '@/components/story/story-card-list'

export default function StoryPage() {
  return (
    <div className="w-full">
      <div className="mt-6 space-y-4 pb-10 text-center md:mt-20">
        <div className="text-text-primary text-[28px] font-bold leading-[140%]">NafaL 스토리</div>
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
