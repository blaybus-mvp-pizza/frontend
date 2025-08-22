// API Response Types

// Common Types
export interface Page<T> {
  items: T[]
  page: number
  size: number
  total: number
}

export interface StoreMeta {
  store_id: number
  name: string
  image_url: string
  description: string
  sales_description: string
}

export interface ProductSpecs {
  material?: string
  place_of_use?: string
  width_cm?: number
  height_cm?: number
  tolerance_cm?: number
  edition_info?: string
  condition_note?: string
}

export interface ProductMeta {
  id: number
  name: string
  images: string[]
  tags: string[]
  title?: string
  description?: string
  category?: string
  store: StoreMeta
  specs: ProductSpecs
}

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

export interface ProductListItem {
  product_id: number
  popup_store_name: string
  product_name: string
  current_highest_bid: number
  buy_now_price: number
  representative_image: string | null
  auction_ends_at: string
}

export interface ProductListResponse {
  items: ProductListItem[]
  page: number
  size: number
  total: number
}

// Map API response to our Product type
export function mapApiProductToProduct(apiProduct: ProductListItem): any {
  return {
    id: apiProduct.product_id,
    name: apiProduct.product_name,
    price: apiProduct.current_highest_bid || apiProduct.buy_now_price || 0,
    images: apiProduct.representative_image
      ? [
          {
            id: 1,
            productId: apiProduct.product_id,
            imageUrl: apiProduct.representative_image,
            sortOrder: 0,
          },
        ]
      : [],
    popupStore: {
      id: 0,
      name: apiProduct.popup_store_name,
      createdAt: new Date(),
    },
    // Add auction data
    auction: {
      currentBid: {
        amount: apiProduct.current_highest_bid,
      },
      buyNowPrice: apiProduct.buy_now_price,
      endsAt: apiProduct.auction_ends_at,
    },
    // Default values for other required fields
    popupStoreId: 0,
    category: '',
    summary: '',
    description: '',
    stock: 0,
    shippingBaseFee: 0,
    shippingFreeThreshold: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [],
  }
}
