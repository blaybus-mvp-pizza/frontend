import { apiClient } from '../client/apiClient'
import { UserAuctionDashboard, UserRelatedAuctionItem, Page } from '../types'

export interface MyAuctionFilters {
  page?: number
  size?: number
  period?: '1m' | '3m' | 'custom'
  startDate?: string
  endDate?: string
  q?: string
}

export const myApi = {
  // Get auction dashboard stats
  getAuctionDashboard: async (): Promise<UserAuctionDashboard> => {
    const response = await apiClient.get('/users/me/auctions/dashboard')
    return response.data
  },

  // Get user's related auctions with pagination
  getMyAuctions: async (filters: MyAuctionFilters = {}): Promise<Page<UserRelatedAuctionItem>> => {
    const params: any = {
      page: filters.page || 1,
      size: filters.size || 10,
      period: filters.period || '1m',
    }

    if (filters.period === 'custom' && filters.startDate && filters.endDate) {
      params.startDate = filters.startDate
      params.endDate = filters.endDate
    }

    if (filters.q) {
      params.q = filters.q
    }

    const response = await apiClient.get('/users/me/auctions', { params })
    return response.data
  },
}