"use client";
import { Product, Auction } from "@workspace/ui/types";
import { Typography } from "@workspace/ui/components/typography";
import { cn } from "@workspace/ui/lib/utils";
import { ClockIcon } from "lucide-react";

interface ProductCardProps {
  product: Product;
  auction?: Auction;
  showTimeLeft?: boolean;
  className?: string;
  onClick?: () => void;
}

export function ProductCard({
  product,
  auction,
  showTimeLeft = false,
  className,
  onClick,
}: ProductCardProps) {
  // 경매 남은 시간 계산
  const getTimeLeft = () => {
    if (!auction || auction.status !== "running") return null;

    const now = new Date();
    const end = new Date(auction.endsAt);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "종료됨";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}일 ${hours}시간`;
    if (hours > 0) return `${hours}시간 ${minutes}분`;
    return `${minutes}분`;
  };

  const timeLeft = getTimeLeft();
  const mainImage = product.images?.[0]?.imageUrl || "/placeholder.png";

  return (
    <div
      className={cn(
        "group cursor-pointer overflow-hidden rounded-sm border border-border bg-card transition-all hover:shadow-lg",
        className
      )}
      onClick={onClick}
    >
      {/* 이미지 컨테이너 */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={mainImage}
          alt={product.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />

        {/* 경매 상태 배지 */}
        {/* {auction && (
          <div className="absolute left-2 top-2">
            {auction.status === "scheduled" && (
              <span className="rounded-full bg-blue-500 px-2 py-1 text-xs text-white">
                예정
              </span>
            )}
            {auction.status === "running" && (
              <span className="rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                진행중
              </span>
            )}
            {auction.status === "ended" && (
              <span className="rounded-full bg-gray-500 px-2 py-1 text-xs text-white">
                종료
              </span>
            )}
          </div>
        )} */}

        {/* 남은 시간 표시 */}
        {showTimeLeft && timeLeft && auction?.status === "running" && (
          <div className="absolute bottom-0 bg-black/80 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1">
            <Typography
              variant="caption"
              className="text-white flex items-center justify-center gap-x-1"
            >
              <ClockIcon size={16} />
              <span>
                남은 시간 <span className="text-[#B5F5EB]">{timeLeft}</span>
              </span>
            </Typography>
          </div>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="p-4 space-y-2">
        {/* 팝업스토어 이름 */}
        {product.popupStore && (
          <Typography variant="caption" color="muted">
            {product.popupStore.name}
          </Typography>
        )}

        {/* 상품명 */}
        <Typography variant="body2" weight="semibold" lineClamp={2}>
          {product.name}
        </Typography>

        {/* 가격 정보 */}
        <div className="space-y-1">
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
              {product.price.toLocaleString()}원
            </Typography>
          )}
        </div>

        {/* 태그 */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="rounded border gap-1 border-[#E5E5EC] p-0.5 text-xs text-secondary-foreground"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
