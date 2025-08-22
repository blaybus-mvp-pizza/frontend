'use client'

import React, { useState } from 'react'

import { motion } from 'framer-motion'

import { useBidMutation } from '@/api/hooks/mutations/useBid'
import { useUIStore } from '@/store/ui.store'

interface BidModalProps {
  auctionId: number
  productName: string
  currentBid: number
  minBidIncrement?: number
  onClose: () => void
  onConfirm: () => void
}

const BidModal: React.FC<BidModalProps> = ({
  auctionId,
  productName,
  currentBid,
  minBidIncrement = 1000,
  onClose,
  onConfirm,
}) => {
  const [bidAmount, setBidAmount] = useState(currentBid + minBidIncrement)
  const bidMutation = useBidMutation()
  const setLoading = useUIStore((state) => state.setLoading)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading('bid', true)

    try {
      await bidMutation.mutateAsync({
        auction_id: auctionId,
        amount: bidAmount,
      })

      onConfirm()
    } finally {
      setLoading('bid', false)
    }
  }

  const quickBidOptions = [
    currentBid + minBidIncrement,
    currentBid + minBidIncrement * 5,
    currentBid + minBidIncrement * 10,
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-2 text-xl font-bold">입찰하기</h2>
        <p className="mb-4 text-sm text-gray-600">{productName}</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">현재 최고 입찰가</label>
            <div className="text-2xl font-bold text-blue-600">{currentBid.toLocaleString()}원</div>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">입찰 금액</label>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(Number(e.target.value))}
              min={currentBid + minBidIncrement}
              step={minBidIncrement}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              최소 입찰 단위: {minBidIncrement.toLocaleString()}원
            </p>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">빠른 입찰</label>
            <div className="flex gap-2">
              {quickBidOptions.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setBidAmount(amount)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm transition-colors ${
                    bidAmount === amount
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  +{((amount - currentBid) / 1000).toFixed(0)}천원
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-300 px-4 py-3 font-medium transition-colors hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={bidMutation.isPending}
              className="flex-1 rounded-xl bg-blue-500 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {bidMutation.isPending ? '처리중...' : '입찰'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default BidModal
