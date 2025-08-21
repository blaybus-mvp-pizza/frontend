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
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Store,
  Calendar,
} from "lucide-react";
import { formatCurrency } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Typography } from "@workspace/ui/components/typography";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductDetail } from "@/hooks/queries/useProductDetail";
import type { BidItem } from "@/types/api";
import { cn } from "@/utils/cn";

interface ProductDetailPageProps {
  productId: number;
}

// Helper function for time remaining
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

      if (days > 0) {
        setTimeRemaining(`${days}일 ${hours}시간 ${minutes}분`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}시간 ${minutes}분`);
      } else {
        setTimeRemaining(`${minutes}분`);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [endsAt]);

  return (
    <span className="font-semibold text-red-600">
      {timeRemaining || "계산 중..."}
    </span>
  );
}

export default function ProductDetailPage({
  productId,
}: ProductDetailPageProps) {
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [bidAmount, setBidAmount] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"description" | "reviews" | "qa">(
    "description"
  );

  const { product, auction, bids, similar, isLoading } =
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

  const handleBidAmountChange = (direction: number) => {
    if (!auction) return;
    const currentAmount = bidAmount || auction.start_price;
    const newAmount = Math.max(
      auction.min_bid_price,
      currentAmount + direction * auction.min_bid_price
    );
    setBidAmount(newAmount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <button
          onClick={() => router.push("/")}
          className="hover:text-gray-800"
        >
          홈
        </button>
        <span>{">"}</span>
        <span>{product.category || "가전/리빙"}</span>
        <span>{">"}</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Image Gallery */}
        <div>
          {/* Main Image */}
          <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4">
            <Image
              src={product.images?.[selectedImageIndex] || "/placeholder.png"}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-full object-cover"
              priority
            />
          </div>

          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    "aspect-square bg-gray-50 rounded overflow-hidden border-2 transition-all",
                    selectedImageIndex === index
                      ? "border-black"
                      : "border-transparent hover:border-gray-300"
                  )}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Product Info Tabs */}
          <div className="mt-8">
            <div className="flex gap-8 border-b">
              <button
                onClick={() => setActiveTab("description")}
                className={cn(
                  "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                  activeTab === "description"
                    ? "border-black text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                상품정보
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={cn(
                  "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                  activeTab === "reviews"
                    ? "border-black text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                리뷰 ({bids?.total || 0})
              </button>
              <button
                onClick={() => setActiveTab("qa")}
                className={cn(
                  "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                  activeTab === "qa"
                    ? "border-black text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                문의 (5)
              </button>
            </div>

            <div className="py-6">
              {activeTab === "description" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">상품 사양</h3>
                    <table className="w-full text-sm">
                      <tbody>
                        {product.specs?.material && (
                          <tr className="border-b">
                            <td className="py-3 text-gray-600 w-32">소재</td>
                            <td className="py-3">{product.specs.material}</td>
                          </tr>
                        )}
                        {product.specs?.place_of_use && (
                          <tr className="border-b">
                            <td className="py-3 text-gray-600">사용 장소</td>
                            <td className="py-3">
                              {product.specs.place_of_use}
                            </td>
                          </tr>
                        )}
                        {(product.specs?.width_cm ||
                          product.specs?.height_cm) && (
                          <tr className="border-b">
                            <td className="py-3 text-gray-600">크기 (W×H)</td>
                            <td className="py-3">
                              {product.specs.width_cm}cm ×{" "}
                              {product.specs.height_cm}cm
                            </td>
                          </tr>
                        )}
                        {product.specs?.tolerance_cm && (
                          <tr className="border-b">
                            <td className="py-3 text-gray-600">오차 범위</td>
                            <td className="py-3">
                              ±{product.specs.tolerance_cm}cm
                            </td>
                          </tr>
                        )}
                        {product.specs?.edition_info && (
                          <tr className="border-b">
                            <td className="py-3 text-gray-600">에디션</td>
                            <td className="py-3">
                              {product.specs.edition_info}
                            </td>
                          </tr>
                        )}
                        {product.specs?.condition_note && (
                          <tr className="border-b">
                            <td className="py-3 text-gray-600">컨디션</td>
                            <td className="py-3">
                              {product.specs.condition_note}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">제품 특징</h3>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• 100% 천연 오크 원목 사용</li>
                      <li>• 친환경 수성 도료로 마감 처리</li>
                      <li>• 조립식 구조로 이동 및 보관이 용이</li>
                      <li>• 북유럽 스타일의 미니멀한 디자인</li>
                      <li>• 다양한 공간에 어울리는 컴팩트한 사이즈</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">배송/교환/환불</h3>
                    <div className="text-sm text-gray-700 space-y-2">
                      <p>
                        <strong>배송비:</strong> 무료배송
                      </p>
                      <p>
                        <strong>배송기간:</strong> 결제 완료 후 2-3일 이내
                        (주말/공휴일 제외)
                      </p>
                      <p>
                        <strong>교환/환불:</strong> 상품 수령 후 7일 이내 가능
                        (단순 변심 시 왕복 배송비 구매자 부담)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="text-center py-8 text-gray-500">
                  아직 리뷰가 없습니다.
                </div>
              )}

              {activeTab === "qa" && (
                <div className="text-center py-8 text-gray-500">
                  아직 문의가 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Product Details & Purchase */}
        <div>
          {/* Category Tags */}
          <div className="flex gap-2 mb-4">
            {product.tags?.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs border border-gray-300 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Product Title */}
          <h1 className="text-2xl font-bold mb-2">
            {product.title || product.name}
          </h1>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Store Info */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={product.store?.image_url || "/placeholder.png"}
                  alt={product.store?.name}
                  className="w-12 h-12 rounded"
                />
                <div>
                  <p className="font-semibold">{product.store?.name}</p>
                  <p className="text-sm text-gray-600">
                    {product.store?.description}
                  </p>
                </div>
              </div>
              <button className="text-gray-400">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Price Info */}
          <div className="border-t border-b py-4 mb-6">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-sm text-gray-600">현재가</span>
              <div className="text-right">
                <span className="text-2xl font-bold">
                  {formatCurrency(currentPrice)}
                </span>
                <span className="text-sm text-green-600 ml-2">최소 입찰가</span>
              </div>
            </div>
          </div>

          {/* Bid Amount Control */}
          {isAuctionActive && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">입찰 금액</p>
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => handleBidAmountChange(-1)}
                  className="w-10 h-10 border rounded flex items-center justify-center hover:bg-gray-50"
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
                  className="flex-1 px-4 py-2 border rounded text-center font-semibold"
                />
                <button
                  onClick={() => handleBidAmountChange(1)}
                  className="w-10 h-10 border rounded flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500">
                * 최소 입찰 단위:{" "}
                {formatCurrency(auction?.min_bid_price || 5000)}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            {isAuctionActive ? (
              <>
                <button className="flex-1 py-3 bg-black text-white rounded font-semibold hover:bg-gray-800">
                  입찰하기
                </button>
                {auction?.buy_now_price && (
                  <button className="flex-1 py-3 border border-black rounded font-semibold hover:bg-gray-50">
                    즉시 구매하기
                  </button>
                )}
              </>
            ) : auction?.status === "SCHEDULED" ? (
              <button
                className="flex-1 py-3 bg-gray-300 text-gray-500 rounded font-semibold"
                disabled
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                경매 예정
              </button>
            ) : (
              <button
                className="flex-1 py-3 bg-gray-300 text-gray-500 rounded font-semibold"
                disabled
              >
                경매 종료
              </button>
            )}
          </div>

          {/* Auction Info */}
          {auction && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">남은 시간</span>
                  {auction.status === "RUNNING" && (
                    <TimeRemaining endsAt={auction.ends_at} />
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">입찰 참여</span>
                  <span className="font-semibold">
                    {auction.bidder_count}명
                  </span>
                </div>
                {auction.buy_now_price && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">즉시구매가</span>
                    <span className="font-semibold">
                      {formatCurrency(auction.buy_now_price)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bid History */}
          {bids && bids.items && bids.items.length > 0 && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-4 flex items-center justify-between">
                입찰 내역
                <span className="text-sm font-normal text-gray-600">
                  총 {bids.total}건
                </span>
              </h3>
              <div className="space-y-3">
                {bids.items.slice(0, 3).map((bid: BidItem, index: number) => (
                  <div
                    key={`${bid.user.id}-${bid.bid_at}`}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                        {bid.user.profile_image ? (
                          <img
                            src={bid.user.profile_image}
                            alt={bid.user.name || "User"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {bid.user.name || `사용자 ${bid.user.id}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(bid.bid_at).toLocaleString("ko-KR")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(bid.bid_amount)}
                      </p>
                      {index === 0 && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                          최고입찰
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {bids.total > 3 && (
                <button className="w-full mt-4 py-2 bg-gray-100 text-sm font-medium rounded hover:bg-gray-200">
                  입찰내역 더보기
                </button>
              )}
            </div>
          )}

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-blue-900 mb-1">
                  이 상품 낙찰 시 혜택
                </p>
                <p className="text-blue-700">무료 배송 + 나팔 포인트 1% 적립</p>
                <p className="text-xs text-blue-600 mt-1">
                  * 혜택은 상황에 따라 변경될 수 있습니다
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {similar && similar.items && similar.items.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold mb-6">이 상품과 유사한 상품</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {similar.items.slice(0, 4).map((item) => (
              <button
                key={item.product_id}
                onClick={() => router.push(`/products/${item.product_id}`)}
                className="text-left group"
              >
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                  <img
                    src={item.representative_image || "/placeholder.png"}
                    alt={item.product_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <p className="text-xs text-gray-600 mb-1">
                  {item.popup_store_name}
                </p>
                <p className="text-sm font-medium mb-2 line-clamp-2">
                  {item.product_name}
                </p>
                <p className="font-bold">
                  {formatCurrency(
                    item.current_highest_bid || item.buy_now_price || 0
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  입찰 {Math.floor(Math.random() * 10) + 1}명 ·{" "}
                  {Math.floor(Math.random() * 3) + 1}일 남음
                </p>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-20" />
          <Skeleton className="h-32" />
          <Skeleton className="h-14" />
        </div>
      </div>
    </div>
  );
}
