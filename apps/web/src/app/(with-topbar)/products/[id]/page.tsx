"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { useProduct, useAuctionByProduct } from "@/hooks/queries/useProducts";
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
  Minus
} from "lucide-react";
import { formatCurrency } from "@workspace/ui/lib/utils";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "shipping" | "refund">("details");
  
  const { data: product, isLoading: productLoading } = useProduct(productId);
  const { data: auction, isLoading: auctionLoading } = useAuctionByProduct(productId);

  // Calculate time remaining
  const getTimeRemaining = () => {
    if (!auction?.endsAt) return null;
    
    const now = new Date();
    const endTime = new Date(auction.endsAt);
    const diff = endTime.getTime() - now.getTime();
    
    if (diff <= 0) return "종료됨";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}일 ${hours}시간 남음`;
    if (hours > 0) return `${hours}시간 ${minutes}분 남음`;
    return `${minutes}분 남음`;
  };

  const handleBidAmountChange = (amount: number) => {
    const currentBid = Number(bidAmount) || (auction?.currentBid?.amount || auction?.startPrice || 0);
    const newAmount = Math.max(0, currentBid + amount);
    setBidAmount(String(newAmount));
  };

  if (productLoading || auctionLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Typography variant="h3" className="mb-2">상품을 찾을 수 없습니다</Typography>
          <Typography variant="body2" className="text-gray-500">
            요청하신 상품이 존재하지 않거나 삭제되었습니다.
          </Typography>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "홈", href: "/home" },
    { label: product.category, href: `/products?category=${product.category}` },
    { label: product.name }
  ];

  const minBidPrice = auction?.minBidPrice || 10000;
  const currentPrice = auction?.currentBid?.amount || auction?.startPrice || product.price;

  return (
    <div className="max-w-7xl mx-auto py-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} className="mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.images[selectedImageIndex]?.imageUrl || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover"
            />
            
            {/* Image Navigation */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                  disabled={selectedImageIndex === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur rounded-full p-2 shadow-lg disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedImageIndex(Math.min(product.images.length - 1, selectedImageIndex + 1))}
                  disabled={selectedImageIndex === product.images.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur rounded-full p-2 shadow-lg disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    "relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0",
                    selectedImageIndex === index ? "border-black" : "border-gray-200"
                  )}
                >
                  <Image
                    src={image.imageUrl}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="space-y-6">
          {/* Title and Actions */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <Typography variant="caption" className="text-brand-mint font-medium">
                  {product.popupStore?.name}
                </Typography>
                <Typography variant="h2" className="mt-1">
                  {product.name}
                </Typography>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <Typography variant="body2" className="text-gray-600">
              {product.summary}
            </Typography>
          </div>

          {/* Auction Status */}
          {auction && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <Typography variant="body2" className="text-gray-600">
                    남은 시간
                  </Typography>
                </div>
                <Typography variant="body1" weight="semibold" className="text-red-600">
                  {getTimeRemaining()}
                </Typography>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <Typography variant="body2" className="text-gray-600">
                    입찰 참여
                  </Typography>
                </div>
                <Typography variant="body1" weight="semibold">
                  {auction.bidCount || 0}명
                </Typography>
              </div>
            </div>
          )}

          {/* Current Price */}
          <div className="space-y-4">
            <div>
              <Typography variant="body2" className="text-gray-600 mb-1">
                현재가
              </Typography>
              <div className="flex items-baseline gap-2">
                <Typography variant="h2" weight="bold">
                  {formatCurrency(currentPrice)}
                </Typography>
                {auction?.startPrice && currentPrice > auction.startPrice && (
                  <Typography variant="body2" className="text-green-600">
                    +{formatCurrency(currentPrice - auction.startPrice)}
                  </Typography>
                )}
              </div>
            </div>

            {/* Bid Input */}
            {auction && auction.status === "running" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBidAmountChange(-minBidPrice)}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    value={bidAmount || currentPrice + minBidPrice}
                    onChange={(e) => setBidAmount(e.target.value.replace(/[^0-9]/g, ""))}
                    className="flex-1 px-4 py-3 text-center border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-mint"
                  />
                  <button
                    onClick={() => handleBidAmountChange(minBidPrice)}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <Typography variant="caption" className="text-gray-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  최소 입찰 단위: {formatCurrency(minBidPrice)}
                </Typography>
              </div>
            )}

            {/* Buy Now Price */}
            {auction?.buyNowPrice && (
              <div className="flex items-center justify-between p-3 bg-brand-mint/10 rounded-lg">
                <Typography variant="body2" className="text-gray-700">
                  즉시구매가
                </Typography>
                <Typography variant="body1" weight="semibold">
                  {formatCurrency(auction.buyNowPrice)}
                </Typography>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {auction && auction.status === "running" ? (
              <>
                <Button 
                  size="lg" 
                  className="flex-1"
                  onClick={() => console.log("입찰하기", bidAmount)}
                >
                  입찰하기
                </Button>
                {auction.buyNowPrice && (
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="flex-1"
                    onClick={() => console.log("즉시구매")}
                  >
                    즉시구매
                  </Button>
                )}
              </>
            ) : (
              <Button size="lg" className="flex-1" disabled>
                {auction?.status === "ended" ? "경매 종료" : "경매 예정"}
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
            <div className="prose max-w-none">
              <Typography variant="body1" className="whitespace-pre-wrap">
                {product.description}
              </Typography>
              
              {product.tags && product.tags.length > 0 && (
                <div className="mt-6">
                  <Typography variant="body2" weight="semibold" className="mb-2">
                    태그
                  </Typography>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === "shipping" && (
            <div className="space-y-4">
              <div>
                <Typography variant="body2" weight="semibold" className="mb-2">
                  배송비
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {product.shippingBaseFee === 0 
                    ? "무료배송" 
                    : `${formatCurrency(product.shippingBaseFee)} (${formatCurrency(product.shippingFreeThreshold)} 이상 무료)`}
                </Typography>
              </div>
              <div>
                <Typography variant="body2" weight="semibold" className="mb-2">
                  배송 기간
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  경매 종료 후 3-5일 이내 발송
                </Typography>
              </div>
            </div>
          )}
          
          {activeTab === "refund" && (
            <div className="space-y-4">
              <Typography variant="body2" className="text-gray-600">
                • 상품 수령 후 7일 이내 교환/환불 가능
                <br />
                • 단순 변심의 경우 왕복 배송비 구매자 부담
                <br />
                • 상품 하자의 경우 판매자가 배송비 부담
                <br />
                • 경매 상품 특성상 부분 환불 불가
              </Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto py-6">
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

// Helper function
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}