import StoryCardList from '@/components/story/story-card-list';
import { Suspense } from 'react';

export default function StoryPage() {
  return (
    <div className='max-w-[960px] mx-auto'>
      <div className='py-10 text-center'>
        <div className='font-bold text-2xl text-[#111111] leading-[140%] tracking-[0%] mb-4'>
          NafaL 스토리
        </div>
        <p className='font-medium text-sm text-[#767676] leading-[160%] tracking-[-0.025em]'>
          버려질 뻔한 자산, 나팔을 만난 후의 새로운 여정을 확인해보세요
        </p>
      </div>
      <Suspense>
        <StoryCardList />
      </Suspense>
    </div>
  );
}
