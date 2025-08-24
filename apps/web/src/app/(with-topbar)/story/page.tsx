import { Suspense } from 'react'

import StoryCardList from '@/components/story/story-card-list'

export default function StoryPage() {
  return (
    <div className="pb-30 w-full">
      <div className="flex flex-col gap-4 pb-10 pt-20 text-center">
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
