import { UseQueryOptions, useQuery } from '@tanstack/react-query'

import { auctionApi } from '@/api/endpoints/auction.api'
import { queryKeys } from '@/api/queryKeys'
import { AuctionDetail, BidHistoryItem } from '@/api/types'

// Get auction detail with optional polling for real-time updates
export const useAuctionDetail = (
  auctionId: number,
  enablePolling = true,
  options?: UseQueryOptions<AuctionDetail>,
) => {
  return useQuery({
    queryKey: queryKeys.auctions.detail(auctionId),
    queryFn: () => auctionApi.getAuctionDetail(auctionId),
    refetchInterval: enablePolling ? 5000 : false, // Poll every 5 seconds
    refetchIntervalInBackground: false,
    enabled: !!auctionId,
    ...options,
  })
}

// Get bid history for an auction
export const useBidHistory = (auctionId: number, options?: UseQueryOptions<BidHistoryItem[]>) => {
  return useQuery({
    queryKey: queryKeys.auctions.bids(auctionId),
    queryFn: () => auctionApi.getBidHistory(auctionId),
    enabled: !!auctionId,
    staleTime: 10000, // 10 seconds
    ...options,
  })
}

// Check if user can bid
export const useCanBid = (
  auctionId: number,
  options?: UseQueryOptions<{ canBid: boolean; reason?: string }>,
) => {
  return useQuery({
    queryKey: [...queryKeys.auctions.detail(auctionId), 'can-bid'],
    queryFn: () => auctionApi.canBid(auctionId),
    enabled: !!auctionId,
    staleTime: 5000, // 5 seconds
    ...options,
  })
}

// Get user's active bids
export const useUserBids = (options?: UseQueryOptions<AuctionDetail[]>) => {
  return useQuery({
    queryKey: [...queryKeys.auctions.all, 'my-bids'],
    queryFn: () => auctionApi.getUserBids(),
    staleTime: 30000, // 30 seconds
    ...options,
  })
}

// Get watched auctions
export const useWatchedAuctions = (options?: UseQueryOptions<AuctionDetail[]>) => {
  return useQuery({
    queryKey: [...queryKeys.auctions.all, 'watched'],
    queryFn: () => auctionApi.getWatchedAuctions(),
    staleTime: 30000, // 30 seconds
    ...options,
  })
}
