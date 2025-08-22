// Product Related Types

// 상품 리스트 아이템 (간단한 정보)
export interface ProductListItem {
  product_id: number
  popup_store_name: string
  product_name: string
  current_highest_bid?: number
  buy_now_price?: number
  representative_image?: string
  auction_ends_at?: string // ISO8601
  labels: string[] // 상품 라벨 목록 (예: "신규상품", "베스트")
  bidders_count?: number
  is_liked?: boolean
}

// 상품 스펙 정보
export interface ProductSpecs {
  shipping_fee: number
  bidding_unit: number
  deposit_amount: number
  width_cm?: number
  height_cm?: number
  depth_cm?: number
}

// 상품 메타 정보 (상세 페이지용)
export interface ProductMeta {
  id: number
  name: string
  images: string[] // 이미지 URL 리스트
  tags: string[] // 태그 리스트
  title?: string
  description?: string
  category?: string
  store: StoreMeta
  specs: ProductSpecs
}

// 상세 페이지용 전체 정보 (legacy)
export interface ProductDetail {
  product_id: number
  popup_store_name: string
  product_name: string
  description: string
  current_highest_bid?: number
  buy_now_price?: number
  minimum_bid?: number
  bid_increment?: number
  images: string[]
  auction_starts_at: string
  auction_ends_at: string
  bidders_count: number
  is_liked: boolean
  is_user_highest_bidder?: boolean
  condition: string
  shipping_info: string
  return_policy: string
  seller_info: {
    name: string
    rating: number
    total_sales: number
  }
}

export interface StoreMeta {
  store_id: number
  name: string
  image_url?: string
  description?: string
  sales_description?: string
}

export interface StoreWithProducts {
  store: StoreMeta
  products: ProductListItem[]
}
