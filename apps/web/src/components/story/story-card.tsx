'use client';

import { Story } from '@workspace/ui/types';
import { cn } from '@/utils/cn';

interface StoryCardProps {
  story: Story;
  onClick: () => void;
}

export default function StoryCard({ story, onClick }: StoryCardProps) {
  const mainImage = story.images?.[0]?.imageUrl || '/placeholder.png';
  const popupStore = story.product?.popupStore;

  return (
    <div
      className={cn(
        'w-[301px] flex flex-col rounded-[1px] overflow-hidden cursor-pointer',
        'bg-background-100'
      )}
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
          <div className={cn(
            'font-semibold text-base leading-[140%] tracking-[-0.025em] line-clamp-1',
            'text-text-primary'
          )}>
            {story.title}
          </div>
          <p className={cn(
            'font-medium text-sm leading-[160%] tracking-[-0.025em] line-clamp-2',
            'text-text-tertiary'
          )}>
            {story.content}
          </p>
        </div>
      </div>

      <div className={cn(
        'w-full h-[96px] p-4 flex items-start space-x-4',
        'bg-background-200'
      )}>
        <div className='relative w-10 h-10 rounded-sm overflow-hidden shrink-0'>
          <img
            src={popupStore.bannerImageUrl || '/placeholder.png'}
            alt={popupStore.name}
            className='w-full h-full object-cover rounded-sm'
          />
        </div>
        <div className='flex flex-col gap-1'>
          <span className={cn(
            'text-sm font-semibold line-clamp-1',
            'text-text-primary'
          )}>
            {popupStore.name}
          </span>
          <span className={cn(
            'text-[13px] font-normal leading-[150%] tracking-[-0.025em] line-clamp-2',
            'text-text-secondary'
          )}>
            {popupStore.description}
          </span>
        </div>
      </div>
    </div>
  );
}
