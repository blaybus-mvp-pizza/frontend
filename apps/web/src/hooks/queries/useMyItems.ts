import { useQuery } from '@tanstack/react-query'

import { Item, ItemFilters, PaginatedResponse, UserStats, myApi } from '@/services/api/my'

export const myKeys = {
  all: ['my-items'] as const,
  lists: () => [...myKeys.all, 'list'] as const,
  paginated: (filters?: ItemFilters) => [...myKeys.lists(), { ...filters }] as const,
  details: () => [...myKeys.all, 'detail'] as const,
  detail: (id: number) => [...myKeys.details(), id] as const,
}

export function useMyItemsWithPagination(filters: ItemFilters) {
  return useQuery<PaginatedResponse<Item>>({
    queryKey: myKeys.paginated(filters),
    queryFn: () => myApi.getItemsWithPagination(filters),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  })
}

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: myApi.getUserProfile,
  })
}

export const useUserStats = () => {
  return useQuery<UserStats>({
    queryKey: ['userStats'],
    queryFn: myApi.getUserStats,
  })
}
