'use client'

interface ProductSpecsProps {
  condition?: string
  edition?: string
  shippingFee?: number
}

export function ProductSpecs({
  condition = '세척 완료',
  edition = '기성품',
  shippingFee = 2500,
}: ProductSpecsProps) {
  return (
    <div className="border-border-light divide-border-light flex divide-x rounded-xl border p-4">
      <div className="flex flex-1 flex-col items-center justify-center space-y-2">
        <p className="text-sm">상품 상태</p>
        <p className="font-semibold">{condition}</p>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center space-y-2">
        <p className="text-sm">에디션 정보</p>
        <p className="font-semibold">{edition}</p>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center space-y-2">
        <p className="text-sm">기본 배송비</p>
        <p className="font-semibold">{shippingFee.toLocaleString()}원</p>
      </div>
    </div>
  )
}
