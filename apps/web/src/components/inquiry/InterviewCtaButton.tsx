'use client'

import { useState } from 'react'

import { Button } from '@workspace/ui/components/button'
import { X } from 'lucide-react'

import { cn } from '@/utils/cn'

import InterviewCtaForm from './InterviewCtaForm'

export default function InterviewCtaButton() {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <Button
        className={cn(
          'flex-shrink-0',
          'gap-2 px-3 py-0',
          'h-12 w-full md:w-[110px]',
          'bg-background-100 text-text-primary rounded-[4px]',
          'hover:bg-background-200',
          'cursor-pointer',
        )}
        onClick={handleOpen}
      >
        <span
          className={cn(
            'text-[14px] font-semibold leading-[160%] tracking-[-0.025em]',
            'text-text-primary',
          )}
        >
          인터뷰 신청하기
        </span>
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className="w-[360px] rounded-sm border-none bg-white text-black md:w-[480px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5">
              <h2 className="text-xl font-bold">인터뷰 신청하기</h2>
              <X onClick={handleClose} className="h-6 w-6 cursor-pointer" />
            </div>

            <InterviewCtaForm onClose={handleClose} />
          </div>
        </div>
      )}
    </>
  )
}
