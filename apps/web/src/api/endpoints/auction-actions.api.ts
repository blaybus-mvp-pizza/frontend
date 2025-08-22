import { apiClient } from '../client/apiClient'
import { PlaceBidResult, BuyNowActionResult } from '../types/auction-action.types'

export const auctionActionsApi = {
  // Place a bid
  placeBid: async (auctionId: number, amount: number): Promise<PlaceBidResult> => {
    const response = await apiClient.post(`/auctions/${auctionId}/bid`, null, {
      params: { amount }
    })
    return response.data
  },

  // Buy now
  buyNow: async (auctionId: number): Promise<BuyNowActionResult> => {
    const response = await apiClient.post(`/auctions/${auctionId}/buy-now`)
    return response.data
  },
}