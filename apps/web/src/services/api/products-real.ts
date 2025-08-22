import { Auction, Product } from '@workspace/ui/types'

import { apiClient } from '@/api/client/apiClient'
import {
  ProductFilters as ApiProductFilters,
  AuctionStatus,
  BiddersFilter,
  Page,
  PriceBucket,
  ProductListItem,
  SortOption,
  StoreWithProducts,
} from '@/api/types'

// Interface for paginated response
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

// Interface for product filters (matching the mock)
export interface ProductFilters {
  content?: string
  category?: string
  status?: string
  bidders?: string
  price?: string
  sort?: string
  search?: string
  page?: number
  pageSize?: number
}

const convertToApiFilters = (filters: ProductFilters): ApiProductFilters => {
  const apiFilters: ApiProductFilters = {
    page: filters.page || 1,
    size: filters.pageSize || 16,
  }

  // Add category filter
  if (filters.category && filters.category !== '전체') {
    apiFilters.category = filters.category
  }

  // Add search query
  if (filters.search) {
    apiFilters.query = filters.search
  }

  // Convert sort option
  if (filters.sort) {
    switch (filters.sort) {
      case 'recommended':
        apiFilters.sort = SortOption.RECOMMENDED
        break
      case 'latest':
        apiFilters.sort = SortOption.LATEST
        break
      case 'popular':
        apiFilters.sort = SortOption.POPULAR
        break
      case 'ending-soon':
        apiFilters.sort = SortOption.ENDING
        break
    }
  }

  // Convert status
  if (filters.status) {
    switch (filters.status) {
      case 'ongoing':
      case 'running':
        apiFilters.status = AuctionStatus.RUNNING
        break
      case 'completed':
      case 'ended':
        apiFilters.status = AuctionStatus.ENDED
        break
    }
  }

  // Convert bidders filter
  if (filters.bidders) {
    switch (filters.bidders) {
      case '0-10':
        apiFilters.bidders = BiddersFilter.LE_10
        break
      case '11-50':
        apiFilters.bidders = BiddersFilter.BT_10_20
        break
      case '51-100':
      case '100+':
        apiFilters.bidders = BiddersFilter.GE_20
        break
    }
  }

  // Convert price filter
  if (filters.price) {
    switch (filters.price) {
      case '0-100000':
        apiFilters.price_bucket = PriceBucket.LT_10000
        break
      case '100000-500000':
        apiFilters.price_bucket = PriceBucket.BT_30000_50000
        break
      case '500000-1000000':
        apiFilters.price_bucket = PriceBucket.BT_300000_500000
        break
      case '1000000+':
        apiFilters.price_bucket = PriceBucket.BT_300000_500000
        break
    }
  }

  return apiFilters
}

// Convert API response to frontend Product type
const convertApiProductToProduct = (apiProduct: ProductListItem, index: number = 0): Product => {
  return {
    id: apiProduct.product_id,
    name: apiProduct.product_name,
    images: apiProduct.representative_image
      ? [
          {
            id: apiProduct.product_id,
            productId: apiProduct.product_id,
            imageUrl: apiProduct.representative_image,
            sortOrder: 0,
          },
        ]
      : [],
    tags: [],
    labels: apiProduct.labels || [],
    description: `${apiProduct.product_name} - ${apiProduct.popup_store_name}`,
    category: apiProduct.category || '아트/컬렉터블',
    popupStore: {
      id: 1,
      name: apiProduct.popup_store_name,
      createdAt: new Date(),
    },
    currentHighestBid: apiProduct.current_highest_bid,
    buyNowPrice: apiProduct.buy_now_price,
    auctionEndsAt: apiProduct.auction_ends_at,
    // Legacy fields for compatibility
    price: apiProduct.buy_now_price || apiProduct.current_highest_bid || 0,
    popupStoreId: 1,
    popupStoreName: apiProduct.popup_store_name,
    representativeImage: apiProduct.representative_image,
    stock: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
    shippingBaseFee: 3000,
  }
}

// Convert API product to Auction type
const convertApiProductToAuction = (
  apiProduct: ProductListItem,
  index: number = 0,
): Auction | undefined => {
  if (!apiProduct.auction_ends_at) return undefined

  return {
    id: apiProduct.product_id,
    productId: apiProduct.product_id,
    startPrice: apiProduct.current_highest_bid || 0,
    minBidPrice: 1000, // Default min bid
    buyNowPrice: apiProduct.buy_now_price || 0,
    depositAmount: 0,
    startsAt: new Date(),
    endsAt: new Date(apiProduct.auction_ends_at),
    status: new Date(apiProduct.auction_ends_at) > new Date() ? 'running' : 'ended',
    createdAt: new Date(),
    updatedAt: new Date(),
    currentBid: apiProduct.current_highest_bid
      ? {
          id: 1,
          auctionId: apiProduct.product_id,
          userId: 1,
          bidOrder: 1,
          amount: apiProduct.current_highest_bid,
          createdAt: new Date(),
        }
      : undefined,
    bidCount: apiProduct.bidders_count || 0,
  }
}

// API service functions
export const productApiReal = {
  // Get paginated products with filters
  async getProductsWithPagination(
    filters: ProductFilters = {},
  ): Promise<PaginatedResponse<Product>> {
    const apiFilters = convertToApiFilters(filters)

    // Determine which endpoint to use based on content filter
    let endpoint = '/products/recommended'
    if (filters.content === 'ending-soon') {
      endpoint = '/products/ending-soon'
    } else if (filters.content === 'new') {
      endpoint = '/products/new'
    } else if (filters.content === 'upcoming') {
      endpoint = '/products/upcoming'
    } else if (filters.content === 'popular') {
      endpoint = '/products/recommended' // popular uses recommended with sort
    }

    const response = await apiClient.get<Page<ProductListItem>>(endpoint, {
      params: apiFilters,
    })

    const products = response.data.items.map((item, index) =>
      convertApiProductToProduct(item, index),
    )

    return {
      data: products,
      pagination: {
        page: response.data.page,
        pageSize: response.data.size,
        total: response.data.total,
        totalPages: Math.ceil(response.data.total / response.data.size),
      },
    }
  },

  // Get auctions for specific products
  async getAuctionsForProducts(productIds: number[]): Promise<Auction[]> {
    // For now, we'll create auctions from the product data
    // In a real implementation, there would be a separate endpoint
    const auctions: Auction[] = []

    for (const productId of productIds) {
      try {
        // We could fetch individual product details here if needed
        // For now, we'll create a placeholder auction
        auctions.push({
          id: productId,
          productId: productId,
          startPrice: 0,
          minBidPrice: 1000,
          buyNowPrice: 0,
          depositAmount: 0,
          startsAt: new Date(),
          endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          status: 'running',
          createdAt: new Date(),
          updatedAt: new Date(),
          bidCount: 0,
        })
      } catch (error) {
        console.error(`Failed to fetch auction for product ${productId}:`, error)
      }
    }

    return auctions
  },

  // Legacy methods for compatibility
  async getProducts(filters?: { category?: string; popupStoreId?: number }): Promise<Product[]> {
    const response = await apiClient.get<Page<ProductListItem>>('/products/recommended', {
      params: {
        page: 1,
        size: 100,
      },
    })

    return response.data.items.map((item, index) => convertApiProductToProduct(item, index))
  },

  async getAuctions(): Promise<Auction[]> {
    // Fetch products and convert to auctions
    const response = await apiClient.get<Page<ProductListItem>>('/products/ending-soon', {
      params: {
        page: 1,
        size: 100,
      },
    })

    return response.data.items
      .map((item, index) => convertApiProductToAuction(item, index))
      .filter((auction): auction is Auction => auction !== undefined)
  },

  async getPopupStoreProducts(popupStoreId: number): Promise<{
    products: Product[]
    auctions: Auction[]
  }> {
    // Use recent stores endpoint
    const response = await apiClient.get<Page<StoreWithProducts>>('/products/stores/recent')

    // Find the specific store or use the first one
    const storeData = response.data.items[0]

    if (!storeData) {
      return { products: [], auctions: [] }
    }

    const products = storeData.products.map((item, index) =>
      convertApiProductToProduct(item, index),
    )

    const auctions = storeData.products
      .map((item, index) => convertApiProductToAuction(item, index))
      .filter((auction): auction is Auction => auction !== undefined)

    return { products, auctions }
  },

  async getFeaturedProducts(): Promise<{
    urgentProducts: Product[]
    mdPicks: Product[]
    newProducts: Product[]
    auctions: Auction[]
  }> {
    try {
      // Fetch different product categories in parallel
      const [endingSoonRes, recommendedRes, newRes] = await Promise.all([
        apiClient.get<Page<ProductListItem>>('/products/ending-soon', {
          params: { page: 1, size: 4 },
        }),
        apiClient.get<Page<ProductListItem>>('/products/recommended', {
          params: { page: 1, size: 4 },
        }),
        apiClient.get<Page<ProductListItem>>('/products/new', {
          params: { page: 1, size: 4 },
        }),
      ])

      const urgentProducts = endingSoonRes.data.items.map((item, index) =>
        convertApiProductToProduct(item, index),
      )

      const mdPicks = recommendedRes.data.items.map((item, index) =>
        convertApiProductToProduct(item, index),
      )

      const newProducts = newRes.data.items.map((item, index) =>
        convertApiProductToProduct(item, index),
      )

      // Create auctions from all products
      const allApiProducts = [
        ...endingSoonRes.data.items,
        ...recommendedRes.data.items,
        ...newRes.data.items,
      ]

      const auctions = allApiProducts
        .map((item, index) => convertApiProductToAuction(item, index))
        .filter((auction): auction is Auction => auction !== undefined)

      return {
        urgentProducts,
        mdPicks,
        newProducts,
        auctions,
      }
    } catch (error) {
      console.error('Failed to fetch featured products:', error)
      // Return empty arrays on error
      return {
        urgentProducts: [],
        mdPicks: [],
        newProducts: [],
        auctions: [],
      }
    }
  },

  async getProductById(id: number): Promise<Product | null> {
    try {
      // This would need a proper product detail endpoint
      // For now, we'll fetch from recommended and find the product
      const response = await apiClient.get<Page<ProductListItem>>('/products/recommended', {
        params: { page: 1, size: 100 },
      })

      const apiProduct = response.data.items.find((item) => item.product_id === id)

      if (!apiProduct) return null

      return convertApiProductToProduct(apiProduct)
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error)
      return null
    }
  },

  async getAuctionByProductId(productId: number): Promise<Auction | null> {
    try {
      // This would need a proper auction detail endpoint
      // For now, we'll create a placeholder
      const response = await apiClient.get<Page<ProductListItem>>('/products/ending-soon', {
        params: { page: 1, size: 100 },
      })

      const apiProduct = response.data.items.find((item) => item.product_id === productId)

      if (!apiProduct) return null

      return convertApiProductToAuction(apiProduct) || null
    } catch (error) {
      console.error(`Failed to fetch auction for product ${productId}:`, error)
      return null
    }
  },
}

// Export with both names for compatibility
export const productApi = productApiReal
