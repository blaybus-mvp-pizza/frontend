import { useQuery } from '@tanstack/react-query'
import { usersApi } from '@/api/endpoints/users.api'
import { myApi, MyAuctionFilters } from '@/api/endpoints/my.api'
import { UserRead, UserAuctionDashboard, UserRelatedAuctionItem, Page } from '@/api/types'

// Query keys
export const myPageKeys = {
  all: ['mypage'] as const,
  profile: () => [...myPageKeys.all, 'profile'] as const,
  dashboard: () => [...myPageKeys.all, 'dashboard'] as const,
  auctions: () => [...myPageKeys.all, 'auctions'] as const,
  auctionsList: (filters?: MyAuctionFilters) => [...myPageKeys.auctions(), { ...filters }] as const,
}

// Get user profile (me)
export const useUserProfile = () => {
  return useQuery<UserRead>({
    queryKey: myPageKeys.profile(),
    queryFn: usersApi.getMe,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })
}

// Get auction dashboard stats
export const useAuctionDashboard = () => {
  return useQuery<UserAuctionDashboard>({
    queryKey: myPageKeys.dashboard(),
    queryFn: myApi.getAuctionDashboard,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Get user's auctions with pagination
export const useMyAuctions = (filters: MyAuctionFilters = {}) => {
  return useQuery<Page<UserRelatedAuctionItem>>({
    queryKey: myPageKeys.auctionsList(filters),
    queryFn: () => myApi.getMyAuctions(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (previousData) => previousData,
  })
}