import { apiClient } from '../client/apiClient'
import {
  AuctionDetail,
  BidHistoryItem,
  BidRequest,
  BidResult,
  BuyNowRequest,
  BuyNowResult,
} from '../types'

export const auctionApi = {
  // Place a bid
  placeBid: async (data: BidRequest): Promise<BidResult> => {
    const response = await apiClient.post('/auction/bid', data)
    return response.data
  },

  // Buy now
  buyNow: async (data: BuyNowRequest): Promise<BuyNowResult> => {
    const response = await apiClient.post('/auction/buy-now', data)
    return response.data
  },

  // Get auction details
  getAuctionDetail: async (auctionId: number): Promise<AuctionDetail> => {
    const response = await apiClient.get(`/auction/${auctionId}`)
    return response.data
  },

  // Get bid history for an auction
  getBidHistory: async (auctionId: number): Promise<BidHistoryItem[]> => {
    const response = await apiClient.get(`/auction/${auctionId}/bids`)
    return response.data
  },

  // Check if user can bid
  canBid: async (auctionId: number): Promise<{ canBid: boolean; reason?: string }> => {
    const response = await apiClient.get(`/auction/${auctionId}/can-bid`)
    return response.data
  },

  // Get user's active bids
  getUserBids: async (): Promise<AuctionDetail[]> => {
    const response = await apiClient.get('/auction/my-bids')
    return response.data
  },

  // Get auctions user is watching
  getWatchedAuctions: async (): Promise<AuctionDetail[]> => {
    const response = await apiClient.get('/auction/watched')
    return response.data
  },

  // Add/Remove auction from watchlist
  toggleWatch: async (auctionId: number): Promise<{ watching: boolean }> => {
    const response = await apiClient.post(`/auction/${auctionId}/watch`)
    return response.data
  },
}
