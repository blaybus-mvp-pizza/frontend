'use client'

import React from 'react'

import { ProductSampleList } from '@workspace/ui/components/product/product-sample-list'
import { motion } from 'framer-motion'

import {
  useProductsEndingSoon,
  useProductsNew,
  useProductsPopularAuctions,
  useProductsRecommended,
  useProductsUpcoming,
} from '@/api/hooks/queries/useProducts'
import { ProductListSkeleton } from '@/components/ui/skeleton'
import { useLazyLoad } from '@/hooks/useIntersectionObserver'

interface LazyProductListProps {
  title: string
  subtitle: string
  content?: string
  onProductClick: (productId: number) => void
  onViewAllClick: (content?: string) => void
  type: 'ending-soon' | 'recommended' | 'new' | 'upcoming' | 'popular-auctions'
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
    // current_highest_bid: item.current_highest_bid || 0,
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

const transformAuctions = (items: any[]): any => {
  if (!items) return []
  return items
    .filter((item) => item.auction_ends_at)
    .map((item) => ({
      id: 0,
      productId: item.product_id,
      startPrice: 0,
      minBidPrice: 0,
      buyNowPrice: item.buy_now_price,
      currentBid: {
        amount: item.current_highest_bid || 0,
      },
      depositAmount: 0,
      startsAt: new Date(),
      endsAt: new Date(item.auction_ends_at),
      status: 'running' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
}

/**
 * Individual lazy-loaded product section component
 */
function LazyProductSectionContent({
  title,
  subtitle,
  content,
  onProductClick,
  onViewAllClick,
  type,
}: LazyProductListProps) {
  const { ref, shouldLoad } = useLazyLoad({
    rootMargin: '150px',
    threshold: 0.1,
    triggerOnce: true,
  })

  // Conditionally call hooks based on shouldLoad
  const endingSoonQuery = useProductsEndingSoon({ page: 1, size: 4 }, {
    enabled: shouldLoad && type === 'ending-soon',
  } as any)

  const recommendedQuery = useProductsRecommended({ page: 1, size: 4 }, {
    enabled: shouldLoad && type === 'recommended',
  } as any)

  const newQuery = useProductsNew({ page: 1, size: 4 }, {
    enabled: shouldLoad && type === 'new',
  } as any)

  const upcomingQuery = useProductsUpcoming({ page: 1, size: 4 }, {
    enabled: shouldLoad && type === 'upcoming',
  } as any)

  const popularAuctionsQuery = useProductsPopularAuctions({ page: 2, size: 4 }, {
    enabled: shouldLoad && type === 'popular-auctions',
  } as any)

  // Get the appropriate query based on type
  const query =
    type === 'ending-soon'
      ? endingSoonQuery
      : type === 'recommended'
        ? recommendedQuery
        : type === 'new'
          ? newQuery
          : type === 'upcoming'
            ? upcomingQuery
            : popularAuctionsQuery

  const { data, isLoading } = query

  return (
    <div ref={ref}>
      {!shouldLoad ? (
        <ProductListSkeleton />
      ) : isLoading ? (
        <ProductListSkeleton />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ProductSampleList
            products={transformProductsForCard(data?.items || [])}
            auctions={transformAuctions(data?.items || [])}
            title={title}
            subtitle={subtitle}
            showViewAll={true}
            showTimeLeft={true}
            onProductClick={onProductClick}
            onViewAllClick={() => onViewAllClick(content)}
          />
        </motion.div>
      )}
    </div>
  )
}

/**
 * Lazy-loaded ending soon products section
 */
export function LazyEndingSoonSection({
  onProductClick,
  onViewAllClick,
}: Pick<LazyProductListProps, 'onProductClick' | 'onViewAllClick'>) {
  return (
    <LazyProductSectionContent
      title="지금 놓치면 사라져요!"
      subtitle="마감임박 상품"
      content="ending-soon"
      type="ending-soon"
      onProductClick={onProductClick}
      onViewAllClick={onViewAllClick}
    />
  )
}

/**
 * Lazy-loaded recommended products section
 */
export function LazyRecommendedSection({
  onProductClick,
  onViewAllClick,
}: Pick<LazyProductListProps, 'onProductClick' | 'onViewAllClick'>) {
  return (
    <LazyProductSectionContent
      title="알찬 상품만 추렸어요!"
      subtitle="MD`S Pick"
      content="popular"
      type="recommended"
      onProductClick={onProductClick}
      onViewAllClick={onViewAllClick}
    />
  )
}

/**
 * Lazy-loaded new products section
 */
export function LazyNewProductsSection({
  onProductClick,
  onViewAllClick,
}: Pick<LazyProductListProps, 'onProductClick' | 'onViewAllClick'>) {
  return (
    <LazyProductSectionContent
      title="따끈따근 새롭게 올라온"
      subtitle="신규 상품!"
      content="new"
      type="new"
      onProductClick={onProductClick}
      onViewAllClick={onViewAllClick}
    />
  )
}

/**
 * Lazy-loaded popular auctions section
 */
export function LazyPopularAuctionsSection({
  onProductClick,
  onViewAllClick,
}: Pick<LazyProductListProps, 'onProductClick' | 'onViewAllClick'>) {
  return (
    <LazyProductSectionContent
      title="사람들이 주목하고 있어요!"
      subtitle="인기 경매 상품"
      content="popular"
      type="popular-auctions"
      onProductClick={onProductClick}
      onViewAllClick={onViewAllClick}
    />
  )
}

/**
 * Lazy-loaded upcoming products section
 */
export function LazyUpcomingProductsSection({
  onProductClick,
  onViewAllClick,
}: Pick<LazyProductListProps, 'onProductClick' | 'onViewAllClick'>) {
  return (
    <LazyProductSectionContent
      title="곧 만나러 가요"
      subtitle="기대되는 오픈예정 상품"
      content="upcoming"
      type="upcoming"
      onProductClick={onProductClick}
      onViewAllClick={onViewAllClick}
    />
  )
}
