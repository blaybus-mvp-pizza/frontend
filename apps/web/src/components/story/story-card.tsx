'use client'

import { Story } from '@workspace/ui/types'

import { cn } from '@/utils/cn'

interface StoryCardProduct {
  id: number
  image: string
  name: string
  summary: string
}

export interface StoryCustomType {
  content: string
  product: StoryCardProduct
  representative_image: string
  story_id: number
  title: string
}

interface StoryCardProps {
  story: StoryCustomType
  onClick: () => void
}

export default function StoryCard({ story, onClick }: StoryCardProps) {
  const mainImage = story.representative_image || '/placeholder.png'

  return (
    <div
      className={cn(
        'border-border-light flex w-[301px] cursor-pointer flex-col overflow-hidden rounded-[1px] border',
        'bg-background-100',
      )}
      onClick={onClick}
    >
      <div className="bg-muted relative h-[200px] w-full overflow-hidden">
        <img
          src={mainImage}
          alt={story.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>

      <div className="space-y-3 px-4 pb-6 pt-4">
        <div className="flex flex-col gap-2">
          <div
            className={cn(
              'line-clamp-1 text-base font-semibold leading-[140%] tracking-[-0.025em]',
              'text-text-primary',
            )}
          >
            {story.title}
          </div>
          <p
            className={cn(
              'line-clamp-2 text-sm font-normal leading-[160%] tracking-[-0.025em]',
              'text-text-secondary',
            )}
          >
            {story.content}
          </p>
        </div>
      </div>

      <div className={cn('flex h-[96px] w-full items-start space-x-4 p-4', 'bg-background-200')}>
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm">
          <img
            src={story.product.image || '/placeholder.png'}
            alt={story.product.name}
            className="h-full w-full rounded-sm object-cover"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className={cn('line-clamp-1 text-sm font-semibold', 'text-text-primary')}>
            {story.product.name}
          </span>
          <span
            className={cn(
              'line-clamp-2 text-[13px] font-normal leading-[150%] tracking-[-0.025em]',
              'text-text-secondary',
            )}
          >
            {story.product.summary}
          </span>
        </div>
      </div>
    </div>
  )
}
