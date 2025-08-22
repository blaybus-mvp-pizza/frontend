'use client'

interface PurchaseOptionsProps {
  buyNowPrice?: number
  onBuyNow?: () => void
}

export function PurchaseOptions({ buyNowPrice, onBuyNow }: PurchaseOptionsProps) {
  if (!buyNowPrice) return null

  return (
    <div className="flex items-center border-t py-2">
      <div className="flex flex-1 items-center">
        <p className="text-sm text-[#767676]">즉시 구매가</p>
        <p className="ml-3 flex-1 text-xl font-bold text-[#111111]">
          {buyNowPrice.toLocaleString()}원
        </p>
      </div>
      <button
        onClick={onBuyNow}
        className="rounded-sm bg-[#52565B] px-4 py-3 text-white transition-colors hover:bg-[#42464B]"
      >
        즉시 구매하기
      </button>
    </div>
  )
}
