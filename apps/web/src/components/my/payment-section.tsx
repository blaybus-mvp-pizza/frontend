'use client'

import Image from 'next/image'

import PaymentEditButton from './payment-edit-button'

export default function PaymentSection() {
  return (
    <div className="mt-8 flex flex-col gap-5">
      <div className="flex w-full items-start justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-lg font-semibold">등록된 결제수단</div>
          <div className="text-text-tertiary text-[13px] font-normal">
            결제 정보는 안전하게 결제 처리업체에 저장되며,
            <br /> 저희는 해당 정보에 접근할 수 없습니다.
          </div>
        </div>
        <PaymentEditButton />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex w-full items-center gap-3 rounded border border-[#E5E5EC] p-4">
          <Image src="/icons/card.svg" alt="Credit Card Icon" width={24} height={24} />
          <span className="text-[16px] font-medium">신한카드 기본</span>
          <span className="text-[16px] font-medium">**** **** **** 1234</span>
        </div>

        <div className="flex w-full items-center gap-3 rounded border border-[#E5E5EC] p-4">
          <Image src="/icons/card.svg" alt="Credit Card Icon" width={24} height={24} />
          <span className="text-[16px] font-medium">신한카드 기본</span>
          <span className="text-[16px] font-medium">**** **** **** 1234</span>
        </div>
      </div>
    </div>
  )
}
