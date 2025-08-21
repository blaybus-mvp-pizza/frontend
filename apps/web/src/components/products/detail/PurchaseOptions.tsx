"use client";

interface PurchaseOptionsProps {
  buyNowPrice?: number;
  onBuyNow?: () => void;
}

export function PurchaseOptions({ buyNowPrice, onBuyNow }: PurchaseOptionsProps) {
  if (!buyNowPrice) return null;

  return (
    <div className="border-t py-2 flex items-center">
      <div className="flex-1 flex items-center">
        <p className="text-[#767676] text-sm">즉시 구매가</p>
        <p className="flex-1 ml-3 font-bold text-[#111111] text-xl">
          {buyNowPrice.toLocaleString()}원
        </p>
      </div>
      <button 
        onClick={onBuyNow}
        className="px-4 py-3 rounded-sm bg-[#52565B] text-white hover:bg-[#42464B] transition-colors"
      >
        즉시 구매하기
      </button>
    </div>
  );
}