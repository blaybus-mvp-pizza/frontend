'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Button } from '@workspace/ui/components/button'
import { ProductCard } from '@workspace/ui/components/product-card'
import { ProductSampleList } from '@workspace/ui/components/product/product-sample-list'
import { Typography } from '@workspace/ui/components/typography'
import { MapIcon } from 'lucide-react'

import {
  useProductsEndingSoon,
  useProductsNew,
  useProductsRecommended,
  useRecentStores,
} from '@/api/hooks/queries/useProducts'
import {
  CategoryTagSkeleton,
  PopupStoreSectionSkeleton,
  ProductListSkeleton,
  Skeleton,
} from '@/components/ui/skeleton'
import { PRODUCT_TAGS } from '@/constants/filter.constant'

export default function HomePage() {
  const router = useRouter()

  // Use real API hooks with proper pagination
  const { data: recommendedData, isLoading: recommendedLoading } = useProductsRecommended({
    page: 1,
    size: 12,
  })

  const { data: endingSoonData, isLoading: endingSoonLoading } = useProductsEndingSoon({
    page: 1,
    size: 8,
  })

  const { data: newProductsData, isLoading: newProductsLoading } = useProductsNew({
    page: 1,
    size: 8,
  })

  const { data: recentStoresData, isLoading: recentStoresLoading } = useRecentStores()

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`)
  }

  const handleViewAllClick = (content?: string) => {
    if (content) {
      router.push(`/products?content=${content}`)
    } else {
      router.push('/products')
    }
  }
  console.log()

  // Show skeleton loading state
  if (recommendedLoading || endingSoonLoading || newProductsLoading || recentStoresLoading) {
    return (
      <div className="min-h-screen">
        {/* 히어로 배너 skeleton */}
        <div className="w-full">
          <Skeleton className="mt-4 h-[200px] w-full rounded-md sm:h-[280px] md:mt-6 md:h-[380px] md:rounded-lg" />
        </div>

        {/* 카테고리 태그 skeleton */}
        <div className="mt-6 md:mt-8">
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-4 md:grid-cols-5 md:gap-3 lg:grid-cols-7">
            {[...Array(7)].map((_, index) => (
              <CategoryTagSkeleton key={index} />
            ))}
          </div>
        </div>

        {/* 상품 리스트 섹션 skeleton */}
        <div className="mt-8 space-y-12 pb-8 md:mt-12 md:space-y-16 md:pb-12 lg:mt-16 lg:space-y-20 lg:pb-16">
          <ProductListSkeleton />
          <ProductListSkeleton />
          <ProductListSkeleton />
        </div>

        {/* 배너 skeleton */}
        <Skeleton className="mt-8 h-40 w-full" />

        {/* Kanu popup store skeleton */}
        <PopupStoreSectionSkeleton />

        {/* 하단 배너 skeleton */}
        <Skeleton className="mt-20 h-60 w-full" />
      </div>
    )
  }

  // Transform API data to match component expectations
  const transformProductsForCard = (items: any[]) => {
    if (!items) return []
    return items.map((item) => ({
      id: item.product_id,
      popupStoreId: item.popup_store_id || 0,
      category: item.category || '',
      name: item.product_name,
      labels: item.labels,
      price: item.buy_now_price || 0,
      stock: 0,
      shippingBaseFee: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      images: item.representative_image
        ? [
            {
              id: 1,
              productId: item.product_id,
              imageUrl: item.representative_image,
              sortOrder: 0,
            },
          ]
        : [],
      popupStore: {
        id: 0,
        name: item.popup_store_name || '',
        createdAt: new Date(),
      },
    }))
  }

  const transformAuctions = (items: any[]) => {
    if (!items) return []
    return items
      .filter((item) => item.auction_ends_at)
      .map((item) => ({
        id: 0,
        productId: item.product_id,
        startPrice: 0,
        minBidPrice: 0,
        buyNowPrice: item.buy_now_price,
        depositAmount: 0,
        startsAt: new Date(),
        endsAt: new Date(item.auction_ends_at),
        status: 'running' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
  }

  // Extract and transform data with fallbacks
  const urgentProducts = transformProductsForCard(endingSoonData?.items || [])
  const mdPicks = transformProductsForCard(recommendedData?.items || [])
  const newProducts = transformProductsForCard(newProductsData?.items || [])
  // console.log(urgentProducts);
  // Create auctions from all products
  const auctions = [
    ...transformAuctions(endingSoonData?.items || []),
    ...transformAuctions(recommendedData?.items || []),
    ...transformAuctions(newProductsData?.items || []),
  ]

  return (
    <div className="min-h-screen">
      {/* 히어로 배너 */}
      <div className="w-full">
        <div className="md::h-[380px] mt-4 h-[200px] w-full rounded-md bg-gradient-to-b from-gray-200 to-gray-600 sm:h-[280px] md:mt-6 md:rounded-lg"></div>
      </div>

      {/* 카테고리 태그 */}
      <div className="mt-6 md:mt-10">
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-4 md:grid-cols-5 md:gap-3 lg:grid-cols-7">
          {PRODUCT_TAGS.map((v) => (
            <div
              className="flex cursor-pointer flex-col items-center gap-1 rounded-lg bg-[#f6f6f6] p-2 transition-colors hover:bg-[#ececec] sm:gap-2 sm:p-3 md:gap-3 md:p-4"
              key={v.name}
            >
              <Image
                src={v.imgSrc}
                alt={v.name}
                width={48}
                height={48}
                className="h-8 w-8 object-contain sm:h-10 sm:w-10 md:h-12 md:w-12"
                loading="lazy"
              />
              <Typography
                variant="caption"
                align="center"
                weight="medium"
                color="muted"
                className="text-[10px] sm:text-xs md:text-sm"
              >
                {v.name}
              </Typography>
            </div>
          ))}
        </div>
      </div>

      {/* 상품 리스트 섹션 */}
      <div className="mt-8 space-y-12 pb-8 md:mt-12 md:space-y-16 md:pb-12 lg:mt-14 lg:space-y-20 lg:pb-16">
        <ProductSampleList
          products={urgentProducts}
          auctions={auctions}
          title="지금 놓치면 사라져요!"
          subtitle="마감임박 상품"
          showViewAll={true}
          showTimeLeft={true}
          onProductClick={handleProductClick}
          onViewAllClick={() => handleViewAllClick('ending-soon')}
        />
        <ProductSampleList
          products={mdPicks}
          auctions={auctions}
          title="알찬 상품만 추렸어요!"
          subtitle="MD`S Pick"
          showViewAll={true}
          showTimeLeft={true}
          onProductClick={handleProductClick}
          onViewAllClick={() => handleViewAllClick('popular')}
        />
        <ProductSampleList
          products={newProducts}
          auctions={auctions}
          title="따끈따근 새롭게 올라온"
          subtitle="신규 상품!"
          showViewAll={true}
          showTimeLeft={true}
          onProductClick={handleProductClick}
          onViewAllClick={() => handleViewAllClick('new')}
        />
      </div>

      <div onClick={() => {}} className="relative h-40 text-white">
        <Image
          alt="배너1"
          src="/images/BANNER1.webp"
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
          loading="lazy"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-[24px] md:text-[32px]">SHOW ROOM OPEN EVENT</p>
          <p className="font-light">나팔 서비스 오픈기념 이벤트 바로가기</p>
        </div>
      </div>

      {recentStoresData && recentStoresData.items && recentStoresData.items.length > 0 && (
        <>
          {recentStoresData.items
            .filter((storeData) => storeData.products && storeData.products.length > 0)
            .map((storeData) => (
              <div key={`store-${storeData.store.store_id}`} className="mt-20 w-full space-y-2">
                <div className="mt-8 flex items-center gap-x-2">
                  <span className="text-brand-mint flex w-fit items-center gap-x-2 bg-black p-1">
                    <MapIcon />
                    <Typography className="text-brand-mint font-semibold md:text-xl">
                      {storeData.store.name}
                    </Typography>
                  </span>
                  <Typography variant={'h6'} className="font-semibold md:text-xl">
                    {storeData.store.sales_description || '팝업스토어에서 판매중인 아이템'}
                  </Typography>
                </div>
                <div className="flex h-[400px] gap-x-8">
                  <div className="relative aspect-square h-[397px] w-[442px] shrink-0 overflow-hidden">
                    <Image
                      src={storeData.store.image_url!}
                      alt={`${storeData.store.name} 썸네일`}
                      quality={100}
                      fill
                      className="object-cover"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                      <Typography variant="h5" className="mb-2 font-bold text-white">
                        {storeData.store.name}
                      </Typography>
                      <Typography variant="body1" className="text-white/90">
                        {storeData.store.description}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    {storeData.products.slice(0, 2).map((product) => {
                      const productData = {
                        id: product.product_id,
                        popupStoreId: storeData.store.store_id,
                        category: '아트/컬렉터블',
                        name: product.product_name,
                        summary: product.popup_store_name,
                        labels: product.labels,
                        description: '',
                        price: product.buy_now_price || product.current_highest_bid || 0,
                        stock: 1,
                        shippingBaseFee: 3000,
                        shippingFreeThreshold: 50000,
                        isActive: true,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        images: product.representative_image
                          ? [
                              {
                                id: product.product_id,
                                productId: product.product_id,
                                imageUrl: product.representative_image,
                                sortOrder: 0,
                              },
                            ]
                          : [],
                        tags: [],
                        popupStore: {
                          id: storeData.store.store_id,
                          name: product.popup_store_name,
                          createdAt: new Date(),
                        },
                      }

                      const auctionData = product.auction_ends_at
                        ? {
                            id: product.product_id,
                            productId: product.product_id,
                            startPrice: product.current_highest_bid || 0,
                            minBidPrice: 1000,
                            buyNowPrice: product.buy_now_price || 0,
                            depositAmount: 0,
                            startsAt: new Date(),
                            endsAt: new Date(product.auction_ends_at),
                            status:
                              new Date(product.auction_ends_at) > new Date()
                                ? ('running' as const)
                                : ('ended' as const),
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            currentBid: product.current_highest_bid
                              ? {
                                  id: 1,
                                  auctionId: product.product_id,
                                  userId: 1,
                                  bidOrder: 1,
                                  amount: product.current_highest_bid,
                                  createdAt: new Date(),
                                }
                              : undefined,
                            bidCount: 0,
                          }
                        : undefined

                      return (
                        <ProductCard
                          key={product.product_id}
                          product={productData}
                          auction={auctionData}
                          showTimeLeft={!!auctionData}
                          onClick={() => handleProductClick(product.product_id)}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
        </>
      )}

      <div className="relative mt-20 h-60 text-white">
        <Image
          alt="배너2"
          src="/images/BANNER2.webp"
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
          loading="lazy"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-[24px] md:text-[32px]">기업의 자산을 사회적 가치로 전환합니다</p>
          <p className="font-light">
            나팔은 버려지는 기업과 자산이 새로운 공간에서 가치를 이어갈 수 있도록 함께합니다.
          </p>
          <Button
            onClick={() => {
              window.location.href =
                'mailto:yunsu102896@gmail.com?subject=파트너십 문의&body=안녕하세요,%0D%0A파트너십에 대해 문의드립니다.'
            }}
            variant={'white'}
            className="rounded-xs mt-4"
          >
            파트너십 문의하기
          </Button>
        </div>
      </div>
    </div>
  )
}
