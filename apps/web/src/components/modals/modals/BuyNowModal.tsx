'use client'

import React from 'react'

import Image from 'next/image'

import { Typography } from '@workspace/ui/components/typography'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, ShoppingBag, X } from 'lucide-react'

import { useBuyNow } from '@/api/hooks/mutations/useAuctionActions'

interface BuyNowModalProps {
  auctionId: number
  productName: string
  price: number
  productImage?: string
  storeName?: string
  onClose: () => void
  onConfirm: () => void
}

const BuyNowModal: React.FC<BuyNowModalProps> = ({
  auctionId,
  productName,
  price,
  productImage,
  storeName,
  onClose,
  onConfirm,
}) => {
  const {
    mutate: buyNow,
    isPending,
  } = useBuyNow()

  const handleBuyNow = () => {
    buyNow(auctionId, {
      onSuccess: () => {
        onConfirm()
      },
    })
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Black like product detail */}
          <div className="border-border-light flex items-center justify-between border-b px-5 py-4">
            <div className="flex items-center gap-3">
              <Typography variant="first" weight="bold" className="text-[#11111]">
                즉시 구매
              </Typography>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 transition-colors hover:bg-white/10"
            >
              <X className="text-white" size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Product Info Section */}
            <div className="mb-6 flex gap-4">
              {productImage && (
                <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={productImage}
                    alt={productName}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              )}
              <div className="flex-1">
                <Typography variant="second" weight="semibold" className="text-text-primary mb-1">
                  {productName}
                </Typography>
                {storeName && (
                  <Typography variant="sub" className="text-text-tertiary">
                    {storeName}
                  </Typography>
                )}
              </div>
            </div>

            {/* Price Section with Mint Background */}
            <div className="mb-6 rounded-lg border border-[#A3DDD4] bg-[#F8FEFD] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="sub" className="text-text-secondary mb-1">
                    즉시 구매가격
                  </Typography>
                  <div className="flex items-baseline gap-1">
                    <Typography variant="first" weight="bold" className="text-text-primary">
                      {price.toLocaleString()}
                    </Typography>
                    <Typography variant="first" className="text-text-primary">
                      원
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6 space-y-3">
              <div className="flex flex-1 flex-col">
                <Typography variant="sub" weight="semibold" className="text-text-primary">
                  즉시 구매 혜택
                </Typography>
                <Typography variant="sub" className="text-text-secondary">
                  경매 종료를 기다리지 않고 바로 구매하실 수 있습니다
                </Typography>
              </div>

              <div className="flex-1">
                <Typography variant="sub" weight="semibold" className="text-[#111111]">
                  구매 확정 안내
                </Typography>
                <Typography variant="sub" className="text-text-secondary">
                  구매 확정 후에는 취소가 불가능합니다
                </Typography>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-sm border border-[#DDDDDD] bg-white px-4 py-3 transition-colors hover:bg-gray-50"
              >
                <Typography
                  variant="second"
                  weight="medium"
                  className="text-text-tertiary text-center text-base"
                >
                  취소
                </Typography>
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isPending}
                className="flex-1 rounded-sm bg-[#B5F5EB] px-4 py-3 transition-colors hover:bg-[#9FF3E8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Typography
                  variant="second"
                  weight="bold"
                  className="text-center text-base text-[#111111]"
                >
                  {isPending ? '처리중...' : '즉시 구매하기'}
                </Typography>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}

export default BuyNowModal
