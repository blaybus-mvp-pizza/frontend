"use client";
import { Typography } from "@workspace/ui/components/typography";
import { ProductSampleList } from "@workspace/ui/components/product/product-sample-list";
import { MapIcon } from "lucide-react";
import { ProductCard } from "@workspace/ui/components/product-card";
import Image from "next/image";
import {
  useFeaturedProducts,
  usePopupStoreProducts,
} from "@/hooks/queries/useProducts";
import {
  Skeleton,
  ProductListSkeleton,
  CategoryTagSkeleton,
  PopupStoreSectionSkeleton,
} from "@/components/ui/skeleton";

const PRODUCT_TAGS = [
  { name: "가구/리빙", imgSrc: "/icons/가구리빙.png" },
  { name: "키친/테이블웨어", imgSrc: "/icons/키친테이블웨어.png" },
  { name: "디지털/가전", imgSrc: "/icons/디지털가전.png" },
  { name: "패션/잡화", imgSrc: "/icons/패션잡화.png" },
  { name: "아트/컬렉터블", imgSrc: "/icons/아트컬렉터블.png" },
  { name: "조명/소품", imgSrc: "/icons/조명소품.png" },
  { name: "오피스/비즈니스", imgSrc: "/icons/오피스비즈니스.png" },
];

export default function HomePage() {
  // Fetch featured products data using React Query
  const { data: featuredData, isLoading: featuredLoading } =
    useFeaturedProducts();

  // Fetch Kanu popup store products (ID: 10)
  const { data: kanuData, isLoading: kanuLoading } = usePopupStoreProducts(10);

  const handleProductClick = (productId: number) => {
    console.log(`Clicked product ${productId}`);
  };

  const handleViewAllClick = () => {
    console.log("View all clicked");
  };

  // Show skeleton loading state
  if (featuredLoading || kanuLoading) {
    return (
      <div className="min-h-screen">
        {/* 히어로 배너 skeleton */}
        <div className="w-full">
          <Skeleton className="w-full h-[200px] sm:h-[280px] md:h-[380px] rounded-md md:rounded-lg mt-4 md:mt-6" />
        </div>

        {/* 카테고리 태그 skeleton */}
        <div className="mt-6 md:mt-8">
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 md:gap-3">
            {[...Array(7)].map((_, index) => (
              <CategoryTagSkeleton key={index} />
            ))}
          </div>
        </div>

        {/* 상품 리스트 섹션 skeleton */}
        <div className="space-y-12 md:space-y-16 lg:space-y-20 mt-8 md:mt-12 lg:mt-16 pb-8 md:pb-12 lg:pb-16">
          <ProductListSkeleton />
          <ProductListSkeleton />
          <ProductListSkeleton />
        </div>

        {/* 배너 skeleton */}
        <Skeleton className="w-full h-40 mt-8" />

        {/* Kanu popup store skeleton */}
        <PopupStoreSectionSkeleton />

        {/* 하단 배너 skeleton */}
        <Skeleton className="w-full h-60 mt-20" />
      </div>
    );
  }

  // Extract data with fallbacks
  const urgentProducts = featuredData?.urgentProducts || [];
  const mdPicks = featuredData?.mdPicks || [];
  const newProducts = featuredData?.newProducts || [];
  const auctions = featuredData?.auctions || [];
  const kanuProducts = kanuData?.products || [];
  const kanuAuctions = kanuData?.auctions || [];

  return (
    <div className="min-h-screen">
      {/* 히어로 배너 */}
      <div className="w-full">
        <div className="w-full h-[200px] sm:h-[280px] md::h-[380px] rounded-md md:rounded-lg bg-gradient-to-b from-gray-200 to-gray-600 mt-4 md:mt-6"></div>
      </div>

      {/* 카테고리 태그 */}
      <div className="mt-6 md:mt-8">
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 md:gap-3">
          {PRODUCT_TAGS.map((v) => (
            <div
              className="bg-[#f6f6f6] rounded-lg p-2 sm:p-3 md:p-4 flex flex-col items-center gap-1 sm:gap-2 md:gap-3 hover:bg-[#ececec] transition-colors cursor-pointer"
              key={v.name}
            >
              <Image
                src={v.imgSrc}
                alt={v.name}
                width={48}
                height={48}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"
                loading="lazy"
              />
              <Typography
                variant="caption"
                align="center"
                weight="medium"
                color="muted"
                className="text-[10px] sm:text-xs md:text-sm"
              >
                {v.name}
              </Typography>
            </div>
          ))}
        </div>
      </div>

      {/* 상품 리스트 섹션 */}
      <div className="space-y-12 md:space-y-16 lg:space-y-20 mt-8 md:mt-12 lg:mt-16 pb-8 md:pb-12 lg:pb-16">
        <ProductSampleList
          products={urgentProducts}
          auctions={auctions}
          title="지금 놓치면 사라져요!"
          subtitle="마감임박 상품"
          showViewAll={true}
          showTimeLeft={true}
          onProductClick={handleProductClick}
          onViewAllClick={handleViewAllClick}
        />
        <ProductSampleList
          products={mdPicks}
          auctions={auctions}
          title="알찬 상품만 추렸어요!"
          subtitle="MD`S Pick"
          showViewAll={true}
          showTimeLeft={true}
          onProductClick={handleProductClick}
          onViewAllClick={handleViewAllClick}
        />
        <ProductSampleList
          products={newProducts}
          auctions={auctions}
          title="따끈따근 새롭게 올라온"
          subtitle="신규 상품!"
          showViewAll={true}
          showTimeLeft={true}
          onProductClick={handleProductClick}
          onViewAllClick={handleViewAllClick}
        />
      </div>

      <div onClick={() => {}} className="relative h-40">
        <Image
          alt="배너1"
          src="/images/BANNER_OPEN.png"
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
          loading="lazy"
        />
      </div>

      {/* Kanu Popup Store Section 1 */}
      {kanuProducts.length > 0 && (
        <div className="w-full space-y-2 mt-20">
          <div className="mt-8 flex gap-x-2 items-center">
            <span className="bg-black text-brand-mint items-center p-1 w-fit flex gap-x-2">
              <MapIcon />
              <Typography className="text-brand-mint font-semibold md:text-xl">
                카누 온더 테이블
              </Typography>
            </span>
            <Typography variant={"h6"} className="md:text-xl font-semibold">
              팝업스토어에서 판매중인 아이템
            </Typography>
          </div>
          <div className="flex h-[400px] gap-x-8">
            <div className="relative w-[600px] h-[400px]">
              <Image
                src="/images/KANU_POPUP_THUMBNAIL.png"
                alt="카누 팝업 썸네일"
                fill
                className="object-cover"
                sizes="600px"
                loading="lazy"
              />
            </div>
            <div className="flex gap-4">
              {kanuProducts.slice(0, 2).map((product) => {
                const auction = kanuAuctions.find(
                  (a) => a.productId === product.id
                );
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    auction={auction}
                    showTimeLeft={!!auction}
                    onClick={() => handleProductClick(product.id)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {kanuProducts.length > 2 && (
        <div className="w-full space-y-2 mt-20">
          <div className="mt-8 flex gap-x-2 items-center">
            <span className="bg-black text-brand-mint items-center p-1 w-fit flex gap-x-2">
              <MapIcon />
              <Typography className="text-brand-mint font-semibold md:text-xl">
                카누 온더 테이블
              </Typography>
            </span>
            <Typography variant={"h6"} className="md:text-xl font-semibold">
              팝업스토어에서 판매중인 아이템
            </Typography>
          </div>
          <div className="flex h-[400px] gap-x-8">
            <div className="relative w-[600px] h-[400px]">
              <Image
                src="/images/KANU_POPUP_THUMBNAIL.png"
                alt="카누 팝업 썸네일"
                fill
                className="object-cover"
                sizes="600px"
                loading="lazy"
              />
            </div>
            <div className="flex gap-4">
              {kanuProducts.slice(0, 2).map((product) => {
                const auction = kanuAuctions.find(
                  (a) => a.productId === product.id
                );
                return (
                  <ProductCard
                    key={`dup-${product.id}`}
                    product={product}
                    auction={auction}
                    showTimeLeft={!!auction}
                    onClick={() => handleProductClick(product.id)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div onClick={() => {}} className="relative h-60 mt-20">
        <Image
          alt="배너2"
          src="/images/BANNER_2.png"
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
          loading="lazy"
        />
      </div>
    </div>
  );
}
