// apps/web/src/components/popup-stores/popup-store-content.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { ProductCard } from '@workspace/ui/components/product-card'
import { Typography } from '@workspace/ui/components/typography'
import { Auction, Product } from '@workspace/ui/types'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { StoreWithProducts } from '@/api/types/product.types'
import { productsService } from '@/services/api/products-real'

// apps/web/src/components/popup-stores/popup-store-content.tsx

// apps/web/src/components/popup-stores/popup-store-content.tsx

// apps/web/src/components/popup-stores/popup-store-content.tsx

export default function PopupStoreContent() {
  const router = useRouter()
  const [currentStoreIndex, setCurrentStoreIndex] = useState(0)
  const [stores, setStores] = useState<StoreWithProducts[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true)
        const response = await productsService.getRecentStores({
          page: 1,
          stores: 8,
          size: 4,
        })
        setStores(response.items)
      } catch (err) {
        console.error('Failed to fetch popup stores:', err)
        setError('Failed to load popup stores')
      } finally {
        setLoading(false)
      }
    }

    fetchStores()
  }, [])

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`)
  }

  const handleStoreClick = (index: number) => {
    setCurrentStoreIndex(index)
  }

  const handleCarouselPrev = () => {
    if (carouselIndex > 0) {
      setCarouselIndex(carouselIndex - 1)
    }
  }

  const handleCarouselNext = () => {
    const maxIndex = Math.ceil(stores.length / 3) - 1
    if (carouselIndex < maxIndex) {
      setCarouselIndex(carouselIndex + 1)
    }
  }

  // Convert API product to Product type for ProductCard
  const convertToProduct = (apiProduct: any): Product => {
    return {
      id: apiProduct.product_id,
      name: apiProduct.product_name,
      popupStoreName: apiProduct.popup_store_name,
      price: apiProduct.buy_now_price || 0,
      images: apiProduct.representative_image
        ? [{ imageUrl: apiProduct.representative_image }]
        : [],
      labels: apiProduct.labels || [],
      representativeImage: apiProduct.representative_image,
    } as Product
  }

  // Convert API auction data to Auction type for ProductCard
  const convertToAuction = (apiProduct: any): Auction | undefined => {
    if (!apiProduct.auction_ends_at) return undefined

    return {
      id: apiProduct.product_id,
      productId: apiProduct.product_id,
      startPrice: 0,
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
      buyNowPrice: apiProduct.buy_now_price || 0,
      endsAt: new Date(apiProduct.auction_ends_at),
      status: 'running',
    } as Auction
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4">Loading...</div>
        </div>
      </div>
    )
  }

  if (error || stores.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Typography variant="h4" className="mb-2">
            {error || 'No popup stores available'}
          </Typography>
        </div>
      </div>
    )
  }

  const currentStore = stores[currentStoreIndex]

  if (!currentStore) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Typography variant="h4" className="mb-2">
            No store selected
          </Typography>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Banner Carousel Section */}
      <div className="relative w-full overflow-hidden bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4">
          {/* Carousel Navigation */}
          <div className="mb-4 flex items-center justify-between">
            <Typography variant="h4" weight="bold">
              팝업스토어
            </Typography>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCarouselPrev}
                disabled={carouselIndex === 0}
                className="rounded-full bg-white p-2 shadow-md transition-opacity disabled:opacity-50"
              >
                <ChevronLeft size={20} />
              </button>
              <Typography variant="caption" className="px-2">
                {carouselIndex + 1} / {Math.ceil(stores.length / 3)}
              </Typography>
              <button
                onClick={handleCarouselNext}
                disabled={carouselIndex >= Math.ceil(stores.length / 3) - 1}
                className="rounded-full bg-white p-2 shadow-md transition-opacity disabled:opacity-50"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Carousel Container */}
          <div className="overflow-hidden" ref={carouselRef}>
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
            >
              {Array.from({ length: Math.ceil(stores.length / 3) }).map((_, pageIndex) => (
                <div key={pageIndex} className="flex w-full flex-shrink-0 gap-4">
                  {stores.slice(pageIndex * 3, (pageIndex + 1) * 3).map((storeData, index) => {
                    const actualIndex = pageIndex * 3 + index
                    return (
                      <motion.div
                        key={storeData.store.store_id}
                        className={`relative flex-1 cursor-pointer overflow-hidden rounded-lg transition-all hover:shadow-lg ${
                          actualIndex === currentStoreIndex ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => handleStoreClick(actualIndex)}
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="aspect-[16/9] w-full">
                          {storeData.store.image_url ? (
                            <img
                              src={storeData.store.image_url}
                              alt={storeData.store.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-200">
                              <Typography variant="caption" className="text-gray-500">
                                No Image
                              </Typography>
                            </div>
                          )}

                          {/* Store info overlay */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
                            <Typography variant="h5" className="font-bold text-white">
                              {storeData.store.name}
                            </Typography>
                            {storeData.store.sales_description && (
                              <Typography variant="caption" className="line-clamp-2 text-white/90">
                                {storeData.store.sales_description}
                              </Typography>
                            )}
                            <div className="mt-2 flex items-center gap-2">
                              <span className="rounded bg-white/20 px-2 py-1 text-xs text-white">
                                {storeData.products.length}개 상품
                              </span>
                              {actualIndex === currentStoreIndex && (
                                <span className="rounded bg-blue-500 px-2 py-1 text-xs text-white">
                                  선택됨
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Store Title Section */}
      <div className="border-b bg-white px-4 py-8">
        <div className="mx-auto max-w-7xl text-center">
          <Typography variant="h2" weight="bold" className="mb-3">
            {currentStore.store.name}
          </Typography>
          <Typography variant="body1" className="text-text-secondary mx-auto max-w-2xl">
            {currentStore.store.description ||
              currentStore.store.sales_description ||
              '특별한 팝업스토어를 만나보세요.'}
          </Typography>
          {currentStore.products.length === 0 && (
            <div className="mt-4 inline-block rounded-lg bg-gray-100 px-4 py-2">
              <Typography variant="caption" className="text-gray-600">
                현재 판매 중인 상품이 없습니다
              </Typography>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          {currentStore.products.length > 0 ? (
            <>
              <Typography variant="h4" weight="bold" className="mb-6">
                판매 상품
              </Typography>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
                {currentStore.products.map((product) => (
                  <ProductCard
                    key={product.product_id}
                    product={convertToProduct(product)}
                    auction={convertToAuction(product)}
                    onClick={() => handleProductClick(product.product_id)}
                    showTimeLeft={true}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <Typography variant="h5" className="mb-2 text-gray-500">
                현재 판매 중인 상품이 없습니다
              </Typography>
              <Typography variant="body2" className="text-gray-400">
                곧 새로운 상품이 등록될 예정입니다
              </Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
