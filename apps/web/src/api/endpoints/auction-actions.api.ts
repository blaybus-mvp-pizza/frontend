import { apiClient } from '../client/apiClient'
import { BidResult, BuyNowResult } from '../types'

export const auctionActionsApi = {
  // Place a bid
  placeBid: async (auctionId: number, amount: number): Promise<BidResult> => {
    const response = await apiClient.post(`/auctions/${auctionId}/bid`, null, {
      params: { amount }
    })
    return response.data
  },

  // Buy now
  buyNow: async (auctionId: number): Promise<BuyNowResult> => {
    const response = await apiClient.post(`/auctions/${auctionId}/buy-now`)
    return response.data
  },
}