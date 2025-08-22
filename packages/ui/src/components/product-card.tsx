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
      className={cn("group cursor-pointer bg-card transition-all", className)}
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
      <div className="p-1 space-y-1">
        {/* 팝업스토어 이름 */}
        {(("popupStoreName" in product && product.popupStoreName) ||
          ("popupStore" in product && product.popupStore?.name)) && (
          <Typography variant="caption" color="muted">
            {"popupStoreName" in product
              ? product.popupStoreName
              : product.popupStore?.name}
          </Typography>
        )}

        {/* 상품명 */}
        <Typography variant="body2" weight="semibold" lineClamp={2}>
          {product.name}
        </Typography>

        {/* 가격 정보 */}
        <div className="">
          {auction ? (
            <>
              {/* 현재 입찰가 */}

              <div className="flex items-center gap-x-1">
                <Typography variant="caption" color="muted">
                  현재가 :
                </Typography>
                <Typography variant="body2" weight="bold">
                  {auction.currentBid
                    ? `${auction.currentBid.amount.toLocaleString()}원`
                    : `${auction.startPrice.toLocaleString()}원`}
                </Typography>
              </div>

              {/* 즉시 구매가 */}
              {auction.buyNowPrice && (
                <Typography variant="caption" color="muted">
                  즉시 구매가 {auction.buyNowPrice.toLocaleString()}원
                </Typography>
              )}

              {/* 입찰 수 */}
              {/* {auction.bidCount !== undefined && auction.bidCount > 0 && (
                <Typography variant="caption" color="muted">
                  입찰 {auction.bidCount}건
                </Typography>
              )} */}
            </>
          ) : (
            <Typography variant="body1" weight="bold">
              {(product.price || 0).toLocaleString()}원
            </Typography>
          )}
        </div>

        {/* 태그 */}
        {product.labels && product.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.labels.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded border gap-1 border-[#E5E5EC] p-0.5 text-xs text-secondary-foreground"
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
