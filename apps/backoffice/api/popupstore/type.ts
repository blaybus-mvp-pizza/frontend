export interface PopupStore {
  id?: number;
  name: string;
  image_url: string;
  description: string;
  sales_description: string;
  starts_at: string;
  ends_at: string;
}

export interface PopupStoreListParams {
  page: number;
  size: number;
}

export interface PopupStoreItem {
  store_id: number;
  image_url: string;
  name: string;
  description: string;
  sales_description: string;
}

export interface PopupStoreListResponse {
  items: PopupStoreItem[];
  page: number;
  size: number;
  total: number;
}