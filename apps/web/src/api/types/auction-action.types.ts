// Auction action types

export interface BidResult {
  bid_id: number
  amount: number
}

export interface BuyNowResult {
  status: string
  payment_id?: number
}