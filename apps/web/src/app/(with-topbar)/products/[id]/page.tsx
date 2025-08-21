"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useProductDetail } from "@/hooks/queries/useProductDetail";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@workspace/ui/components/button";
import { Typography } from "@workspace/ui/components/typography";
import {
  Heart,
  Share2,
  Clock,
  Users,
  Shield,
  Truck,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Store,
  Calendar,
  MessageCircle,
} from "lucide-react";
import { formatCurrency } from "@workspace/ui/lib/utils";
import type { BidItem } from "@/types/api";

// Helper function for class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// Time remaining component
function TimeRemaining({ endsAt }: { endsAt: string }) {
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const endTime = new Date(endsAt);
      const diff = endTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining("종료됨");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeRemaining(`${days}일 ${hours}시간 ${minutes}분`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}시간 ${minutes}분 ${seconds}초`);
      } else if (minutes > 0) {
        setTimeRemaining(`${minutes}분 ${seconds}초`);
      } else {
        setTimeRemaining(`${seconds}초`);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [endsAt]);

  return <span>{timeRemaining || "계산 중..."}</span>;
}

// Bid list component
function BidList({ bids }: { bids: BidItem[] }) {
  if (!bids || bids.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
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
            index === 0
              ? "bg-brand-mint/10 border border-brand-mint/20"
              : "bg-gray-50"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
              {bid.user.profile_image ? (
                <Image
                  src={bid.user.profile_image}
                  alt={bid.user.name || "User"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <Users className="w-5 h-5" />
                </div>
              )}
            </div>
            <div>
              <Typography variant="body2" weight="medium">
                {bid.user.name || `사용자 ${bid.user.id}`}
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
              <Typography variant="caption" className="text-brand-mint">
                최고 입찰
              </Typography>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Product specs component
function ProductSpecs({ specs }: { specs: any }) {
  const specItems = [
    { label: "소재", value: specs.material },
    { label: "사용 장소", value: specs.place_of_use },
    {
      label: "크기",
      value:
        specs.width_cm && specs.height_cm
          ? `${specs.width_cm} × ${specs.height_cm}cm`
          : null,
    },
    {
      label: "오차 범위",
      value: specs.tolerance_cm ? `±${specs.tolerance_cm}cm` : null,
    },
    { label: "에디션", value: specs.edition_info },
    { label: "컨디션", value: specs.condition_note },
  ].filter((item) => item.value);

  if (specItems.length === 0) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <Typography variant="h4" weight="semibold" className="mb-4">
        상품 스펙
      </Typography>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {specItems.map((item) => (
          <div key={item.label}>
            <dt className="text-sm text-gray-600 mb-1">{item.label}</dt>
            <dd className="text-sm font-medium">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [bidAmount, setBidAmount] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "shipping" | "refund">(
    "details"
  );

  const { product, auction, bids, similar, isLoading } =
    useProductDetail(productId);

  // Initialize bid amount when auction data loads
  useEffect(() => {
    if (auction && !bidAmount) {
      const suggestedBid =
        auction.bid_steps[0] ||
        (auction.current_highest_bid
          ? auction.current_highest_bid + auction.min_bid_price
          : auction.start_price);
      setBidAmount(suggestedBid);
    }
  }, [auction, bidAmount]);

  const handleBidAmountChange = (direction: number) => {
    if (!auction) return;

    const currentAmount = bidAmount || auction.start_price;
    const newAmount = Math.max(
      auction.min_bid_price,
      currentAmount + direction * auction.min_bid_price
    );
    setBidAmount(newAmount);
  };

  const handleBidStepClick = (amount: number) => {
    setBidAmount(amount);
  };

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
            onClick={() => window.history.back()}
          >
            돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "홈", href: "/" },
    {
      label: product.category || "상품",
      href: `/products?content=popular&filter=${product.category}&page=1`,
    },
    { label: product.name },
  ];
  const currentPrice =
    auction?.current_highest_bid || auction?.start_price || 0;
  const isAuctionActive = auction?.status === "RUNNING";

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} className="mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[selectedImageIndex] || "/placeholder.png"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Typography variant="body2">이미지 없음</Typography>
              </div>
            )}

            {/* Image Navigation */}
            {product.images && product.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))
                  }
                  disabled={selectedImageIndex === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur rounded-full p-2 shadow-lg disabled:opacity-50 hover:bg-white transition-colors"
                  aria-label="이전 이미지"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    setSelectedImageIndex(
                      Math.min(
                        product.images.length - 1,
                        selectedImageIndex + 1
                      )
                    )
                  }
                  disabled={selectedImageIndex === product.images.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur rounded-full p-2 shadow-lg disabled:opacity-50 hover:bg-white transition-colors"
                  aria-label="다음 이미지"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {product.images && product.images.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {product.images.length}
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    "relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all",
                    selectedImageIndex === index
                      ? "border-black scale-105"
                      : "border-gray-200 hover:border-gray-400"
                  )}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {product.tags.map((v) => (
                <span
                  key={v}
                  className="border-[#E5E5EC] text-xs border text-grey-800 px-[10px] py-[2px]"
                >
                  {v}
                </span>
              ))}
            </div>

            <div>
              <div>
                <p className="text-2xl text-[#111111] font-bold">
                  {product.title || product.name}
                </p>
              </div>
              {product.description && (
                <p className="text-[#505050] text-sm mt-0.5">
                  {product.description}
                </p>
              )}
            </div>
          </div>
          <div className="bg-[#F6F6F6] p-4 space-y-3">
            <div className="flex items-start gap-4">
              <div className="flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-[#111111]">
                  {product.store.name}
                </h3>
                <p className="text-sm text-[#505050] mt-1">
                  {product.store.description}
                </p>
              </div>
              <img
                src={product.store.image_url || "/placeholder.png"}
                alt={product.store.name}
                className="w-10 h-10 rounded-sm object-cover"
              />
            </div>
            <div className="bg-white flex items-center justify-between px-4 py-2">
              <p className="text-sm text-[#111111]">
                이 상품과{" "}
                <span className="font-semibold">
                  함께 판매하는 상품이 있어요!
                </span>
              </p>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          {auction?.buy_now_price && (
            <div className="border-t py-2 flex items-center">
              <div className="flex-1 flex items-center">
                <p className="text-[#767676] text-sm">즉시 구매가</p>
                <p className="flex-1 ml-3 font-bold text-[#111111] text-xl">
                  {auction.buy_now_price.toLocaleString()}원
                </p>
              </div>
              <button className="px-4 py-3 rounded-sm bg-[#52565B] text-white">
                즉시 구매하기
              </button>
            </div>
          )}

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
                  <Typography
                    variant="body1"
                    weight="semibold"
                    className="text-red-600"
                  >
                    <TimeRemaining endsAt={auction.ends_at} />
                  </Typography>
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

          {/* Current Price */}
          <div className="space-y-4">
            <div>
              <Typography variant="body2" className="text-gray-600 mb-1">
                {auction?.current_highest_bid ? "현재 최고가" : "시작가"}
              </Typography>
              <div className="flex items-baseline gap-2">
                <Typography variant="h2" weight="bold">
                  {formatCurrency(currentPrice)}
                </Typography>
                {auction?.current_highest_bid &&
                  auction.start_price < auction.current_highest_bid && (
                    <Typography variant="body2" className="text-green-600">
                      +
                      {formatCurrency(
                        auction.current_highest_bid - auction.start_price
                      )}
                    </Typography>
                  )}
              </div>
            </div>

            {/* Bid Steps */}
            {isAuctionActive &&
              auction.bid_steps &&
              auction.bid_steps.length > 0 && (
                <div className="space-y-2">
                  <Typography variant="caption" className="text-gray-600">
                    추천 입찰가
                  </Typography>
                  <div className="flex gap-2 flex-wrap">
                    {auction.bid_steps.slice(0, 3).map((step) => (
                      <button
                        key={step}
                        onClick={() => handleBidStepClick(step)}
                        className={cn(
                          "px-4 py-2 rounded-lg border transition-colors",
                          bidAmount === step
                            ? "border-brand-mint bg-brand-mint/10 text-brand-mint"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <Typography variant="body2" weight="medium">
                          {formatCurrency(step)}
                        </Typography>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            {/* Bid Input */}
            {isAuctionActive && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBidAmountChange(-1)}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
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
                    className="flex-1 px-4 py-3 text-center border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-mint"
                  />
                  <button
                    onClick={() => handleBidAmountChange(1)}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <Typography
                  variant="caption"
                  className="text-gray-500 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  최소 입찰 단위: {formatCurrency(auction.min_bid_price)}
                </Typography>
              </div>
            )}

            {/* Buy Now Price */}
            {auction?.buy_now_price && (
              <div className="flex items-center justify-between p-3 bg-brand-mint/10 rounded-lg">
                <Typography variant="body2" className="text-gray-700">
                  즉시구매가
                </Typography>
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
                  disabled={
                    !bidAmount ||
                    bidAmount <=
                      (auction.current_highest_bid || auction.start_price)
                  }
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
          <div className="flex gap-4 py-4 border-t border-gray-200">
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
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <div className="border-b border-gray-200">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("details")}
              className={cn(
                "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === "details"
                  ? "border-black text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              상품 상세
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={cn(
                "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === "shipping"
                  ? "border-black text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              배송 정보
            </button>
            <button
              onClick={() => setActiveTab("refund")}
              className={cn(
                "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === "refund"
                  ? "border-black text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              교환/환불
            </button>
          </div>
        </div>

        <div className="py-8">
          {activeTab === "details" && (
            <div className="space-y-8">
              {/* Product Description */}
              {product.description && (
                <div className="prose max-w-none">
                  <Typography variant="body1" className="whitespace-pre-wrap">
                    {product.description}
                  </Typography>
                </div>
              )}

              {/* Product Specs */}
              {product.specs && <ProductSpecs specs={product.specs} />}

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
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bid History */}
              {bids && bids.items && bids.items.length > 0 && (
                <div>
                  <Typography variant="h4" weight="semibold" className="mb-4">
                    입찰 내역
                  </Typography>
                  <BidList bids={bids.items} />
                </div>
              )}
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-6">
              <div>
                <Typography variant="body2" weight="semibold" className="mb-2">
                  배송비
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  전 상품 무료배송
                </Typography>
              </div>
              <div>
                <Typography variant="body2" weight="semibold" className="mb-2">
                  배송 기간
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  • 경매 종료 후 영업일 기준 2-3일 이내 발송
                  <br />
                  • 도서/산간 지역은 추가 1-2일 소요
                  <br />• 해외 배송은 별도 문의
                </Typography>
              </div>
              <div>
                <Typography variant="body2" weight="semibold" className="mb-2">
                  배송 추적
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  발송 완료 시 운송장 번호가 문자로 발송됩니다
                </Typography>
              </div>
            </div>
          )}

          {activeTab === "refund" && (
            <div className="space-y-6">
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
                  <br />
                  • 경매 상품 특성상 부분 환불 불가
                  <br />• 사용 흔적이 있거나 택이 제거된 경우 교환/환불 불가
                </Typography>
              </div>
              <div>
                <Typography variant="body2" weight="semibold" className="mb-2">
                  환불 처리 기간
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  • 반품 상품 도착 후 영업일 기준 3일 이내 검수
                  <br />• 검수 완료 후 영업일 기준 2일 이내 환불 처리
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
              <a
                key={item.product_id}
                href={`/products/${item.product_id}`}
                className="group"
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
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Store className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div>
                  <Typography variant="caption" className="text-gray-500 mb-1">
                    {item.popup_store_name}
                  </Typography>
                  <Typography variant="body2" className="line-clamp-2 mb-2">
                    {item.product_name}
                  </Typography>
                  <Typography variant="body2" weight="semibold">
                    {formatCurrency(
                      item.current_highest_bid || item.buy_now_price || 0
                    )}
                  </Typography>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
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
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-5 w-3/4" />
          </div>

          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-24" />
          <Skeleton className="h-14 rounded-lg" />
        </div>
      </div>

      <div className="mt-12">
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}
