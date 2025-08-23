// Re-export common types from centralized location
export type { Page } from '@/api/types/common.types'
export type {
  StoreMeta,
  ProductSpecs,
  ProductMeta,
  ProductListItem,
} from '@/api/types/product.types'

// Legacy API-specific types that aren't in the new structure yet
export interface AuctionInfo {
  auction_id: number
  buy_now_price?: number
  current_highest_bid?: number
  bid_steps: number[]
  starts_at: string
  ends_at: string
  start_price: number
  min_bid_price: number
  deposit_amount: number
  bidder_count: number
  status: 'SCHEDULED' | 'RUNNING' | 'ENDED' | 'CANCELLED'
}

export interface UserBrief {
  id: number
  name?: string
  profile_image?: string
}

export interface BidItem {
  user: UserBrief
  bid_amount: number
  bid_at: string
}

