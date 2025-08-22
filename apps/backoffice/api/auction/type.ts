export type TAuctionStatus =
  | "ALL"
  | "SCHEDULED"
  | "RUNNING"
  | "ENDED"
  | "CANCELLED"
  | "PAUSED";
export type TAuctionResultStatus = "WON" | "LOST" | "ALL";
export type TPaymentStatus = "대기" | "확인" | "취소";
export type TShipmentStatus = "대기" | "처리" | "조회" | "완료";
export type TSort = "recommended" | "popular" | "latest" | "ending";

export const AUCTION_STATUS_MAP = {
  ALL: "전체",
  SCHEDULED: "경매 예정",
  RUNNING: "경매 진행 중",
  ENDED: "경매 종료",
  CANCELLED: "경매 취소",
  PAUSED: "경매 중지",
};

export const AUCTION_RESULT_MAP = {
  ALL: "전체",
  WON: "낙찰",
  LOST: "유찰",
};

export const SORT_MAP = {
  recommended: "추천 순",
  popular: "인기 순",
  latest: "최신 순",
  ending: "마감 임박 순",
};

export interface AuctionListParams {
  authorization: string;
  page: number;
  size: number;
  q?: string;
  product_id?: number;
  store_name?: string;
  status?: TAuctionStatus;
  result?: TAuctionResultStatus;
  payment_status?: TPaymentStatus;
  shipment_status?: TShipmentStatus;
  starts_from?: string;
  starts_to?: string;
  ends_from?: string;
  ends_to?: string;
  sort?: TSort;
}

export interface AuctionItem {
  auction_id: number;
  product_id: number;
  product_name: string;
  start_price: number;
  buy_now_price: number;
  starts_at: string;
  ends_at: string;
  status: string;
  payment_status: string;
  shipment_status: string;
  is_won: boolean;
}

export interface AuctionListResponse {
  items: AuctionItem[];
  page: number;
  size: number;
  total: number;
}

export interface AuctionFormRequest {
  id?: number;
  product_id: number;
  start_price: number;
  min_bid_price: number;
  buy_now_price: number;
  deposit_amount: number;
  starts_at: string;
  ends_at: string;
  status?: TAuctionStatus;
}

export interface AuctionResponse {
  auction_id: number;
  product_id: number;
  product_name: string;
  store_name: string;
  representative_image: string;
  start_price: number;
  min_bid_price: number;
  buy_now_price: number;
  deposit_amount: number;
  starts_at: string;
  ends_at: string;
  status: string;
  current_highest_bid: number;
  bidder_count: number;
  payment_status: string;
  shipment_status: string;
  is_won: boolean;
}

export interface AuctionParams {
  authorization: string;
  auction_id?: number;
}

export interface AuctionStatusRequest {
  status: string;
}

export interface ShippingStatusResponse {
  shipment_status: string;
  courier_name: string;
  tracking_number: string;
  shipped_at: string;
  delivered_at: string;
}

export interface AuctionFinalizeResponse {
  status: string;
  payment_id: number;
}
