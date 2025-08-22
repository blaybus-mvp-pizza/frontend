'use client'

import { useState } from 'react'

import Image from 'next/image'
import { useParams } from 'next/navigation'

import { Button } from '@workspace/ui/components/button'
import { Typography } from '@workspace/ui/components/typography'
import { BellIcon, ClockIcon, Type, UserIcon } from 'lucide-react'

import BidModal from '@/components/modals/modals/BidModal'
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

export function calculateRemainingTime(ends_at: string): string {
  const endTime = new Date(ends_at).getTime()
  const now = Date.now()
  const remainingTime = endTime - now

  if (remainingTime <= 0) return '경매 종료'

  const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((remainingTime / (1000 * 60)) % 60)
  const seconds = Math.floor((remainingTime / 1000) % 60)

  return `${hours}:${minutes}:${seconds}`
}
export default function ProductDetailPage() {
  const params = useParams()
  const productId = Number(params.id)
  const [showBuyNowModal, setShowBuyNowModal] = useState(false)
  const [showBidModal, setShowBidModal] = useState(false)

  const { product, auction, similar, isLoading, bids } = useProductDetail(productId)
  console.log(bids)
  console.log(auction)
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
  function handleAuctionBid() {} //상품 경매 참여 로직

  return (
    <div className="mx-auto w-full max-w-[1950px] px-4 py-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} className="mb-6" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left Column - Images and Details */}
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
            buyNowPrice={auction?.buy_now_price}
            onBuyNow={() => setShowBuyNowModal(true)}
          />

          <div className="border-border-light flex w-full flex-col overflow-hidden rounded border-t pt-6">
            <div className="flex h-[52px] items-center justify-between bg-[#222222] px-5 py-[6px]">
              <div className="flex items-center gap-2">
                <ClockIcon className="text-white" size={16} />
                <span className="flex items-center gap-1 text-sm text-white">
                  남은시간:
                  <span className="text-brand-mint text-lg font-bold">
                    {auction && calculateRemainingTime(auction.ends_at)}
                  </span>
                </span>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <BellIcon className="text-white" size={16} />
              </div>
            </div>
            <div className="divide-border-light border-border-light divide-y border bg-white p-5">
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
                    <Typography variant="sub">{23}명 입찰</Typography>
                  </div>
                </div>
                <div className="border-border-light flex w-full items-center justify-between rounded border px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Typography variant="sub" weight="normal">
                      현재 입찰가
                    </Typography>
                    <Typography variant={'first'} weight="bold">
                      150,000원
                    </Typography>
                  </div>
                  <Typography variant={'sub'}>입찰 단위 1,000원</Typography>
                </div>
                <div className="col-span-2 grid grid-cols-2 gap-3 rounded-sm bg-[#F6F6F6] p-4">
                  <div className="flex items-center gap-2">
                    <Typography variant={'sub'} className="text-[#767676]">
                      경매 시작일
                    </Typography>
                    <Typography variant={'sub'} className="text-[#111111]">
                      2025.08.14
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <Typography variant={'sub'} className="text-[#767676]">
                      경매 종료일
                    </Typography>
                    <Typography variant={'sub'} className="text-[#111111]">
                      2025.08.14
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <Typography variant={'sub'} className="text-[#767676]">
                      시작가
                    </Typography>
                    <Typography variant={'sub'} className="text-[#111111]">
                      {(11000).toLocaleString()}원
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <Typography variant={'sub'} className="text-[#767676]">
                      경매 예약금
                    </Typography>
                    <Typography variant={'sub'} className="text-[#111111]">
                      {(6500).toLocaleString()}원
                    </Typography>
                  </div>
                </div>
              </div>
              <div className="w-full space-y-5 pt-4">
                <div className="flex w-full flex-col gap-y-3">
                  {/** 최대 입찰자 */}
                  <div className="flex w-full items-center gap-[5px] rounded-sm border border-[#A3DDD4] bg-[#F8FEFD] px-3 py-2">
                    {/* 최대 입찰자만 이 색*/}
                    <div className="h-2 w-2 rounded-full bg-[#A3DDD4]" />
                    <div className="flex flex-1 items-center gap-2">
                      <img
                        src="/placeholder.png"
                        alt="profileImg"
                        className="h-8 w-8 rounded-full"
                        content="cover"
                      />
                      <div className="flex flex-col gap-y-0.5">
                        <Typography variant="sub" className="text-[#111111]" weight={'semibold'}>
                          사용자 이름
                        </Typography>
                        <Typography variant="sub" className="text-[#111111]">
                          2025.09.02(10:00)
                        </Typography>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Typography variant={'second'} weight={'semibold'} className="text-sm">
                        150,000원
                      </Typography>
                      <button className="text-brand-mint rounded-sm bg-[#111111] px-2 py-[3px] text-xs font-semibold">
                        입찰
                      </button>
                    </div>
                  </div>
                  {/** 그외 입찰자 */}
                  <div className="flex w-full items-center gap-[5px] rounded-sm bg-[#EEEEEE] px-3 py-2">
                    {/* 최대 입찰자만 이 색*/}
                    <div className="h-2 w-2 rounded-full bg-[#BBBBBB]" />
                    <div className="flex flex-1 items-center gap-2">
                      <img
                        src="/placeholder.png"
                        alt="profileImg"
                        className="h-8 w-8 rounded-full"
                        content="cover"
                      />
                      <div className="flex flex-col gap-y-0.5">
                        <Typography variant="sub" className="text-[#767676]" weight={'semibold'}>
                          사용자 이름
                        </Typography>
                        <Typography variant="sub" className="text-[#767676]">
                          2025.09.02(10:00)
                        </Typography>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Typography variant={'second'} weight={'semibold'} className="text-sm">
                        150,000원
                      </Typography>
                      <button className="rounded-sm bg-[#999999] px-2 py-[3px] text-xs font-semibold text-white">
                        유찰
                      </button>
                    </div>
                  </div>

                  <div className="flex w-full items-center gap-[5px] rounded-sm bg-[#EEEEEE] px-3 py-2">
                    {/* 최대 입찰자만 이 색 그리고 세명만 보여줌*/}
                    <div className="h-2 w-2 rounded-full bg-[#BBBBBB]" />
                    <div className="flex flex-1 items-center gap-2">
                      <img
                        src="/placeholder.png"
                        alt="profileImg"
                        className="h-8 w-8 rounded-full"
                        content="cover"
                      />
                      <div className="flex flex-col gap-y-0.5">
                        <Typography variant="sub" className="text-[#767676]" weight={'semibold'}>
                          사용자 이름
                        </Typography>
                        <Typography variant="sub" className="text-[#767676]">
                          2025.09.02(10:00)
                        </Typography>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Typography variant={'second'} weight={'semibold'} className="text-sm">
                        150,000원
                      </Typography>
                      <button className="rounded-sm bg-[#999999] px-2 py-[3px] text-xs font-semibold text-white">
                        유찰
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  onClick={handleAuctionBid}
                  className="flex items-center justify-center rounded-sm bg-[#B5F5EB] px-4 py-3"
                >
                  <p className="font-bold text-[#11111]">입찰하기 160,000원</p>
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
          onClose={() => setShowBuyNowModal(false)}
          onConfirm={() => {
            setShowBuyNowModal(false)
            // Optionally refresh product data
          }}
        />
      )}

      {showBidModal && auction && (
        <BidModal
          auctionId={auction.auction_id}
          productName={product.name}
          currentBid={auction.current_highest_bid || auction.start_price || 0}
          minBidIncrement={auction.bid_steps?.[0] || 1000}
          onClose={() => setShowBidModal(false)}
          onConfirm={() => {
            setShowBidModal(false)
            // Optionally refresh product data
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
