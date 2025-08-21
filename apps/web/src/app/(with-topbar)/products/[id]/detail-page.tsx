"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Heart,
  Share2,
  Clock,
  Users,
  Shield,
  Truck,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Store,
  Calendar,
  MessageCircle,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import { formatCurrency } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Typography } from "@workspace/ui/components/typography";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductDetail } from "@/hooks/queries/useProductDetail";
import type { BidItem } from "@/types/api";

interface ProductDetailPageProps {
  productId: number;
}

// Helper functions
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// Components
function ImageGallery({ images }: { images: string[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <Store className="w-16 h-16 text-gray-300" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={images[selectedIndex] || "/placeholder.png"}
          alt="Product image"
          fill
          className="object-cover"
          priority
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setSelectedIndex(Math.max(0, selectedIndex - 1))}
              disabled={selectedIndex === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur rounded-full p-2 shadow-lg disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() =>
                setSelectedIndex(Math.min(images.length - 1, selectedIndex + 1))
              }
              disabled={selectedIndex === images.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur rounded-full p-2 shadow-lg disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0",
                selectedIndex === index ? "border-black" : "border-gray-200"
              )}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CountdownTimer({ endsAt }: { endsAt: string }) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(endsAt);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("종료됨");
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`${days}일 ${hours}시간 ${minutes}분`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}시간 ${minutes}분 ${seconds}초`);
      } else {
        setTimeLeft(`${minutes}분 ${seconds}초`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endsAt]);

  return <span className="font-semibold text-red-600">{timeLeft}</span>;
}

function BidHistory({ bids }: { bids: BidItem[] }) {
  if (!bids || bids.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Users className="w-12 h-12 mx-auto mb-2" />
        <Typography variant="body2">아직 입찰 내역이 없습니다</Typography>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bids.map((bid, index) => (
        <div
          key={`${bid.user.id}-${bid.bid_at}`}
          className={cn(
            "flex items-center justify-between p-4 rounded-lg",
            index === 0 ? "bg-green-50 border border-green-200" : "bg-gray-50"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
              {bid.user.profile_image ? (
                <Image
                  src={bid.user.profile_image}
                  alt=""
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <Typography variant="body2" weight="medium">
                {bid.user.name || `입찰자 ${bid.user.id}`}
              </Typography>
              <Typography variant="caption" className="text-gray-500">
                {new Date(bid.bid_at).toLocaleString("ko-KR")}
              </Typography>
            </div>
          </div>
          <div className="text-right">
            <Typography variant="body1" weight="semibold">
              {formatCurrency(bid.bid_amount)}
            </Typography>
            {index === 0 && (
              <Typography variant="caption" className="text-green-600">
                최고 입찰
              </Typography>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProductDetailPage({
  productId,
}: ProductDetailPageProps) {
  const router = useRouter();
  const [bidAmount, setBidAmount] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<
    "description" | "specs" | "shipping"
  >("description");

  const { product, auction, bids, similar, isLoading, refetch } =
    useProductDetail(productId);

  // Initialize bid amount
  useEffect(() => {
    if (auction && !bidAmount) {
      const suggestedBid =
        auction.bid_steps?.[0] ||
        (auction.current_highest_bid || auction.start_price) +
          auction.min_bid_price;
      setBidAmount(suggestedBid);
    }
  }, [auction, bidAmount]);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Typography variant="h3" className="mb-2">
            상품을 찾을 수 없습니다
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            요청하신 상품이 존재하지 않거나 삭제되었습니다.
          </Typography>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.back()}
          >
            돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const isAuctionActive = auction?.status === "RUNNING";
  const currentPrice =
    auction?.current_highest_bid || auction?.start_price || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <button
          onClick={() => router.push("/")}
          className="hover:text-gray-700"
        >
          홈
        </button>
        <span>/</span>
        <button
          onClick={() => router.push(`/stores/${product.store.store_id}`)}
          className="hover:text-gray-700"
        >
          {product.store.name}
        </button>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Image Gallery */}
        <ImageGallery images={product.images || []} />

        {/* Right: Product Info */}
        <div className="space-y-6">
          {/* Store Info */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div className="flex items-center gap-3">
              <Store className="w-5 h-5 text-gray-500" />
              <Typography variant="body2" weight="medium">
                {product.store.name}
              </Typography>
            </div>
          </div>

          {/* Product Title */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <Typography variant="h2">
                {product.title || product.name}
              </Typography>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg border hover:bg-gray-50">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg border hover:bg-gray-50">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            {product.description && (
              <Typography variant="body2" className="text-gray-600">
                {product.description}
              </Typography>
            )}
          </div>

          {/* Auction Info */}
          {auction && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <Typography variant="body2" className="text-gray-600">
                    {auction.status === "SCHEDULED"
                      ? "시작까지"
                      : auction.status === "RUNNING"
                        ? "종료까지"
                        : auction.status === "ENDED"
                          ? "경매 종료"
                          : "경매 취소"}
                  </Typography>
                </div>
                {auction.status === "RUNNING" && (
                  <CountdownTimer endsAt={auction.ends_at} />
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <Typography variant="body2" className="text-gray-600">
                    입찰 참여
                  </Typography>
                </div>
                <Typography variant="body1" weight="semibold">
                  {auction.bidder_count}명
                </Typography>
              </div>

              {auction.deposit_amount > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-500" />
                    <Typography variant="body2" className="text-gray-600">
                      보증금
                    </Typography>
                  </div>
                  <Typography variant="body1" weight="semibold">
                    {formatCurrency(auction.deposit_amount)}
                  </Typography>
                </div>
              )}
            </div>
          )}

          {/* Price Section */}
          <div className="space-y-4">
            <div>
              <Typography variant="body2" className="text-gray-600 mb-1">
                {auction?.current_highest_bid ? "현재 최고가" : "시작가"}
              </Typography>
              <Typography variant="h2" weight="bold">
                {formatCurrency(currentPrice)}
              </Typography>
            </div>

            {/* Bid Steps */}
            {isAuctionActive && auction.bid_steps && (
              <div className="space-y-2">
                <Typography variant="caption" className="text-gray-600">
                  추천 입찰가
                </Typography>
                <div className="flex gap-2 flex-wrap">
                  {auction.bid_steps.slice(0, 3).map((step) => (
                    <button
                      key={step}
                      onClick={() => setBidAmount(step)}
                      className={cn(
                        "px-4 py-2 rounded-lg border transition-colors",
                        bidAmount === step
                          ? "border-black bg-black text-white"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      {formatCurrency(step)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Bid Input */}
            {isAuctionActive && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setBidAmount(
                        Math.max(
                          auction.min_bid_price,
                          (bidAmount || 0) - auction.min_bid_price
                        )
                      )
                    }
                    className="p-2 rounded-lg border hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    value={bidAmount ? formatCurrency(bidAmount) : ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setBidAmount(value ? Number(value) : null);
                    }}
                    className="flex-1 px-4 py-3 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <button
                    onClick={() =>
                      setBidAmount((bidAmount || 0) + auction.min_bid_price)
                    }
                    className="p-2 rounded-lg border hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <AlertCircle className="w-3 h-3" />
                  최소 입찰 단위: {formatCurrency(auction.min_bid_price)}
                </div>
              </div>
            )}

            {/* Buy Now Price */}
            {auction?.buy_now_price && (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <Typography variant="body2">즉시구매가</Typography>
                <Typography variant="body1" weight="semibold">
                  {formatCurrency(auction.buy_now_price)}
                </Typography>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {isAuctionActive ? (
              <>
                <Button
                  size="lg"
                  className="flex-1"
                  disabled={!bidAmount || bidAmount <= currentPrice}
                >
                  입찰하기
                </Button>
                {auction.buy_now_price && (
                  <Button size="lg" variant="outline" className="flex-1">
                    즉시구매
                  </Button>
                )}
              </>
            ) : auction?.status === "SCHEDULED" ? (
              <Button size="lg" className="flex-1" disabled>
                <Calendar className="w-4 h-4 mr-2" />
                경매 예정
              </Button>
            ) : (
              <Button size="lg" className="flex-1" disabled>
                경매 종료
              </Button>
            )}
          </div>

          {/* Trust Badges */}
          <div className="flex gap-4 py-4 border-t">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-500" />
              <Typography variant="caption" className="text-gray-600">
                안전거래
              </Typography>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-gray-500" />
              <Typography variant="caption" className="text-gray-600">
                무료배송
              </Typography>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-gray-500" />
              <Typography variant="caption" className="text-gray-600">
                정품보증
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <div className="border-b">
          <div className="flex gap-8">
            {["description", "specs", "shipping"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                  activeTab === tab
                    ? "border-black text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                {tab === "description" && "상품 설명"}
                {tab === "specs" && "상품 스펙"}
                {tab === "shipping" && "배송/교환/환불"}
              </button>
            ))}
          </div>
        </div>

        <div className="py-8">
          {activeTab === "description" && (
            <div className="space-y-8">
              <div className="prose max-w-none">
                <Typography variant="body1" className="whitespace-pre-wrap">
                  {product.description || "상품 설명이 없습니다."}
                </Typography>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div>
                  <Typography
                    variant="body2"
                    weight="semibold"
                    className="mb-3"
                  >
                    관련 태그
                  </Typography>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bid History */}
              {bids && bids.items && (
                <div>
                  <Typography variant="h4" weight="semibold" className="mb-4">
                    입찰 내역
                  </Typography>
                  <BidHistory bids={bids.items} />
                  {bids.total > bids.items.length && (
                    <button className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                      더 보기 ({bids.total - bids.items.length}개 더)
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "specs" && (
            <div className="bg-gray-50 rounded-lg p-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {product.specs?.material && (
                  <div>
                    <dt className="text-sm text-gray-600 mb-1">소재</dt>
                    <dd className="text-sm font-medium">
                      {product.specs.material}
                    </dd>
                  </div>
                )}
                {product.specs?.place_of_use && (
                  <div>
                    <dt className="text-sm text-gray-600 mb-1">사용 장소</dt>
                    <dd className="text-sm font-medium">
                      {product.specs.place_of_use}
                    </dd>
                  </div>
                )}
                {(product.specs?.width_cm || product.specs?.height_cm) && (
                  <div>
                    <dt className="text-sm text-gray-600 mb-1">크기</dt>
                    <dd className="text-sm font-medium">
                      {product.specs.width_cm} × {product.specs.height_cm}cm
                      {product.specs.tolerance_cm &&
                        ` (±${product.specs.tolerance_cm}cm)`}
                    </dd>
                  </div>
                )}
                {product.specs?.edition_info && (
                  <div>
                    <dt className="text-sm text-gray-600 mb-1">에디션</dt>
                    <dd className="text-sm font-medium">
                      {product.specs.edition_info}
                    </dd>
                  </div>
                )}
                {product.specs?.condition_note && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm text-gray-600 mb-1">
                      컨디션/주의사항
                    </dt>
                    <dd className="text-sm font-medium">
                      {product.specs.condition_note}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-6">
              <div>
                <Typography variant="body2" weight="semibold" className="mb-2">
                  배송 정보
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  • 전 상품 무료배송
                  <br />
                  • 경매 종료 후 영업일 기준 2-3일 이내 발송
                  <br />• 도서/산간 지역은 추가 1-2일 소요
                </Typography>
              </div>
              <div>
                <Typography variant="body2" weight="semibold" className="mb-2">
                  교환/환불 정책
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  • 상품 수령 후 7일 이내 교환/환불 가능
                  <br />
                  • 단순 변심의 경우 왕복 배송비 구매자 부담
                  <br />
                  • 상품 하자의 경우 판매자가 배송비 부담
                  <br />• 경매 상품 특성상 부분 환불 불가
                </Typography>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Similar Products */}
      {similar && similar.items && similar.items.length > 0 && (
        <div className="mt-12">
          <Typography variant="h3" weight="semibold" className="mb-6">
            비슷한 상품
          </Typography>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similar.items.map((item) => (
              <button
                key={item.product_id}
                onClick={() => router.push(`/products/${item.product_id}`)}
                className="group text-left"
              >
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                  {item.representative_image ? (
                    <Image
                      src={item.representative_image}
                      alt={item.product_name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Store className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                </div>
                <div>
                  <Typography variant="caption" className="text-gray-500">
                    {item.popup_store_name}
                  </Typography>
                  <Typography variant="body2" className="line-clamp-2 mb-1">
                    {item.product_name}
                  </Typography>
                  <Typography variant="body2" weight="semibold">
                    {formatCurrency(
                      item.current_highest_bid || item.buy_now_price || 0
                    )}
                  </Typography>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Skeleton className="h-5 w-64 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32" />
          <Skeleton className="h-24" />
          <Skeleton className="h-14" />
        </div>
      </div>
    </div>
  );
}
