'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Button } from '@workspace/ui/components/button'
import { ProductSampleList } from '@workspace/ui/components/product/product-sample-list'
import { Typography } from '@workspace/ui/components/typography'
import { motion } from 'framer-motion'

import {
  useProductsEndingSoon,
  useProductsNew,
  useProductsRecommended,
  useRecentStores,
} from '@/api/hooks/queries/useProducts'
import StoreSection from '@/components/home/StoreSection'
import {
  CategoryTagSkeleton,
  PopupStoreSectionSkeleton,
  ProductListSkeleton,
  Skeleton,
} from '@/components/ui/skeleton'
import { PRODUCT_TAGS } from '@/constants/filter.constant'
import { useStoreMeta, useStoreProductMeta } from '@/hooks/queries/useProductDetail'

export default function HomePage() {
  const router = useRouter()

  // Use real API hooks with proper pagination
  const { data: recommendedData, isLoading: recommendedLoading } = useProductsRecommended({
    page: 1,
    size: 4,
  })

  const { data: endingSoonData, isLoading: endingSoonLoading } = useProductsEndingSoon({
    page: 1,
    size: 4,
  })

  const { data: newProductsData, isLoading: newProductsLoading } = useProductsNew({
    page: 1,
    size: 4,
  })

  // const { data: recentStoresData, isLoading: recentStoresLoading } = useRecentStores({
  //   page: 1,
  //   size: 2,
  //   stores: 2,
  // })

  const { data: homeStoreMeta1, isLoading: homeStoreMeta1Loading } = useStoreMeta(2020)
  const { data: homeStoreMeta2, isLoading: homeStoreMeta2Loading } = useStoreMeta(2021)

  const { data: homeStoreProductMeta1, isLoading: homeStoreProductMeta1Loading } =
    useStoreProductMeta(2020)
  const { data: homeStoreProductMeta2, isLoading: homeStoreProductMeta2Loading } =
    useStoreProductMeta(2021)
  console.log(homeStoreMeta1, homeStoreMeta2, homeStoreProductMeta1, homeStoreProductMeta2)
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
  if (recommendedLoading || endingSoonLoading || newProductsLoading) {
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
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="md::h-[380px] mt-4 h-[200px] w-full rounded-md bg-gradient-to-b from-gray-200 to-gray-600 sm:h-[280px] md:mt-6 md:rounded-lg"></div>
      </motion.div>

      {/* 카테고리 태그 */}
      <motion.div
        className="mt-6 md:mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-4 md:grid-cols-5 md:gap-3 lg:grid-cols-7">
          {PRODUCT_TAGS.map((v, index) => (
            <motion.div
              className="flex cursor-pointer flex-col items-center gap-1 rounded-lg bg-[#f6f6f6] p-2 transition-colors hover:bg-[#ececec] sm:gap-2 sm:p-3 md:gap-3 md:p-4"
              key={v.name}
              onClick={() => router.push(`/products?filter=${encodeURIComponent(v.name)}`)}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
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
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="mt-8 space-y-12 pb-8 md:mt-12 md:space-y-16 md:pb-12 lg:mt-14 lg:space-y-20 lg:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
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
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
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
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
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
        </motion.div>
      </div>

      <motion.div
        onClick={() => {}}
        className="relative h-40 text-white"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
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
      </motion.div>

      {homeStoreMeta1 && homeStoreMeta2 && homeStoreProductMeta1 && homeStoreProductMeta2 && (
        <>
          <motion.div
            key={`store-motion-1`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <StoreSection
              key={`store-1`}
              storeData={homeStoreMeta1}
              productData={homeStoreProductMeta1.items}
              onProductClick={handleProductClick}
            />
          </motion.div>
          <motion.div
            key={`store-motion-2`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <StoreSection
              key={`store-2`}
              storeData={homeStoreMeta2}
              productData={homeStoreProductMeta2.items}
              onProductClick={handleProductClick}
            />
          </motion.div>
        </>
      )}

      <motion.div
        className="relative mb-40 mt-20 h-60 text-white"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
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
      </motion.div>
    </div>
  )
}
