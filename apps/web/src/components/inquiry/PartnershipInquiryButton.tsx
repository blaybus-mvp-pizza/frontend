'use client'

import { useState } from 'react'

import { Button } from '@workspace/ui/components/button'
import { X } from 'lucide-react'

import PartnershipInquiryForm from './PartnershipInquiryForm'

export default function PartnershipInquiryButton() {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <Button
        variant={'white'}
        className="rounded-sm border-white p-3 text-[14px] font-semibold"
        onClick={handleOpen}
      >
        파트너십 문의하기
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className="w-[360px] rounded-sm border-none bg-white text-black md:w-[480px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5">
              <h2 className="text-xl font-bold">파트너십 문의하기</h2>
              <X onClick={handleClose} className="h-6 w-6 cursor-pointer" />
            </div>

            <PartnershipInquiryForm onClose={handleClose} />
          </div>
        </div>
      )}
    </>
  )
}
