'use client'

import { useMemo } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import StoryCard from '@/components/story/story-card'
import { Pagination } from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { useStories } from '@/hooks/queries/useStories'

export default function StoryCardList() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const page = parseInt(searchParams.get('page') || String(1))

  const { data, isLoading } = useStories(page, 9)
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`?${params.toString()}`)
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStoryClick = (storyId: number) => {
    router.push(`/story/${storyId}`)
  }

  const stories = data?.items || []
  const totalPages = Math.ceil((data?.total || 0) / (data?.size || 9))

  // Transform API data to Story format expected by StoryCard
  const transformToStory = (apiStory: any) => {
    console.log('API Story:', apiStory)
    return {
      story_id: apiStory.story_id,
      content: apiStory.content,
      title: apiStory.title,
      product: {
        id: apiStory.product.id,
        name: apiStory.product.name,
        summary: apiStory.product.summary,
        image: apiStory.product.image,
      },
      representative_image: apiStory.representative_image,
    }
  }

  return (
    <>
      {isLoading ? (
        <div className="grid grid-cols-1 justify-items-center gap-x-[20px] gap-y-[56px] sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <StoryCardSkeleton key={index} />
          ))}
        </div>
      ) : stories.length > 0 ? (
        <div className="grid grid-cols-1 justify-items-center gap-x-[20px] gap-y-[56px] sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <StoryCard
              key={story.story_id}
              story={transformToStory(story)}
              onClick={() => handleStoryClick(story.story_id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-gray-500">등록된 스토리가 없습니다.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </>
  )
}

function StoryCardSkeleton() {
  return (
    <div className="w-full max-w-[500px] space-y-4">
      <Skeleton className="h-[320px] w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  )
}
