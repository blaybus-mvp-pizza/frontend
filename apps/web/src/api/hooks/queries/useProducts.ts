import { useQuery, useInfiniteQuery, UseQueryOptions, UseInfiniteQueryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { productsApi } from '@/api/endpoints/products.api';
import { ProductFilters, Page, ProductListItem, ProductDetail, StoreWithProducts, StoreMeta } from '@/api/types';

// Get products ending soon
export const useProductsEndingSoon = (
  filters?: ProductFilters,
  options?: UseQueryOptions<Page<ProductListItem>>
) => {
  return useQuery({
    queryKey: queryKeys.products.endingSoon(filters),
    queryFn: () => productsApi.getEndingSoon(filters),
    staleTime: 30000, // 30 seconds
    ...options,
  });
};

// Get recommended products
export const useProductsRecommended = (
  filters?: ProductFilters,
  options?: UseQueryOptions<Page<ProductListItem>>
) => {
  return useQuery({
    queryKey: queryKeys.products.recommended(filters),
    queryFn: () => productsApi.getRecommended(filters),
    staleTime: 60000, // 1 minute
    ...options,
  });
};

// Get new products
export const useProductsNew = (
  filters?: ProductFilters,
  options?: UseQueryOptions<Page<ProductListItem>>
) => {
  return useQuery({
    queryKey: queryKeys.products.new(filters),
    queryFn: () => productsApi.getNew(filters),
    staleTime: 60000, // 1 minute
    ...options,
  });
};

// Infinite scroll for products
export const useInfiniteProducts = (
  filters?: ProductFilters,
  options?: UseInfiniteQueryOptions<Page<ProductListItem>>
) => {
  return useInfiniteQuery({
    queryKey: queryKeys.products.list(filters || {}),
    queryFn: ({ pageParam = 1 }) => 
      productsApi.getProducts({ ...filters, page: pageParam as number }),
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages.length + 1;
      return lastPage.total > nextPage * (filters?.size || 20) ? nextPage : undefined;
    },
    staleTime: 30000,
    initialPageParam: 1,
    ...options,
  });
};

// Get product detail
export const useProductDetail = (
  productId: number,
  options?: UseQueryOptions<ProductDetail>
) => {
  return useQuery({
    queryKey: queryKeys.products.detail(productId),
    queryFn: () => productsApi.getProductDetail(productId),
    staleTime: 60000, // 1 minute
    enabled: !!productId,
    ...options,
  });
};

// Get recent stores
export const useRecentStores = (
  options?: UseQueryOptions<Page<StoreWithProducts>>
) => {
  return useQuery({
    queryKey: queryKeys.products.stores.recent(),
    queryFn: () => productsApi.getRecentStores(),
    staleTime: 120000, // 2 minutes
    ...options,
  });
};

// Get all stores
export const useStores = (
  filters?: { page?: number; size?: number },
  options?: UseQueryOptions<Page<StoreMeta>>
) => {
  return useQuery({
    queryKey: queryKeys.products.stores.list(filters),
    queryFn: () => productsApi.getStores(filters),
    staleTime: 120000, // 2 minutes
    ...options,
  });
};