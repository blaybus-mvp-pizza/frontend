// Content type definitions
export type ContentType = 'popular' | 'new' | 'upcoming' | 'ending-soon'

// Content titles for different product sections
export const CONTENT_TITLES: Record<ContentType, { title: string; subtitle: string }> = {
  popular: {
    title: '인기상품',
    subtitle: '지금 가장 뜨거운 경매를 한눈에 확인하세요',
  },
  new: {
    title: '신규상품',
    subtitle: '방금 시작한 경매, 시작가 근처에서 선점해보세요',
  },
  upcoming: {
    title: '오픈예정',
    subtitle: '시작 시간을 확인하고 알림을 받아보세요',
  },
  'ending-soon': {
    title: '마감임박',
    subtitle: '경매가 곧 종료됩니다. 마지막 입찰 기회를 확인하세요',
  },
}

// Sort options for product listing
export const SORT_OPTIONS = [
  { value: 'recommended', label: '추천순' },
  { value: 'latest', label: '등록순' },
  { value: 'popular', label: '인기순' },
]

export type SortOption = 'recommended' | 'latest' | 'popular'

// Status filter options (matching API enum values)
export const STATUS_OPTIONS = [
  { value: 'ALL', label: '상태' },
  { value: 'RUNNING', label: '진행중' },
  { value: 'ENDED', label: '종료' },
  { value: 'SCHEDULED', label: '예정' },
]

export type StatusOption = 'ALL' | 'RUNNING' | 'ENDED' | 'SCHEDULED'

// Bidder count filter options (matching API enum values)
export const BIDDER_OPTIONS = [
  { value: 'ALL', label: '입찰인원' },
  { value: 'LE_10', label: '10명 이하' },
  { value: 'BT_10_20', label: '11-20명' },
  { value: 'GE_20', label: '20명 이상' },
]

export type BidderOption = 'ALL' | 'LE_10' | 'BT_10_20' | 'GE_20'

// Price range filter options (matching API enum values)
export const PRICE_OPTIONS = [
  { value: 'ALL', label: '가격' },
  { value: 'LT_10000', label: '1만원 미만' },
  { value: 'BT_10000_30000', label: '1-3만원' },
  { value: 'BT_30000_50000', label: '3-5만원' },
  { value: 'BT_50000_150000', label: '5-15만원' },
  { value: 'BT_150000_300000', label: '15-30만원' },
  { value: 'BT_300000_500000', label: '30-50만원' },
  { value: 'CUSTOM', label: '직접입력' },
]

export type PriceOption = 'ALL' | 'LT_10000' | 'BT_10000_30000' | 'BT_30000_50000' | 'BT_50000_150000' | 'BT_150000_300000' | 'BT_300000_500000' | 'CUSTOM'

// Pagination settings
export const ITEMS_PER_PAGE = 16 // 4x4 grid

// Default values
export const DEFAULT_FILTERS = {
  content: 'popular' as ContentType,
  filter: '전체',
  sort: 'recommended' as SortOption,
  status: 'ALL' as any,
  bidders: 'ALL' as any,
  price: 'ALL' as any,
  page: 1,
}
