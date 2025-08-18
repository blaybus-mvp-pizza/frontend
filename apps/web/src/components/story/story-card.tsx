'use client';

import { Story } from '@workspace/ui/types';

interface StoryCardProps {
  story: Story;
  onClick: () => void;
}

export default function StoryCard({ story, onClick }: StoryCardProps) {
  const mainImage = story.images?.[0]?.imageUrl || '/placeholder.png';
  const popupStore = story.product?.popupStore;

  return (
    <div
      className='w-[301px] flex flex-col rounded-[1px] overflow-hidden bg-white cursor-pointer'
      onClick={onClick}
    >
      <div className='relative w-full h-[200px] overflow-hidden bg-muted'>
        <img
          src={mainImage}
          alt={story.title}
          className='h-full w-full object-cover transition-transform group-hover:scale-105'
        />
      </div>

      <div className='px-4 pt-4 pb-6 space-y-3'>
        <div className='flex flex-col gap-2'>
          <div className='font-semibold text-base text-[#111111] leading-[140%] tracking-[-0.025em] line-clamp-1'>
            {story.title}
          </div>
          <p className='font-medium text-sm text-[#767676] leading-[160%] tracking-[-0.025em] line-clamp-2'>
            {story.content}
          </p>
        </div>
      </div>

      <div className='bg-[#F5F5F5] w-full h-[96px] p-4 flex items-start space-x-4'>
        <div className='relative w-10 h-10 rounded-sm overflow-hidden shrink-0'>
          <img
            src={popupStore.bannerImageUrl || '/placeholder.png'}
            alt={popupStore.name}
            className='w-full h-full object-cover rounded-sm'
          />
        </div>
        <div className='flex flex-col gap-1'>
          <span className='text-sm font-semibold text-[#111111] line-clamp-1'>
            {popupStore.name}
          </span>
          <span className='text-[13px] font-normal text-[#505050] leading-[150%] tracking-[-0.025em] line-clamp-2'>
            {popupStore.description}
          </span>
        </div>
      </div>
    </div>
  );
}
