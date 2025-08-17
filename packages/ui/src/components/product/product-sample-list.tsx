"use client";
import { Product, Auction } from "@workspace/ui/types";
import { ProductCard } from "@workspace/ui/components/product-card";
import { Typography } from "@workspace/ui/components/typography";

interface ProductSampleListProps {
  products: Product[];
  auctions: Auction[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  showTimeLeft?: boolean;
  onProductClick?: (productId: number) => void;
  onViewAllClick?: () => void;
}

export function ProductSampleList({
  products,
  auctions,
  title = "지금 놓치면 사라져요!",
  subtitle = "마감임박 상품",
  showViewAll = true,
  showTimeLeft = true,
  onProductClick,
  onViewAllClick,
}: ProductSampleListProps) {
  // 경매 정보와 상품 매칭
  const getAuctionForProduct = (productId: number) => {
    return auctions.find((auction) => auction.productId === productId);
  };

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="w-full flex items-center justify-between">
        <Typography variant="h5">
          {title}
          {subtitle && <span className="font-bold ml-2">{subtitle}</span>}
        </Typography>
        {showViewAll && (
          <Typography
            variant="caption"
            className="text-[#767676] cursor-pointer hover:text-foreground transition-colors"
            onClick={onViewAllClick}
          >
            전체보기
          </Typography>
        )}
      </div>

      {/* 상품 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => {
          const auction = getAuctionForProduct(product.id);
          return (
            <ProductCard
              key={product.id}
              product={product}
              auction={auction}
              showTimeLeft={showTimeLeft}
              onClick={() => onProductClick?.(product.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
