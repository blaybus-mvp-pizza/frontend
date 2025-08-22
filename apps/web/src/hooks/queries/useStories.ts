import { useQuery } from '@tanstack/react-query'

import { storiesApi } from '@/api/endpoints/stories.api'
import type { Page } from '@/api/types/common.types'
import type { StoryListItem, StoryMeta } from '@/api/types/story.types'

export const storyKeys = {
  all: ['stories'] as const,
  lists: () => [...storyKeys.all, 'list'] as const,
  list: (page: number, size: number) => [...storyKeys.lists(), { page, size }] as const,
  details: () => [...storyKeys.all, 'detail'] as const,
  detail: (id: number) => [...storyKeys.details(), id] as const,
}

export function useStories(page: number = 1, size: number = 9) {
  return useQuery<Page<StoryListItem>>({
    queryKey: storyKeys.list(page, size),
    queryFn: () => storiesApi.getStories(page, size),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (previousData) => previousData,
  })
}

export interface StoryDetailRV {
  story_id: number
  product: {
    id: number
    name: string
    image: string
    summary: string
  }
  title: string
  content: string
  images: string[]
  created_at: string
}
export function useStoryDetail(id: number) {
  return useQuery<StoryDetailRV>({
    queryKey: storyKeys.detail(id),
    queryFn: () => storiesApi.getStoryDetail(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!id,
  })
}
