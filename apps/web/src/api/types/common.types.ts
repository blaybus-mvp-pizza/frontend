// Common API Types

export interface Page<T> {
  items: T[]
  page: number
  size: number
  total: number
}

export interface ErrorResponse {
  code: string
  message: string
  details?: any
}

export interface SuccessResponse<T = any> {
  success: boolean
  data?: T
  message?: string
}

// Enums
export enum AuctionStatus {
  ALL = 'ALL',
  RUNNING = 'RUNNING',
  ENDED = 'ENDED',
}

export enum BiddersFilter {
  ALL = 'ALL',
  LE_10 = 'LE_10',
  BT_10_20 = 'BT_10_20',
  GE_20 = 'GE_20',
}

export enum PriceBucket {
  ALL = 'ALL',
  LT_10000 = 'LT_10000',
  BT_10000_30000 = 'BT_10000_30000',
  BT_30000_50000 = 'BT_30000_50000',
  BT_50000_150000 = 'BT_50000_150000',
  BT_150000_300000 = 'BT_150000_300000',
  BT_300000_500000 = 'BT_300000_500000',
  CUSTOM = 'CUSTOM',
}

export enum SortOption {
  RECOMMENDED = 'recommended',
  POPULAR = 'popular',
  LATEST = 'latest',
  ENDING = 'ending',
}

// Query Parameters
export interface ProductFilters {
  page?: number
  size?: number
  sort?: SortOption
  status?: AuctionStatus
  bidders?: BiddersFilter
  price_bucket?: PriceBucket
  price_min?: number
  price_max?: number
  category?: string
  query?: string
}

export interface StoreFilters {
  page?: number
  size?: number
}
