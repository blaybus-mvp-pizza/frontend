export type TProductStatus = "ALL" | "AVAILABLE" | "SOLD";

export interface ProductListParams {
  page: number;
  size: number;
  status?: TProductStatus;
  category?: string;
  q?: string;
  store_id?: string;
}

export interface ProductItem {
  id: number;
  name: string;
  representative_image: string;
  category: string;
  created_at: string;
  updated_at: string;
  status: TProductStatus;
  auction_id?: number;
  is_active: boolean;
  is_sold: boolean;
}

export interface ProductListResponse {
  items: ProductItem[];
  page: number;
  size: number;
  total: number;
}

export interface ProductSpecs {
  material: string;
  place_of_use: string;
  width_cm: number;
  height_cm: number;
  tolerance_cm: number;
  edition_info: string;
  condition_note: string;
}

export interface ProductRequest {
  id?: number;
  name: string;
  summary: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: string;
  tags: string[];
  specs: ProductSpecs;
  store_id: number;
  shipping_base_fee: number;
  shipping_free_threshold: number;
  shipping_extra_note: string;
  courier_name: string;
}

export interface ProductResponse {
  id: number;
  name: string;
  summary: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: string;
  tags: string[];
  specs: ProductSpecs;
  store_id: number;
  shipping_base_fee: number;
  shipping_free_threshold: number;
  shipping_extra_note: string;
  courier_name: string;
  created_at: string;
  updated_at: string;
}

export interface ProductDetailResponse extends ProductResponse {
  created_at: string;
  updated_at: string;
  auction_id?: number;
  status: string;
  store_description: string;
  store_sales_description: string;
  auction_start_price?: number;
  auction_buy_now_price?: number;
}
