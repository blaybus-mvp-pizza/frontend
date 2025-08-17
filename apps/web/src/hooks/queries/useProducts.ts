import { useQuery } from "@tanstack/react-query";
import { productApi, ProductFilters, PaginatedResponse } from "@/services/api/products";
import { Product, Auction } from "@workspace/ui/types";

// Query keys factory for better organization
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters?: { category?: string; popupStoreId?: number }) =>
    [...productKeys.lists(), filters] as const,
  paginated: (filters?: ProductFilters) => [...productKeys.all, "paginated", filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  auctions: () => ["auctions"] as const,
  auctionsForProducts: (productIds: number[]) => ["auctions", "products", productIds] as const,
  auction: (productId: number) => [...productKeys.auctions(), productId] as const,
  featured: () => ["featured-products"] as const,
  popupStore: (id: number) => ["popup-store", id] as const,
};

// Hook to get paginated products with filters
export function useProductsWithPagination(filters: ProductFilters) {
  return useQuery<PaginatedResponse<Product>>({
    queryKey: productKeys.paginated(filters),
    queryFn: () => productApi.getProductsWithPagination(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });
}

// Hook to get auctions for specific products
export function useAuctionsForProducts(productIds: number[]) {
  return useQuery<Auction[]>({
    queryKey: productKeys.auctionsForProducts(productIds),
    queryFn: () => productApi.getAuctionsForProducts(productIds),
    staleTime: 1000 * 60 * 1, // 1 minute (auctions change frequently)
    gcTime: 1000 * 60 * 3, // 3 minutes
    enabled: productIds.length > 0,
  });
}

// Hook to fetch all products with optional filters (legacy)
export function useProducts(filters?: {
  category?: string;
  popupStoreId?: number;
}) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productApi.getProducts(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
  });
}

// Hook to fetch all auctions
export function useAuctions() {
  return useQuery({
    queryKey: productKeys.auctions(),
    queryFn: () => productApi.getAuctions(),
    staleTime: 1000 * 60 * 2, // 2 minutes (auctions change more frequently)
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to fetch featured products (homepage sections)
export function useFeaturedProducts() {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: () => productApi.getFeaturedProducts(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Hook to fetch products and auctions for a specific popup store
export function usePopupStoreProducts(popupStoreId: number) {
  return useQuery({
    queryKey: productKeys.popupStore(popupStoreId),
    queryFn: () => productApi.getPopupStoreProducts(popupStoreId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    enabled: popupStoreId > 0, // Only fetch if valid ID
  });
}

// Hook to fetch a single product
export function useProduct(id: number) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productApi.getProductById(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    enabled: id > 0, // Only fetch if valid ID
  });
}

// Hook to fetch auction by product ID
export function useAuctionByProduct(productId: number) {
  return useQuery({
    queryKey: productKeys.auction(productId),
    queryFn: () => productApi.getAuctionByProductId(productId),
    staleTime: 1000 * 60 * 1, // 1 minute (auction data changes frequently)
    gcTime: 1000 * 60 * 5, // 5 minutes
    enabled: productId > 0, // Only fetch if valid ID
  });
}

// Prefetch functions for optimization
export const productPrefetch = {
  async prefetchProducts(queryClient: any, filters?: {
    category?: string;
    popupStoreId?: number;
  }) {
    await queryClient.prefetchQuery({
      queryKey: productKeys.list(filters),
      queryFn: () => productApi.getProducts(filters),
      staleTime: 1000 * 60 * 5,
    });
  },

  async prefetchPaginated(queryClient: any, filters: ProductFilters) {
    await queryClient.prefetchQuery({
      queryKey: productKeys.paginated(filters),
      queryFn: () => productApi.getProductsWithPagination(filters),
      staleTime: 1000 * 60 * 2,
    });
  },

  async prefetchFeatured(queryClient: any) {
    await queryClient.prefetchQuery({
      queryKey: productKeys.featured(),
      queryFn: () => productApi.getFeaturedProducts(),
      staleTime: 1000 * 60 * 5,
    });
  },

  async prefetchPopupStore(queryClient: any, popupStoreId: number) {
    await queryClient.prefetchQuery({
      queryKey: productKeys.popupStore(popupStoreId),
      queryFn: () => productApi.getPopupStoreProducts(popupStoreId),
      staleTime: 1000 * 60 * 5,
    });
  },
};