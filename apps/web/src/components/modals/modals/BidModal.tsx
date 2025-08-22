'use client'

import React, { useState } from 'react'

import { motion } from 'framer-motion'
import { X } from 'lucide-react'

import { usePlaceBid } from '@/api/hooks/mutations/useAuctionActions'
import PhoneVerificationModal from '@/components/modals/PhoneVerificationModal'

interface BidModalProps {
  auctionId: number
  productName: string
  currentBid: number
  minBidIncrement?: number
  onClose: () => void
  onConfirm: () => void
}

export const BidModal: React.FC<BidModalProps> = ({
  auctionId,
  productName,
  currentBid,
  minBidIncrement = 1000,
  onClose,
  onConfirm,
}) => {
  // 5개의 개별 체크박스 상태 관리
  const [checkedItems, setCheckedItems] = useState({
    cancelPolicy: false, // 입찰 후 취소/감액 불가
    paymentObligation: false, // 낙찰 시 결제 의무
    auctionRules: false, // 경매 규칙 동의
    deposit: false, // 입찰보증금 결제 동의
    autoPayment: false, // 자동 결제 동의
  })

  const bidAmount = currentBid + minBidIncrement

  const {
    mutate: placeBid,
    isPending,
    showPhoneVerificationModal,
    setShowPhoneVerificationModal,
  } = usePlaceBid()

  // 개별 체크박스 토글
  const handleCheck = (key: keyof typeof checkedItems) => {
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // 모든 체크박스가 체크되었는지 확인
  const isAllChecked = Object.values(checkedItems).every((value) => value === true)

  // 전체 선택/해제
  const handleCheckAll = () => {
    const newValue = !isAllChecked
    setCheckedItems({
      cancelPolicy: newValue,
      paymentObligation: newValue,
      auctionRules: newValue,
      deposit: newValue,
      autoPayment: newValue,
    })
  }

  const handleSubmit = () => {
    placeBid(
      { auctionId, amount: bidAmount },
      {
        onSuccess: () => {
          onConfirm()
        },
      },
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex h-svh items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-lg rounded bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">입찰 전 주의사항</h2>
              <X onClick={onClose} className="h-6 w-6 cursor-pointer" />
            </div>
          </div>

          <div className="px-6 py-4">
            <div className="border-border-light mb-4 flex items-center gap-2 border-b pb-3">
              <input
                type="checkbox"
                id="agreement-all"
                checked={isAllChecked}
                onChange={handleCheckAll}
                className="relative h-5 w-5 cursor-pointer appearance-none border-2 border-gray-300 bg-white checked:border-[#91c4b4] checked:bg-[#91c4b4] focus:outline-none"
                style={{
                  backgroundImage: isAllChecked
                    ? "url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L6 9.793l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e\")"
                    : 'none',
                  backgroundSize: '14px 14px',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
              <label
                htmlFor="agreement-all"
                className="text-text-primary cursor-pointer font-bold"
              >
                모두 확인했습니다.
              </label>
            </div>

            <div className="space-y-4 text-sm text-gray-600">
              {/* 1. 입찰 후 취소/감액 불가 */}
              <div>
                <div className="mb-1 flex items-center gap-x-1">
                  <input
                    type="checkbox"
                    id="cancel-policy"
                    checked={checkedItems.cancelPolicy}
                    onChange={() => handleCheck('cancelPolicy')}
                    className="hidden h-4 w-4 cursor-pointer"
                  />
                  <label
                    htmlFor="cancel-policy"
                    className="flex cursor-pointer items-center gap-x-1"
                  >
                    <img
                      src={checkedItems.cancelPolicy ? '/icons/CHECK.svg' : '/icons/CHECK_GRAY.svg'}
                    />
                    <h3 className="font-semibold text-text-primary">입찰 후 취소/감액 불가</h3>
                  </label>
                </div>
                <p className="pl-[1.1rem] text-sm text-text-primary">
                  철회나 금액 감액은 불가합니다. 또한 동일 상품에 대해 금액 상향만 가능하며
                  부정/오입력은 운영자 심사 후에만 예외 처리됩니다.
                </p>
              </div>

              {/* 2. 낙찰 시 결제 의무 */}
              <div>
                <div className="mb-1 flex items-center gap-x-1">
                  <input
                    type="checkbox"
                    id="payment-obligation"
                    checked={checkedItems.paymentObligation}
                    onChange={() => handleCheck('paymentObligation')}
                    className="hidden h-4 w-4 cursor-pointer"
                  />
                  <label
                    htmlFor="payment-obligation"
                    className="flex cursor-pointer items-center gap-x-1"
                  >
                    <img
                      src={
                        checkedItems.paymentObligation
                          ? '/icons/CHECK.svg'
                          : '/icons/CHECK_GRAY.svg'
                      }
                    />
                    <h3 className="font-semibold text-gray-900">
                      낙찰 시 결제 의무 및 미결제 처리
                    </h3>text-text-primary
                  </label>
                </div>
                <p className="pl-[1.1rem] text-sm text-text-primary">
                  낙찰은 구매계약 성립을 의미하며, 안내된 결제 마감(24시간) 내 결제가 필요합니다.
                  기한 내 미결제 시 차순위 입찰자에게 구매 기회가 넘어가며, 계정에 패널티가 부과될
                  수 있습니다.
                </p>
              </div>

              {/* 3. 경매 규칙 동의 */}
              <div>
                <div className="mb-1 flex items-center gap-x-1">
                  <input
                    type="checkbox"
                    id="auction-rules"
                    checked={checkedItems.auctionRules}
                    onChange={() => handleCheck('auctionRules')}
                    className="hidden h-4 w-4 cursor-pointer"
                  />
                  <label
                    htmlFor="auction-rules"
                    className="flex cursor-pointer items-center gap-x-1"
                  >
                    <img
                      src={checkedItems.auctionRules ? '/icons/CHECK.svg' : '/icons/CHECK_GRAY.svg'}
                    />
                    <h3 className="font-semibold text-text-primary">경매 규칙 동의</h3>
                  </label>
                </div>
                <p className="pl-[1.1rem] text-sm text-text-primary">
                  본 경매는 최대가 낙찰 방식으로 운영됩니다. 사용자가 입력한 최대가를 기준으로
                  시스템이 자동 응찰됩니다.
                </p>
              </div>

              {/* 4. 입찰보증금 결제 동의 */}
              <div>
                <div className="mb-1 flex items-center gap-x-1">
                  <input
                    type="checkbox"
                    id="deposit"
                    checked={checkedItems.deposit}
                    onChange={() => handleCheck('deposit')}
                    className="hidden h-4 w-4 cursor-pointer"
                  />
                  <label htmlFor="deposit" className="flex cursor-pointer items-center gap-x-1">
                    <img
                      src={checkedItems.deposit ? '/icons/CHECK.svg' : '/icons/CHECK_GRAY.svg'}
                    />
                    <h3 className="font-semibold text-gray-900">입찰보증금 결제 동의</h3>
                  </label>
                </div>
                <p className="pl-[1.1rem] text-sm text-text-primary">
                  [입찰하기]를 누르면 입찰보증금이 자동 결제됩니다. 보증금은 내 입찰가의 3%를
                  부과하며, 낙찰 시 최종 결제 금액에서 전액 차감, 낙찰 실패 시 원 결제수단으로
                  환불됩니다.
                </p>
              </div>

              {/* 5. 자동 결제 동의 */}
              <div>
                <div className="mb-1 flex items-center gap-x-1">
                  <input
                    type="checkbox"
                    id="auto-payment"
                    checked={checkedItems.autoPayment}
                    onChange={() => handleCheck('autoPayment')}
                    className="hidden h-4 w-4 cursor-pointer"
                  />
                  <label
                    htmlFor="auto-payment"
                    className="flex cursor-pointer items-center gap-x-1"
                  >
                    <img
                      src={checkedItems.autoPayment ? '/icons/CHECK.svg' : '/icons/CHECK_GRAY.svg'}
                    />
                    <h3 className="font-semibold text-gray-900">자동 결제 동의</h3>
                  </label>
                </div>
                <p className="pl-[1.1rem] text-sm text-text-primary">
                  내가 입찰한 상품이 낙찰되면 등록된 결제수단으로 즉시 자동 결제됩니다.
                </p>
              </div>

              <div className="">
                <button
                  onClick={handleSubmit}
                  disabled={!isAllChecked || isPending}
                  className={`w-full cursor-pointer px-4 py-3 font-semibold transition-colors ${
                    !isAllChecked || isPending
                      ? 'cursor-not-allowed bg-gray-300 text-white'
                      : 'bg-[#B5F5EB] text-black'
                  }`}
                >
                  {isPending
                    ? '입찰 중...'
                    : '입찰하기 (' + (currentBid + minBidIncrement).toLocaleString() + '원)'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      {showPhoneVerificationModal && (
        <PhoneVerificationModal
          onClose={() => setShowPhoneVerificationModal(false)}
          isOpen={showPhoneVerificationModal}
        />
      )}
    </>
  )
}
