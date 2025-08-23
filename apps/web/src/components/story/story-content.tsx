'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Button } from '@workspace/ui/components/button'
import { format } from 'timeago.js'

import { Skeleton } from '@/components/ui/skeleton'
import { useStoryDetail } from '@/hooks/queries/useStories'
import '@/lib/timeage-ko.js'

import InterviewCTA from './interview-cta'

export default function StoryContent({ id }: { id: string }) {
  const router = useRouter()
  const { data: story, isLoading } = useStoryDetail(Number(id))

  if (!story || isLoading) return <StoryContentSkeleton />

  const mainImage = story.images?.[0] || '/placeholder.png'
  const popupStore = story.product

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="-mx-4">
      <div className="bg-muted relative h-[360px] w-[100vw] overflow-hidden">
        <img
          src={mainImage}
          alt={story.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="mx-auto max-w-[880px] px-4">
        <div className="px-4 sm:px-0">
          <div className="mb-4 mt-4 flex flex-col gap-4">
            <div className="text-text-tertiary text-sm font-medium leading-[160%] tracking-[-0.025em]">
              {format(story.created_at, 'ko')}
            </div>
            <div className="text-text-primary text-2xl font-semibold leading-[140%] tracking-[-0.025em]">
              {story.title}
            </div>
          </div>
          {popupStore && (
            <div className="flex w-full items-start space-x-4 bg-[#F5F5F5] p-4">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm">
                <img
                  src={popupStore.image || '/placeholder.png'}
                  alt={popupStore.name}
                  className="h-full w-full rounded-sm object-cover"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-text-primary line-clamp-1 text-sm font-semibold">
                  {popupStore.name}
                </span>
                <span className="text-text-secondary line-clamp-2 text-[13px] font-normal leading-[150%] tracking-[-0.025em]">
                  {popupStore.summary}
                </span>
              </div>
            </div>
          )}
        </div>

        <Content />

        <InterviewCTA />

        <div className="flex justify-center px-4 pb-3">
          <Button
            onClick={handleGoBack}
            className="mt-12 h-12 cursor-pointer bg-[#52565B] text-sm font-bold text-white"
          >
            목록 돌아가기
          </Button>
        </div>
      </div>
    </div>
  )
}

function Content() {
  return (
    <div className="relative my-8 h-auto w-full">
      <Image
        src="/images/STORY_CONTENT.svg"
        alt="나팔스토리 컨텐츠"
        layout="responsive"
        width={800}
        height={3640}
        className="object-contain"
      />
    </div>
  )
}

const StoryContentSkeleton = () => {
  return (
    <div>
      <Skeleton className="mb-8 h-[300px] w-full" />
      <div className="mb-4 mt-4 flex flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-3/4" />
      </div>
      <div className="flex items-start space-x-4 p-4">
        <Skeleton className="h-10 w-10 shrink-0 rounded-sm" />
        <div className="flex w-full flex-col gap-1">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
      <Skeleton className="my-10 h-1 w-full" />
      <div className="my-10 space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-10/12" />
      </div>
      <Skeleton className="my-10 h-1 w-full" />
      <div className="my-10 space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-10/12" />
      </div>
      <Skeleton className="my-10 h-24 w-full rounded-lg" />
      <div className="flex justify-center px-4 pb-3">
        <Skeleton className="mt-12 h-12 w-48" />
      </div>
    </div>
  )
}
