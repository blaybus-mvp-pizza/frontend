// Product Related Types

export interface ProductListItem {
  product_id: number;
  popup_store_name: string;
  product_name: string;
  current_highest_bid?: number;
  buy_now_price?: number;
  representative_image?: string;
  auction_ends_at?: string; // ISO8601
  bidders_count?: number;
  is_liked?: boolean;
}

export interface ProductDetail {
  product_id: number;
  popup_store_name: string;
  product_name: string;
  description: string;
  current_highest_bid?: number;
  buy_now_price?: number;
  minimum_bid?: number;
  bid_increment?: number;
  images: string[];
  auction_starts_at: string;
  auction_ends_at: string;
  bidders_count: number;
  is_liked: boolean;
  is_user_highest_bidder?: boolean;
  condition: string;
  shipping_info: string;
  return_policy: string;
  seller_info: {
    name: string;
    rating: number;
    total_sales: number;
  };
}

export interface StoreMeta {
  store_id: number;
  name: string;
  image_url?: string;
  description?: string;
  sales_description?: string;
}

export interface StoreWithProducts {
  store: StoreMeta;
  products: ProductListItem[];
}