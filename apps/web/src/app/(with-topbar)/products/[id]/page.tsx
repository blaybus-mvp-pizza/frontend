'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'
import { useParams } from 'next/navigation'

import { Button } from '@workspace/ui/components/button'
import { Typography } from '@workspace/ui/components/typography'
import { calculateRemainingTime } from '@workspace/ui/lib/utils'
import { BellIcon, ClockIcon } from 'lucide-react'

import { BidModal } from '@/components/modals/modals/BidModal'
import BuyNowModal from '@/components/modals/modals/BuyNowModal'
// Import modular components
import { ProductImages } from '@/components/products/detail/ProductImages'
import { ProductInfo } from '@/components/products/detail/ProductInfo'
import { ProductSpecs } from '@/components/products/detail/ProductSpecs'
import { ProductTabs } from '@/components/products/detail/ProductTabs'
import { PurchaseOptions } from '@/components/products/detail/PurchaseOptions'
import { SimilarProducts } from '@/components/products/detail/SimilarProducts'
import { StoreInfo } from '@/components/products/detail/StoreInfo'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'
import { useProductDetail } from '@/hooks/queries/useProductDetail'

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}.${month}.${day}`
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${year}.${month}.${day}(${hours}:${minutes})`
}

function getBidIncrement(
  currentPrice: number,
  bidSteps: number[] | undefined,
): { increment: number; isMaxBid: boolean } {
  if (!bidSteps || bidSteps.length === 0) {
    return { increment: 1000, isMaxBid: false }
  }

  // Find the current price in bid steps or the next higher step
  let currentIndex = -1
  for (let i = 0; i < bidSteps.length; i++) {
    if (currentPrice < bidSteps[i]!) {
      currentIndex = i
      break
    } else if (currentPrice === bidSteps[i]) {
      currentIndex = i + 1
      break
    }
  }

  // If current price is at or above the last step, it's max bid
  if (currentIndex === -1 || currentIndex >= bidSteps.length) {
    return { increment: 0, isMaxBid: true }
  }

  // If it's the last available step
  if (currentIndex === bidSteps.length - 1) {
    return { increment: bidSteps[currentIndex]! - currentPrice, isMaxBid: false }
  }

  // Calculate increment to next step
  const nextStep = bidSteps[currentIndex]
  return { increment: nextStep! - currentPrice, isMaxBid: false }
}
export default function ProductDetailPage() {
  const params = useParams()
  const productId = Number(params.id)
  const [showBuyNowModal, setShowBuyNowModal] = useState(false)
  const [showBidModal, setShowBidModal] = useState(false)
  const [, setCurrentTime] = useState(new Date())

  const { product, auction, similar, isLoading, bids, refetch } = useProductDetail(productId)

  // Update time every second for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])
  if (isLoading) {
    return <ProductDetailSkeleton />
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Typography variant="h3" className="mb-2">
            상품을 찾을 수 없습니다
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            요청하신 상품이 존재하지 않거나 삭제되었습니다.
          </Typography>
          <Button variant="outline" className="mt-4" onClick={() => window.history.back()}>
            돌아가기
          </Button>
        </div>
      </div>
    )
  }

  const breadcrumbItems = [
    { label: '홈', href: '/' },
    {
      label: product.category || '상품',
      href: `/products?content=popular&filter=${product.category}&page=1`,
    },
    { label: product.name },
  ]
  function handleAuctionBid() {
    if (auction && auction.status === 'RUNNING') {
      setShowBidModal(true)
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1950px] py-6">
      <Breadcrumb items={breadcrumbItems} className="mb-6" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-6">
          <div className="space-y-4">
            <ProductImages images={product.images || []} productName={product.name} />
            <ProductSpecs />
          </div>
          <ProductTabs />
        </div>

        <div className="space-y-3">
          <ProductInfo
            tags={product.tags || []}
            title={product.title || product.name}
            description={product.description}
          />

          <StoreInfo store={product.store} />

          <PurchaseOptions
            status={auction?.status}
            buyNowPrice={auction?.buy_now_price}
            onBuyNow={() => setShowBuyNowModal(true)}
          />

          <div className="border-border-light flex w-full flex-col overflow-hidden border-t pt-6">
            <div className="flex h-[52px] items-center justify-between rounded-t bg-[#222222] px-5 py-[6px]">
              <div className="flex items-center gap-2">
                <ClockIcon className="text-white" size={16} />
                <span className="flex items-center gap-1 text-sm text-white">
                  남은시간:
                  {auction && auction.status === 'RUNNING' ? (
                    <span className="text-brand-mint text-lg font-bold">
                      {calculateRemainingTime(auction.ends_at)}
                    </span>
                  ) : (
                    <span className="text-lg font-bold text-gray-400">경매 종료</span>
                  )}
                </span>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <BellIcon className="text-white" size={16} />
              </div>
            </div>
            <div className="divide-border-light border-border-light divide-y rounded-b border p-5">
              <div className="w-full space-y-3 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[#ff0000]" />
                    <Typography variant="second" weight={'semibold'}>
                      실시간 경매 LIVE
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image src={'/icons/USER.svg'} alt="user" width={10} height={10} />
                    <Typography variant="sub">{auction?.bidder_count || 0}명 입찰</Typography>
                  </div>
                </div>
                <div className="border-border-light flex w-full items-center justify-between rounded border px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Typography variant="sub" weight="normal">
                      현재 입찰가
                    </Typography>
                    <Typography variant={'first'} weight="bold">
                      {(auction?.current_highest_bid || auction?.start_price || 0).toLocaleString()}
                      원
                    </Typography>
                  </div>
                  <Typography variant={'sub'}>
                    {(() => {
                      const currentPrice = auction?.current_highest_bid || auction?.start_price || 0
                      const { increment, isMaxBid } = getBidIncrement(
                        currentPrice,
                        auction?.bid_steps,
                      )
                      if (isMaxBid) {
                        return '상한가 도달'
                      }
                      return `입찰 단위 ${increment.toLocaleString()}원`
                    })()}
                  </Typography>
                </div>
                <div className="col-span-2 grid grid-cols-1 gap-2 rounded-sm bg-[#F6F6F6] p-3 sm:grid-cols-2 sm:gap-3 md:p-4">
                  <div className="flex items-center gap-2">
                    <Typography variant={'sub'} className="text-text-tertiary">
                      경매 시작일
                    </Typography>
                    <Typography variant={'sub'} className="text-text-primary">
                      {auction ? formatDate(auction.starts_at) : '-'}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <Typography variant={'sub'} className="text-text-tertiaryiary">
                      경매 종료일
                    </Typography>
                    <Typography variant={'sub'} className="text-text-primary">
                      {auction ? formatDate(auction.ends_at) : '-'}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <Typography variant={'sub'} className="text-text-tertiaryiary">
                      시작가
                    </Typography>
                    <Typography variant={'sub'} className="text-text-primary">
                      {(auction?.start_price || 0).toLocaleString()}원
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <Typography variant={'sub'} className="text-text-tertiary">
                      경매 예약금
                    </Typography>
                    <Typography variant={'sub'} className="text-text-primary">
                      {(auction?.deposit_amount || 0).toLocaleString()}원
                    </Typography>
                  </div>
                </div>
              </div>
              <div className="w-full space-y-5 pt-4">
                <div className="flex w-full flex-col gap-y-3">
                  {bids?.items && bids.items.length > 0 ? (
                    bids.items.slice(0, 3).map((bid, index) => {
                      const isHighestBidder = index === 0
                      const isWinning = isHighestBidder && auction?.status === 'RUNNING'

                      return (
                        <div
                          key={index}
                          className={`flex w-full items-center gap-[5px] rounded-sm px-3 py-2 ${
                            isHighestBidder
                              ? 'border border-[#A3DDD4] bg-[#F8FEFD]'
                              : 'bg-[#EEEEEE]'
                          }`}
                        >
                          <div
                            className={`h-2 w-2 rounded-full ${
                              isHighestBidder ? 'bg-[#A3DDD4]' : 'bg-[#BBBBBB]'
                            }`}
                          />
                          <div className="flex flex-1 items-center gap-2">
                            <div className="relative h-8 w-8 overflow-hidden rounded-full">
                              <Image
                                src={bid.user.profile_image || '/placeholder.png'}
                                alt="profileImg"
                                fill
                                sizes="32px"
                                className="object-cover"
                              />
                            </div>
                            <div className="flex flex-col gap-y-0.5">
                              <Typography
                                variant="sub"
                                className={
                                  isHighestBidder ? 'text-text-primary' : 'text-text-tertiary'
                                }
                                weight={'semibold'}
                              >
                                {bid.user.name || `사용자 ${bid.user.id}`}
                              </Typography>
                              <Typography
                                variant="sub"
                                className={
                                  isHighestBidder ? 'text-text-primary' : 'text-text-tertiary'
                                }
                              >
                                {formatDateTime(bid.bid_at)}
                              </Typography>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Typography variant={'second'} weight={'semibold'} className="text-sm">
                              {bid.bid_amount.toLocaleString()}원
                            </Typography>
                            <button
                              className={`rounded-sm px-2 py-[3px] text-xs font-semibold ${
                                isWinning
                                  ? 'text-brand-mint bg-[#111111]'
                                  : 'bg-[#999999] text-white'
                              }`}
                            >
                              {isWinning ? '입찰' : '유찰'}
                            </button>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="flex items-center justify-center py-8 text-gray-500">
                      <Typography variant="sub">아직 입찰자가 없습니다</Typography>
                    </div>
                  )}
                </div>
                {auction && (
                  <>
                    {auction.status === 'RUNNING' &&
                      (() => {
                        const currentPrice = auction.current_highest_bid || auction.start_price || 0
                        const { increment, isMaxBid } = getBidIncrement(
                          currentPrice,
                          auction?.bid_steps,
                        )
                        if (isMaxBid) {
                          return (
                            <div className="flex cursor-not-allowed items-center justify-center rounded-sm bg-gray-300 px-4 py-3">
                              <p className="font-bold text-gray-600">상한가 도달</p>
                            </div>
                          )
                        }
                        return (
                          <div
                            onClick={handleAuctionBid}
                            className="flex cursor-pointer items-center justify-center rounded-sm bg-[#B5F5EB] px-4 py-3 transition-colors hover:bg-[#9FF3E8]"
                          >
                            <p className="font-bold text-[#11111]">
                              입찰하기 {(currentPrice + increment).toLocaleString()}원
                            </p>
                          </div>
                        )
                      })()}
                    {auction.status === 'ENDED' && (
                      <div className="flex items-center justify-center rounded-sm bg-gray-200 px-4 py-3">
                        <p className="font-bold text-gray-600">경매가 종료되었습니다</p>
                      </div>
                    )}
                    {auction.status === 'SCHEDULED' && (
                      <div className="flex items-center justify-center rounded-sm bg-gray-200 px-4 py-3">
                        <p className="font-bold text-gray-600">경매 시작 예정</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded bg-[#F6F6F6] p-5">
            <div className="flex flex-col gap-[3px]">
              <Typography variant={'first'} weight={'bold'} className="text-text-primary text-lg">
                이 상품 낙찰 시 세상에 남기는 작은 변화
              </Typography>
              <Typography variant={'sub'} weight={'medium'} className="text-text-secondary">
                환경 보호의 다음 여정을 홍길동님이 이어주세요
              </Typography>
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10">
                  <Image
                    src="/icons/EARTH_ICON.svg"
                    alt="Earth Icon"
                    fill
                    sizes="40px"
                    className="rounded-full"
                  />
                </div>
                <div className="relative flex items-center gap-1 rounded bg-[#222222] px-3 py-1.5">
                  <div className="absolute -left-1.5 top-1/2 h-0 w-0 -translate-y-1/2 border-b-[6px] border-r-[8px] border-t-[6px] border-b-transparent border-r-[#222222] border-t-transparent"></div>
                  <span className="text-sm font-medium text-white">이 상품이 주인을 찾으면</span>
                  <span className="flex items-center gap-x-1 text-xs font-medium text-[#94D8D4]">
                    <span className="relative inline-block h-2.5 w-2.5">
                      <Image src="/icons/RECYCLE.svg" alt="Recycle Icon" fill sizes="10px" />
                    </span>
                    탄소 2.4kg
                  </span>
                  <span className="text-xs font-medium text-white">가 절감돼요!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SimilarProducts items={similar?.items || []} />

      {showBuyNowModal && auction && (
        <BuyNowModal
          auctionId={auction.auction_id}
          productName={product.name}
          price={auction.buy_now_price || 0}
          productImage={product.images?.[0]}
          storeName={product.store?.name}
          onClose={() => setShowBuyNowModal(false)}
          onConfirm={() => {
            setShowBuyNowModal(false)
            refetch() // Refresh auction data after purchase
          }}
        />
      )}

      {showBidModal && auction && (
        <BidModal
          auctionId={auction.auction_id}
          productName={product.name}
          currentBid={auction.current_highest_bid || auction.start_price || 0}
          minBidIncrement={
            getBidIncrement(
              auction.current_highest_bid || auction.start_price || 0,
              auction?.bid_steps,
            ).increment
          }
          onClose={() => setShowBidModal(false)}
          onConfirm={() => {
            setShowBidModal(false)
            refetch() // Refresh auction and bid data after successful bid
          }}
        />
      )}
    </div>
  )
}

function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Skeleton className="mb-6 h-5 w-64" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-4">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-20 rounded-lg" />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Skeleton className="mb-2 h-6 w-32" />
            <Skeleton className="mb-2 h-10 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>

          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-24" />
          <Skeleton className="h-14 rounded-lg" />
        </div>
      </div>

      <div className="mt-12">
        <Skeleton className="mb-4 h-12 w-full" />
        <Skeleton className="h-64" />
      </div>
    </div>
  )
}
