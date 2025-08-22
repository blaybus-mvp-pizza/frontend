// Auction action types

export interface PlaceBidResult {
  bid_id: number
  amount: number
}

export interface BuyNowActionResult {
  status: string
  payment_id?: number
}