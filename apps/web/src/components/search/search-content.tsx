'use client'

import { motion } from 'framer-motion'

import { useRouter, useSearchParams } from 'next/navigation'

import { ProductCard } from '@workspace/ui/components/product-card'
import { Search, SlidersHorizontal } from 'lucide-react'

import { Dropdown } from '@/components/ui/dropdown'
import { Pagination } from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { PRODUCT_TAGS } from '@/constants/filter.constant'
import {
  BIDDER_OPTIONS,
  DEFAULT_FILTERS,
  ITEMS_PER_PAGE,
  PRICE_OPTIONS,
  SORT_OPTIONS,
  STATUS_OPTIONS,
} from '@/constants/product.constant'
import { useProductsWithPagination, useSearchProducts } from '@/hooks/queries/useProducts'
import { cn } from '@/utils/cn'
import { SortOption, AuctionStatus, BiddersFilter, PriceBucket } from '@/api/types/common.types'

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const query = searchParams.get('q') || ''
  const filter = searchParams.get('filter') || DEFAULT_FILTERS.filter
  const category = searchParams.get('category')
  const sort = searchParams.get('sort') || DEFAULT_FILTERS.sort
  const page = parseInt(searchParams.get('page') || String(DEFAULT_FILTERS.page), 10)
  const status = searchParams.get('status') || DEFAULT_FILTERS.status
  const bidders = searchParams.get('bidders') || DEFAULT_FILTERS.bidders
  const price = searchParams.get('price') || DEFAULT_FILTERS.price


  const {
    data: paginatedResponse,
    isLoading: productsLoading,
    isPlaceholderData,
  } = useSearchProducts(query, {
    category: filter !== '전체' ? filter : category || undefined,
    sort: sort as SortOption,
    page,
    size: ITEMS_PER_PAGE,
    status: status as AuctionStatus,
    bidders: bidders as BiddersFilter,
    price_bucket: price as PriceBucket,
  })

  const handleFilterClick = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('filter', tag)
    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }

  const handleDropdownChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)
    if (key !== 'page') {
      params.set('page', '1')
    }
    router.push(`?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (productsLoading && !isPlaceholderData) {
    return (
      <div>
        <div className="space-y-4 border-b border-[#E5E5E5] pb-4">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-64" />
          <div className="flex gap-x-2">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-y-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Skeleton className="h-10 w-28 rounded-lg" />
              <Skeleton className="h-10 w-32 rounded-lg" />
              <Skeleton className="h-10 w-28 rounded-lg" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-[#E5E5E5] py-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>

        <div className="grid grid-cols-2 gap-4 py-6 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="space-y-2 px-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center justify-between pt-1">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Transform ProductListItem to Product format for display
  const transformProduct = (item: any) => ({
    id: item.product_id,
    name: item.product_name,
    popupStoreName: item.popup_store_name,
    currentHighestBid: item.current_highest_bid,
    buyNowPrice: item.buy_now_price,
    price: item.current_highest_bid || item.buy_now_price || 0,
    representativeImage: item.representative_image,
    auctionEndsAt: item.auction_ends_at,
    labels: item.labels || [],
    images: item.representative_image ? [{ 
      id: 1, 
      productId: item.product_id, 
      imageUrl: item.representative_image, 
      sortOrder: 0 
    }] : [],
    popupStore: {
      id: 1,
      name: item.popup_store_name,
      createdAt: new Date(),
    },
  })
  
  const products = paginatedResponse?.items?.map(transformProduct) || []
  const totalItems = paginatedResponse?.total || 0
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  // Show empty state if no search query
  if (!query.trim()) {
    return (
      <div className="mt-5">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 text-gray-400">
            <Search className="h-12 w-12" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            검색어를 입력해주세요
          </h3>
          <p className="text-sm text-gray-500">
            찾으시는 상품을 검색해보세요
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-5">
      <div className="flex flex-col justify-start">
        <motion.div 
          className="space-y-4 border-b border-[#E5E5E5] pb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-5 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Search className="h-6 w-6 text-gray-500" />
              <div className="text-2xl font-bold">
                "{query}"에 대한 결과입니다
              </div>
            </div>
            <div className="text-text-tertiary text-sm">
              {totalItems > 0 
                ? `${totalItems}개의 검색 결과를 찾았습니다.` 
                : `"${query}"에 대한 검색 결과가 없습니다.`
              }
            </div>
          </div>

          <motion.div
            className="flex gap-x-2 overflow-x-auto text-nowrap"
            style={{ scrollbarWidth: 'none' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.span
              onClick={() => handleFilterClick('전체')}
              className={cn(
                'cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                filter === '전체'
                  ? 'bg-text-primary text-text-inverse border-text-primary'
                  : 'bg-background-100 text-text-primary border-border-default hover:bg-background-200',
              )}
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              전체
            </motion.span>
            {PRODUCT_TAGS.map((v, index) => (
              <motion.span
                key={v.name}
                onClick={() => handleFilterClick(v.name)}
                className={cn(
                  'cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                  filter === v.name
                    ? 'bg-text-primary text-text-inverse border-text-primary'
                    : 'bg-background-100 text-text-primary border-border-default hover:bg-background-200',
                )}
                whileInView={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {v.name}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* 필터 드롭다운 섹션 */}
        <div className="flex flex-col gap-y-4 py-4">
          {/* 상단 필터 버튼과 정렬 */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-3">
              {/* 상태 드롭다운 */}
              <Dropdown
                value={status}
                onChange={(value) => handleDropdownChange('status', value)}
                options={STATUS_OPTIONS}
                placeholder="상태 선택"
                className="min-w-[120px]"
              />

              {/* 입찰인원 드롭다운 */}
              <Dropdown
                value={bidders}
                onChange={(value) => handleDropdownChange('bidders', value)}
                options={BIDDER_OPTIONS}
                placeholder="입찰인원 선택"
                className="min-w-[140px]"
              />

              {/* 가격 드롭다운 */}
              <Dropdown
                value={price}
                onChange={(value) => handleDropdownChange('price', value)}
                options={PRICE_OPTIONS}
                placeholder="가격 선택"
                className="min-w-[140px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Product List Header - 총 개수와 정렬 */}
      <div className="flex items-center justify-between border-b border-[#E5E5E5] py-4">
        <div className="text-sm text-gray-600">
          총 <span className="font-semibold text-gray-900">{totalItems}개</span>의 상품
        </div>

        {/* 정렬 드롭다운 - 추천순/등록순/인기순 */}
        <Dropdown
          value={sort}
          onChange={(value) => handleDropdownChange('sort', value)}
          options={SORT_OPTIONS}
          placeholder="정렬"
          className="min-w-[120px]"
        />
      </div>

      {/* Product Grid - 4x4 레이아웃 */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-4 py-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product: any) => {
              const auction =
                product.auction ||
                (product.auctionEndsAt
                  ? {
                      id: product.id,
                      productId: product.id,
                      status: 'running' as const,
                      endsAt: new Date(product.auctionEndsAt),
                      startsAt: new Date(),
                      currentBid: product.currentHighestBid
                        ? {
                            id: 0,
                            auctionId: product.id,
                            amount: product.currentHighestBid,
                            userId: 0,
                            bidOrder: 1,
                            createdAt: new Date(),
                          }
                        : undefined,
                      buyNowPrice: product.buyNowPrice,
                      startPrice: product.price || 0,
                      minBidPrice: 10000,
                      depositAmount: 0,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      bidCount: 0,
                    }
                  : undefined)

              // Use price from product or auction data
              const displayProduct = {
                ...product,
                price: product.currentHighestBid || product.buyNowPrice || product.price || 0,
              }

              return (
                <ProductCard
                  key={product.id}
                  product={displayProduct}
                  auction={auction}
                  showTimeLeft={true}
                  onClick={() => {
                    router.push(`/products/${product.id}`)
                  }}
                />
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center border-t border-[#E5E5E5] py-8">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 text-gray-400">
            <SlidersHorizontal className="h-12 w-12" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            검색 결과가 없습니다
          </h3>
          <p className="text-sm text-gray-500">
            다른 검색어나 필터를 선택해보세요
          </p>
        </div>
      )}
    </div>
  )
}

export default SearchContent