"use client";

interface ProductSpecsProps {
  condition?: string;
  edition?: string;
  shippingFee?: number;
}

export function ProductSpecs({ 
  condition = "세척 완료", 
  edition = "기성품", 
  shippingFee = 2500 
}: ProductSpecsProps) {
  return (
    <div className="border-border-light divide-border-light p-4 border rounded-xl flex divide-x">
      <div className="flex-1 space-y-2 flex flex-col items-center justify-center">
        <p className="text-sm">상품 상태</p>
        <p className="font-semibold">{condition}</p>
      </div>
      <div className="flex-1 space-y-2 flex flex-col items-center justify-center">
        <p className="text-sm">에디션 정보</p>
        <p className="font-semibold">{edition}</p>
      </div>
      <div className="flex-1 space-y-2 flex flex-col items-center justify-center">
        <p className="text-sm">기본 배송비</p>
        <p className="font-semibold">{shippingFee.toLocaleString()}원</p>
      </div>
    </div>
  );
}