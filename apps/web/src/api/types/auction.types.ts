// Auction Related Types

export interface BidRequest {
  auction_id: number
  amount: number
}

export interface BidResult {
  success: boolean
  message: string
  bid_id?: number
  current_highest_bid?: number
  is_highest_bidder?: boolean
}

export interface BuyNowRequest {
  auction_id: number
}

export interface BuyNowResult {
  success: boolean
  message: string
  order_id?: number
  payment_required?: boolean
  payment_url?: string
}

export interface AuctionDetail {
  auction_id: number
  product_id: number
  status: 'PENDING' | 'RUNNING' | 'ENDED' | 'CANCELLED'
  current_highest_bid?: number
  minimum_bid: number
  bid_increment: number
  buy_now_price?: number
  starts_at: string
  ends_at: string
  total_bids: number
  unique_bidders: number
  is_user_highest_bidder?: boolean
  user_last_bid?: number
  bid_history?: BidHistoryItem[]
}

export interface BidHistoryItem {
  bid_id: number
  bidder_nickname: string
  amount: number
  bid_at: string
  is_winning?: boolean
}
