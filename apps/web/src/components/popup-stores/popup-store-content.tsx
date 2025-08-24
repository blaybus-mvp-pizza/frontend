'use client'

import { useEffect, useRef, useState } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { ProductCard } from '@workspace/ui/components/product-card'
import { Auction, Product } from '@workspace/ui/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { StoreWithProducts } from '@/api/types/product.types'
import { productsService } from '@/services/api/products-real'

export default function PopupStoreContent() {
  const router = useRouter()
  const [currentStoreIndex, setCurrentStoreIndex] = useState(0)
  const [stores, setStores] = useState<StoreWithProducts[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true)
        const response = await productsService.getRecentStores({
          page: 1,
          stores: 8,
          size: 16,
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
    if (currentStoreIndex > 0) {
      const newIndex = currentStoreIndex - 1
      setCurrentStoreIndex(newIndex)
      if (carouselRef.current) {
        // Scroll to show the selected store
        const scrollPosition = newIndex * 290
        carouselRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' })
      }
    }
  }

  const handleCarouselNext = () => {
    if (currentStoreIndex < stores.length - 1) {
      const newIndex = currentStoreIndex + 1
      setCurrentStoreIndex(newIndex)
      if (carouselRef.current) {
        // Scroll to show the selected store
        const scrollPosition = newIndex * 290
        carouselRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' })
      }
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
          <p className="mb-2 text-xl font-semibold tracking-tight md:text-2xl lg:text-3xl">
            {error || 'No popup stores available'}
          </p>
        </div>
      </div>
    )
  }

  const currentStore = stores[currentStoreIndex]

  if (!currentStore) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-2 text-xl font-semibold tracking-tight md:text-2xl lg:text-3xl">
            No store selected
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="relative mt-8 w-[100vw] overflow-hidden bg-[#F8F8FA] py-10">
        <div className="max-w-container mx-auto w-full space-y-6 px-4">
          <div className="flex w-full justify-between">
            <p className="text-2xl font-semibold md:text-2xl">팝업스토어</p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCarouselPrev}
                className="text-gray-600 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
                disabled={currentStoreIndex === 0}
              >
                <ChevronLeft size={20} />
              </button>
              <span className="min-w-[60px] text-center text-sm font-medium">
                {String(currentStoreIndex + 1).padStart(2, '0')} /{' '}
                {String(stores.length).padStart(2, '0')}
              </span>
              <button
                onClick={handleCarouselNext}
                className="text-gray-600 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
                disabled={currentStoreIndex === stores.length - 1}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <div className="overflow-hidden" ref={carouselRef}>
            <div className="flex gap-x-5">
              {stores.map((store, index) => (
                <div
                  key={store.store.store_id}
                  className={`relative h-[166px] w-[270px] shrink-0 cursor-pointer transition-all ${
                    index === currentStoreIndex ? 'ring-2 ring-black' : ''
                  }`}
                  onClick={() => handleStoreClick(index)}
                >
                  <Image
                    src={store.store.image_url || '/placeholder.png'}
                    alt={store.store.name}
                    fill
                    objectFit="cover"
                  />
                  <div className="from-black/56 absolute inset-0 flex items-end justify-center bg-gradient-to-t to-white/0">
                    <p className="pb-4 font-medium text-white">{store.store.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-container mx-auto mt-6 space-y-10 max-md:px-4 md:mt-20">
        <div>
          <div className="space-y-4 text-center">
            <p className="text-text-primary text-lg font-bold md:text-2xl">
              {currentStore.store.name}
            </p>
            <p className="text-text-secondary text-sm font-medium">
              {currentStore.store.description ||
                currentStore.store.sales_description ||
                '특별한 팝업스토어를 만나보세요.'}
            </p>
          </div>
        </div>

        <div className="max-w-container mx-auto w-full space-y-6 px-6">
          {currentStore.products.length > 0 ? (
            <>
              {/* 상품 그리드 - 일반 상품 리스트와 동일한 레이아웃 */}
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
              <p className="mb-2 text-sm font-normal text-gray-500 md:text-base">
                현재 판매 중인 상품이 없습니다
              </p>
              <p className="text-xs font-normal text-gray-400 md:text-sm">
                곧 새로운 상품이 등록될 예정입니다
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
