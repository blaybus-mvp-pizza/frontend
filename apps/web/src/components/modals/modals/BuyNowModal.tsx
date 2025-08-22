'use client'

import React from 'react'

import { motion } from 'framer-motion'
import { useBuyNow } from '@/api/hooks/mutations/useAuctionActions'
import PhoneVerificationModal from '@/components/modals/PhoneVerificationModal'

interface BuyNowModalProps {
  auctionId: number
  productName: string
  price: number
  onClose: () => void
  onConfirm: () => void
}

const BuyNowModal: React.FC<BuyNowModalProps> = ({ auctionId, productName, price, onClose, onConfirm }) => {
  const { 
    mutate: buyNow, 
    isPending,
    showPhoneVerificationModal,
    setShowPhoneVerificationModal 
  } = useBuyNow()

  const handleBuyNow = () => {
    buyNow(auctionId, {
      onSuccess: () => {
        onConfirm()
      }
    })
  }

  return (
    <>
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
        <h2 className="mb-2 text-xl font-bold">즉시 구매</h2>
        <p className="mb-4 text-sm text-gray-600">{productName}</p>

        <div className="mb-6 rounded-xl bg-gray-50 p-4">
          <div className="mb-1 text-sm text-gray-600">즉시 구매가</div>
          <div className="text-2xl font-bold text-blue-600">{price.toLocaleString()}원</div>
        </div>

        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            즉시 구매를 선택하시면 경매를 종료하고 바로 구매하실 수 있습니다.
          </p>
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
            type="button"
            onClick={handleBuyNow}
            disabled={isPending}
            className="flex-1 rounded-xl bg-blue-500 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? '처리중...' : '구매하기'}
          </button>
        </div>
      </motion.div>
    </motion.div>
    
    {/* Phone Verification Modal */}
    <PhoneVerificationModal
      isOpen={showPhoneVerificationModal}
      onClose={() => setShowPhoneVerificationModal(false)}
    />
    </>
  )
}

export default BuyNowModal
