import {
  storyApi,
  StoryFilters,
  PaginatedResponse,
} from '@/services/api/story';
import { useQuery } from '@tanstack/react-query';
import { Story } from '@workspace/ui/types';

export const storyKeys = {
  all: ['stories'] as const,
  lists: () => [...storyKeys.all, 'list'] as const,
  list: (filters?: {}) => [...storyKeys.lists(), filters] as const,
  paginated: (filters?: StoryFilters) =>
    [...storyKeys.all, 'paginated', filters] as const,
  details: () => [...storyKeys.all, 'detail'] as const,
  detail: (id: number) => [...storyKeys.details(), id] as const,
};

export function useStoriesWithPagination(filters: StoryFilters) {
  return useQuery<PaginatedResponse<Story>>({
    queryKey: storyKeys.paginated(filters),
    queryFn: () => storyApi.getStoriesWithPagination(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (previousData) => previousData,
  });
}

export function useStory(id: number) {
  return useQuery<Story | null>({
    queryKey: storyKeys.detail(id),
    queryFn: () => storyApi.getStoryById(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    enabled: !!id,
  });
}
