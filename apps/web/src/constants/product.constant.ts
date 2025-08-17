// Content type definitions
export type ContentType = "popular" | "new" | "upcoming" | "ending-soon";

// Content titles for different product sections
export const CONTENT_TITLES: Record<
  ContentType,
  { title: string; subtitle: string }
> = {
  popular: {
    title: "인기상품",
    subtitle: "지금 가장 뜨거운 경매를 한눈에 확인하세요",
  },
  new: {
    title: "신규상품",
    subtitle: "방금 시작한 경매, 시작가 근처에서 선점해보세요",
  },
  upcoming: {
    title: "오픈예정",
    subtitle: "시작 시간을 확인하고 알림을 받아보세요",
  },
  "ending-soon": {
    title: "마감임박",
    subtitle: "경매가 곧 종료됩니다. 마지막 입찰 기회를 확인하세요",
  },
};

// Sort options for product listing
export const SORT_OPTIONS = [
  { value: "recommended", label: "추천순" },
  { value: "latest", label: "등록순" },
  { value: "popular", label: "인기순" },
];

export type SortOption = "recommended" | "latest" | "popular";

// Status filter options
export const STATUS_OPTIONS = [
  { value: "all", label: "상태" },
  { value: "ongoing", label: "진행중" },
  { value: "completed", label: "종료" },
  { value: "upcoming", label: "예정" },
];

export type StatusOption = "all" | "ongoing" | "completed" | "upcoming";

// Bidder count filter options
export const BIDDER_OPTIONS = [
  { value: "all", label: "입찰인원" },
  { value: "0-10", label: "10명 이하" },
  { value: "11-50", label: "11-50명" },
  { value: "51-100", label: "51-100명" },
  { value: "100+", label: "100명 이상" },
];

export type BidderOption = "all" | "0-10" | "11-50" | "51-100" | "100+";

// Price range filter options
export const PRICE_OPTIONS = [
  { value: "all", label: "가격" },
  { value: "0-100000", label: "10만원 이하" },
  { value: "100000-500000", label: "10-50만원" },
  { value: "500000-1000000", label: "50-100만원" },
  { value: "1000000+", label: "100만원 이상" },
];

export type PriceOption = "all" | "0-100000" | "100000-500000" | "500000-1000000" | "1000000+";

// Pagination settings
export const ITEMS_PER_PAGE = 16; // 4x4 grid

// Default values
export const DEFAULT_FILTERS = {
  content: "popular" as ContentType,
  filter: "전체",
  sort: "recommended" as SortOption,
  status: "all" as StatusOption,
  bidders: "all" as BidderOption,
  price: "all" as PriceOption,
  page: 1,
};
