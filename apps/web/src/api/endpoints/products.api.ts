import { apiClient } from '../client/apiClient'
import {
  Page,
  ProductDetail,
  ProductFilters,
  ProductListItem,
  StoreFilters,
  StoreMeta,
  StoreWithProducts,
} from '../types'

export const productsApi = {
  // Get products ending soon
  getEndingSoon: async (filters?: ProductFilters): Promise<Page<ProductListItem>> => {
    const response = await apiClient.get('/products/ending-soon', {
      params: filters,
    })
    return response.data
  },

  // Get recommended products
  getRecommended: async (filters?: ProductFilters): Promise<Page<ProductListItem>> => {
    const response = await apiClient.get('/products/recommended', {
      params: filters,
    })
    return response.data
  },

  // Search products
  searchProducts: async (query: string, filters?: Omit<ProductFilters, 'query'>): Promise<Page<ProductListItem>> => {
    const response = await apiClient.get('/products/recommended', {
      params: {
        q: query,
        ...filters,
      },
    })
    return response.data
  },

  // Get new products
  getNew: async (filters?: ProductFilters): Promise<Page<ProductListItem>> => {
    const response = await apiClient.get('/products/new', {
      params: filters,
    })
    return response.data
  },

  // Get all products with filters
  getProducts: async (filters?: ProductFilters): Promise<Page<ProductListItem>> => {
    // Determine endpoint based on sort option
    const endpoint =
      filters?.sort === 'ending'
        ? '/products/ending-soon'
        : filters?.sort === 'latest'
          ? '/products/new'
          : '/products/recommended'

    const response = await apiClient.get(endpoint, {
      params: filters,
    })
    return response.data
  },

  // Get product detail
  getProductDetail: async (productId: number): Promise<ProductDetail> => {
    const response = await apiClient.get(`/catalog/products/${productId}`)
    return response.data
  },

  // Get recent stores with products
  getRecentStores: async (filters: any): Promise<Page<StoreWithProducts>> => {
    const response = await apiClient.get('/products/stores/recent', {
      params: filters,
    })
    return response.data
  },

  // Get all stores
  getStores: async (filters?: StoreFilters): Promise<Page<StoreMeta>> => {
    const response = await apiClient.get('/products/stores', {
      params: filters,
    })
    return response.data
  },

  // Like/Unlike product
  toggleLike: async (productId: number): Promise<{ liked: boolean }> => {
    const response = await apiClient.post(`/products/${productId}/like`)
    return response.data
  },

  // Get upcoming products (scheduled auctions)
  getUpcoming: async (filters?: ProductFilters): Promise<Page<ProductListItem>> => {
    const response = await apiClient.get('/products/upcoming', {
      params: filters,
    })
    return response.data
  },

  // Get popular auction products
  getPopularAuctions: async (filters?: ProductFilters): Promise<Page<ProductListItem>> => {
    const response = await apiClient.get('/products/recommended', {
      params: { ...filters, page: filters?.page || 2 },
    })
    return response.data
  },
}
