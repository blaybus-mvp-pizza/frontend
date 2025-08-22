// MyPage specific types

export interface UserAuctionDashboard {
  running_bid_count: number // 경매 진행 상품: 내가 입찰한 상품 개수
  pre_shipment_count: number // 입금 확인 중: 내가 낙찰되었고 배송 전 상태
  shipping_count: number // 배송 중: 내가 낙찰되었고 배송 진행 중
  delivered_count: number // 배송 완료: 내가 낙찰되었고 배송 완료
}

export enum MyAuctionItemStatus {
  RUNNING = '경매 진행중',
  WON_CONFIRMED = '낙찰 확정',
  AUCTION_ENDED = '경매 종료',
  PAUSED = '경매 일시중지',
  SHIPPING = '배송중',
  DELIVERED = '배송완료',
}

export interface UserRelatedAuctionItem {
  product_id: number
  auction_id: number
  image_url?: string
  product_name: string
  current_highest_bid?: number
  my_bid_amount?: number
  status: MyAuctionItemStatus
  my_last_bid_at: string // ISO date string
}