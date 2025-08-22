'use client'

interface ProductTabsProps {
  details?: React.ReactNode
  shipping?: React.ReactNode
  returns?: React.ReactNode
}

export function ProductTabs({ details, shipping, returns }: ProductTabsProps) {
  return (
    <div>
      <div className="border-border-light border-t py-4">
        <p className="text-xl font-semibold text-[#111111]">상품상세</p>
        <div className="mt-4 aspect-square border-t border-black bg-blue-100 p-4">
          {details || '표'}
        </div>
      </div>
      <div className="py-4">
        <p className="text-xl font-semibold text-[#111111]">배송안내</p>
        <div className="mt-4 aspect-square border-t border-black bg-pink-100 p-4">
          {shipping || '배송안내'}
        </div>
      </div>
      <div className="py-4">
        <p className="text-xl font-semibold text-[#111111]">교환/반품 안내</p>
        <div className="mt-4 aspect-square border-t border-black bg-pink-100 p-4">
          {returns || '교환/반품 안내'}
        </div>
      </div>
    </div>
  )
}
