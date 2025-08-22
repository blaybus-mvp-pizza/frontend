import type {
  AuctionInfo,
  BidItem,
  Page,
  ProductListItem,
  ProductMeta,
  StoreMeta,
} from '@/types/api'

import { apiClient } from '../client/apiClient'

export const productsApi = {
  // Get store metadata
  getStoreMeta: async (storeId: number): Promise<StoreMeta> => {
    const response = await apiClient.get(`/catalog/stores/${storeId}/meta`)
    return response.data
  },

  // Get products by store
  getStoreProducts: async (
    storeId: number,
    params?: {
      page?: number
      size?: number
      sort?: 'recommended' | 'popular' | 'latest' | 'ending'
      status?: 'ALL' | 'RUNNING' | 'ENDED'
      bidders?: 'ALL' | 'LE_10' | 'BT_10_20' | 'GE_20'
      price_bucket?: string
      price_min?: number
      price_max?: number
    },
  ): Promise<Page<ProductListItem>> => {
    const response = await apiClient.get(`/catalog/stores/${storeId}/products`, { params })
    return response.data
  },

  // Get product metadata
  getProductMeta: async (productId: number): Promise<ProductMeta> => {
    const response = await apiClient.get(`/catalog/products/${productId}/meta`)
    return response.data
  },

  // Get product auction info
  getProductAuctionInfo: async (productId: number): Promise<AuctionInfo> => {
    const response = await apiClient.get(`/catalog/products/${productId}/auction`)
    return response.data
  },

  // Get product bids
  getProductBids: async (
    productId: number,
    params?: {
      page?: number
      size?: number
    },
  ): Promise<Page<BidItem>> => {
    const response = await apiClient.get(`/catalog/products/${productId}/bids`, {
      params: {
        page: params?.page || 1,
        size: params?.size || 3,
      },
    })
    return response.data
  },

  // Get similar products
  getSimilarProducts: async (
    productId: number,
    params?: {
      page?: number
      size?: number
      sort?: 'recommended' | 'popular' | 'latest' | 'ending'
      status?: 'ALL' | 'RUNNING' | 'ENDED'
      bidders?: 'ALL' | 'LE_10' | 'BT_10_20' | 'GE_20'
      price_bucket?: string
      price_min?: number
      price_max?: number
    },
  ): Promise<Page<ProductListItem>> => {
    const response = await apiClient.get(`/catalog/products/${productId}/similar`, {
      params: {
        page: params?.page || 1,
        size: params?.size || 4,
        ...params,
      },
    })
    return response.data
  },
}
