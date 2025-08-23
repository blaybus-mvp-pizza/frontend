'use client'

interface PurchaseOptionsProps {
  buyNowPrice?: number
  onBuyNow?: () => void
  status?: string
}

export function PurchaseOptions({ buyNowPrice, onBuyNow, status }: PurchaseOptionsProps) {
  if (!buyNowPrice) return null

  return (
    <div className="mt-3 flex items-center border-t py-3">
      <div className="flex flex-1 items-center">
        <p className="text-text-tertiary text-sm">즉시 구매가</p>
        <p className="text-text-primary ml-3 flex-1 text-xl font-bold">
          {buyNowPrice.toLocaleString()}원
        </p>
      </div>
      <button
        onClick={() => {
          status !== 'ENDED' ? onBuyNow && onBuyNow() : undefined
        }}
        className="rounded-sm bg-[#52565B] px-4 py-3 text-sm text-white transition-colors hover:bg-[#42464B]"
      >
        {status !== 'ENDED' ? '즉시 구매하기' : '경매 종료'}
      </button>
    </div>
  )
}
