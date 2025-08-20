// API Response Types

export interface ProductListItem {
  product_id: number;
  popup_store_name: string;
  product_name: string;
  current_highest_bid: number;
  buy_now_price: number;
  representative_image: string | null;
  auction_ends_at: string;
}

export interface ProductListResponse {
  items: ProductListItem[];
  page: number;
  size: number;
  total: number;
}

// Map API response to our Product type
export function mapApiProductToProduct(apiProduct: ProductListItem): any {
  return {
    id: apiProduct.product_id,
    name: apiProduct.product_name,
    price: apiProduct.current_highest_bid || apiProduct.buy_now_price || 0,
    images: apiProduct.representative_image 
      ? [{ id: 1, productId: apiProduct.product_id, imageUrl: apiProduct.representative_image, sortOrder: 0 }]
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
    category: "",
    summary: "",
    description: "",
    stock: 0,
    shippingBaseFee: 0,
    shippingFreeThreshold: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [],
  };
}