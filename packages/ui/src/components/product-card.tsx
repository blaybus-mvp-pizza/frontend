"use client";
import { useState, useEffect } from "react";
import { Product, ProductListItem, Auction } from "@workspace/ui/types";
import { Typography } from "@workspace/ui/components/typography";
import { cn } from "@workspace/ui/lib/utils";
import { ClockIcon } from "lucide-react";
import { calculateRemainingTime } from '@workspace/ui/lib/utils'

interface ProductCardProps {
  product: Product | ProductListItem;
  auction?: Auction;
  showTimeLeft?: boolean;
  className?: string;
  onClick?: () => void;
}

export function ProductCard({
  product,
  auction,
  showTimeLeft = true,
  className,
  onClick,
}: ProductCardProps) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    // Initial calculation
 if (auction?.endsAt) {
      setTimeLeft(calculateRemainingTime(auction.endsAt));
    }

    // Update every minute if showing time
    if (showTimeLeft && auction?.endsAt) {
      const interval = setInterval(() => {
        setTimeLeft(calculateRemainingTime(auction.endsAt));
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [auction, showTimeLeft]);
  // ProductListItem has representativeImage, Product has images array
  const mainImage =
    ("representativeImage" in product ? product.representativeImage : null) ||
    ("images" in product && product.images?.[0]?.imageUrl) ||
    "/placeholder.png";

  return (
    <div
      className={cn("group cursor-pointer bg-card transition-all space-y-2", className)}
      onClick={onClick}
    >
      {/* 이미지 컨테이너 */}
      <div className="relative aspect-square overflow-hidden rounded-sm bg-muted">
        <img
          src={mainImage}
          alt={product.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />

        {showTimeLeft && timeLeft && (
          <div className="absolute bottom-0 bg-black/80 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1">
            <Typography
              variant="caption"
              className="text-white  flex items-center justify-center gap-x-1"
            >
              <ClockIcon size={16} />
              <span className="font-semibold">
                남은 시간{" "}
                <span className="font-normal text-brand-mint">{timeLeft}</span>
              </span>
            </Typography>
          </div>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="pl-1 pr-7 space-y-1">
      <div className="space-y-1">

        {/* 팝업스토어 이름 */}
      
      
        {(("popupStoreName" in product && product.popupStoreName) ||
          ("popupStore" in product && product.popupStore?.name)) && (
          <p className="text-text-secondary text-sm leading-[140%] tracking-[-2.5%]">
            {"popupStoreName" in product
              ? product.popupStoreName
              : product.popupStore?.name}
          </p>
        )}

        <p className="text-text-primary font-semibold leading-[140%] line-clamp-2">
          {product.name}
        </p>
        </div>
        <div >
          {auction ? (
            <div className="space-y-1">
              {/* 현재 입찰가 */}

              <div className="flex items-center gap-x-1">
                <p className="text-sm text-text-secondary leading-[140%] tracking-[-2.5%]">
                  현재 입찰가 :
                </p>
                <p className="text-text-primary font-bold leading-[140%]">
                  {auction.currentBid
                    ? `${auction.currentBid.amount.toLocaleString()}원`
                    : `${auction.startPrice.toLocaleString()}원`}
                </p>
              </div>
              {auction.buyNowPrice && (
                <p className="text-text-tertiary text-xs leading-[140%] tracking-[-2.5%]">
                  즉시 구매가 {auction.buyNowPrice.toLocaleString()}원
                </p>
              )}
            </div>
          ) : (
            <Typography variant="body1" weight="bold">
              {(product.price || 0).toLocaleString()}원
            </Typography>
          )}
        </div>

        {product.labels && product.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.labels.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded border gap-1 border-[#E5E5EC] px-1 py-[3px] text-xs text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
