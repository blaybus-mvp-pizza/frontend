import { useQuery } from '@tanstack/react-query'

import { productsApi } from '@/api/endpoints/products'
import type { AuctionInfo, BidItem, Page, ProductListItem, ProductMeta } from '@/types/api'

// Query keys factory
export const productDetailKeys = {
  all: ['productDetail'] as const,
  meta: (id: number) => [...productDetailKeys.all, 'meta', id] as const,
  auction: (id: number) => [...productDetailKeys.all, 'auction', id] as const,
  bids: (id: number, page?: number) => [...productDetailKeys.all, 'bids', id, { page }] as const,
  similar: (id: number, params?: any) => [...productDetailKeys.all, 'similar', id, params] as const,
  store: (id: number) => ['store', id] as const,
}

// Product metadata hook
export function useProductMeta(productId: number) {
  return useQuery<ProductMeta>({
    queryKey: productDetailKeys.meta(productId),
    queryFn: () => productsApi.getProductMeta(productId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    enabled: productId > 0,
  })
}

// Auction info hook
export function useProductAuction(productId: number) {
  return useQuery<AuctionInfo>({
    queryKey: productDetailKeys.auction(productId),
    queryFn: () => productsApi.getProductAuctionInfo(productId),
    staleTime: 1000 * 30, // 30 seconds (auction data changes frequently)
    gcTime: 1000 * 60 * 2, // 2 minutes
    enabled: productId > 0,
    refetchInterval: 1000 * 30, // Auto-refresh every 30 seconds for live auction data
  })
}

// Product bids hook
export function useProductBids(productId: number, page: number = 1, size: number = 3) {
  return useQuery<Page<BidItem>>({
    queryKey: productDetailKeys.bids(productId, page),
    queryFn: () => productsApi.getProductBids(productId, { page, size }),
    staleTime: 1000 * 10, // 10 seconds (bids change very frequently)
    gcTime: 1000 * 60, // 1 minute
    enabled: productId > 0,
    refetchInterval: 1000 * 10, // Auto-refresh every 10 seconds for live bid data
  })
}

// Similar products hook
export function useSimilarProducts(
  productId: number,
  params?: {
    page?: number
    size?: number
    sort?: 'recommended' | 'popular' | 'latest' | 'ending'
    status?: 'ALL' | 'RUNNING' | 'ENDED'
  },
) {
  return useQuery<Page<ProductListItem>>({
    queryKey: productDetailKeys.similar(productId, params),
    queryFn: () => productsApi.getSimilarProducts(productId, params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    enabled: productId > 0,
  })
}

// Store metadata hook
export function useStoreMeta(storeId: number) {
  return useQuery({
    queryKey: productDetailKeys.store(storeId),
    queryFn: () => productsApi.getStoreMeta(storeId),
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 20, // 20 minutes
    enabled: storeId > 0,
  })
}

// Combined product detail hook for convenience
export function useProductDetail(productId: number) {
  const productMeta = useProductMeta(productId)
  const auctionInfo = useProductAuction(productId)
  const bids = useProductBids(productId)
  const similarProducts = useSimilarProducts(productId)

  return {
    product: productMeta.data,
    auction: auctionInfo.data,
    bids: bids.data,
    similar: similarProducts.data,
    isLoading: productMeta.isLoading || auctionInfo.isLoading,
    isError: productMeta.isError || auctionInfo.isError,
    refetch: () => {
      productMeta.refetch()
      auctionInfo.refetch()
      bids.refetch()
    },
  }
}
