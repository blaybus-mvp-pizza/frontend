import { apiClient } from '../client/apiClient'
import { BuyNowActionResult, PlaceBidResult } from '../types/auction-action.types'

export const auctionActionsApi = {
  // Place a bid
  placeBid: async (auctionId: number, amount: number): Promise<PlaceBidResult> => {
    const response = await apiClient.post(`/auctions/bid`, null, {
      params: {
        auction_id: auctionId,
        amount: amount,
      },
    })
    return response.data
  },

  // Buy now
  buyNow: async (auctionId: number): Promise<BuyNowActionResult> => {
    const response = await apiClient.post(`/auctions/buy-now`, null, {
      params: {
        auction_id: auctionId,
      },
    })
    return response.data
  },
}
