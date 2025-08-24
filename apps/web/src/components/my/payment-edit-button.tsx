'use client'

import { useState } from 'react'

import { Button } from '@workspace/ui/components/button'
import { X } from 'lucide-react'

import { cn } from '@/utils/cn'

import PaymentEditForm from './payment-edit-form'

export default function PaymentEditButton() {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <button
        className="rounded border border-[#E5E5EC] bg-white px-[8px] py-[10px] text-[14px] font-semibold"
        onClick={handleOpen}
      >
        결제 정보 수정
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className="w-[360px] rounded-sm border-none bg-white text-black md:w-[480px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5">
              <h2 className="text-xl font-bold">신용/체크 카드 등록</h2>
              <X onClick={handleClose} className="h-6 w-6 cursor-pointer" />
            </div>

            <PaymentEditForm onClose={handleClose} />
          </div>
        </div>
      )}
    </>
  )
}
