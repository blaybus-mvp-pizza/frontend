"use client";
import { Typography } from "@workspace/ui/components/typography";
import { ProductSampleList } from "@workspace/ui/components/product/product-sample-list";
import { Product, Auction } from "@workspace/ui/types";
import { MapIcon } from "lucide-react";
import { ProductCard } from "@workspace/ui/components/product-card";
import Image from "next/image";

const PRODUCT_TAGS = [
  { name: "가구/리빙", imgSrc: "/icons/가구리빙.png" },
  { name: "키친/테이블웨어", imgSrc: "/icons/키친테이블웨어.png" },
  { name: "디지털/가전", imgSrc: "/icons/디지털가전.png" },
  { name: "패션/잡화", imgSrc: "/icons/패션잡화.png" },
  { name: "아트/컬렉터블", imgSrc: "/icons/아트컬렉터블.png" },
  { name: "조명/소품", imgSrc: "/icons/조명소품.png" },
  { name: "오피스/비즈니스", imgSrc: "/icons/오피스비즈니스.png" },
];

// 예시 데이터
const mockProducts: Product[] = [
  {
    id: 1,
    popupStoreId: 1,
    category: "아트/컬렉터블",
    name: "빈티지 LP 플레이어 한정판",
    summary: "1970년대 클래식 턴테이블 복원품",
    description: "완벽하게 복원된 빈티지 LP 플레이어입니다.",
    price: 850000,
    stock: 1,
    shippingBaseFee: 5000,
    shippingFreeThreshold: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      {
        id: 1,
        productId: 1,
        imageUrl: "https://picsum.photos/400/400?random=1",
        sortOrder: 0,
      },
    ],
    tags: [
      { id: 1, name: "빈티지" },
      { id: 2, name: "음향기기" },
      { id: 3, name: "한정판" },
    ],
    popupStore: {
      id: 1,
      name: "레트로 사운드 팝업",
      createdAt: new Date(),
    },
  },
  {
    id: 2,
    popupStoreId: 2,
    category: "패션/잡화",
    name: "수제 가죽 크로스백",
    summary: "이탈리아 장인이 만든 프리미엄 가죽백",
    description: "100% 수제작 가죽 크로스백",
    price: 320000,
    stock: 5,
    shippingBaseFee: 3000,
    shippingFreeThreshold: 50000,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      {
        id: 2,
        productId: 2,
        imageUrl: "https://picsum.photos/400/400?random=2",
        sortOrder: 0,
      },
    ],
    tags: [
      { id: 4, name: "가죽" },
      { id: 5, name: "수제" },
    ],
    popupStore: {
      id: 2,
      name: "아르티장 컬렉션",
      createdAt: new Date(),
    },
  },
  {
    id: 3,
    popupStoreId: 3,
    category: "키친/테이블웨어",
    name: "도자기 티세트 (6인용)",
    summary: "핸드메이드 청자 티세트",
    description: "전통 기법으로 제작된 청자 티세트",
    price: 180000,
    stock: 3,
    shippingBaseFee: 4000,
    shippingFreeThreshold: 100000,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      {
        id: 3,
        productId: 3,
        imageUrl: "https://picsum.photos/400/400?random=3",
        sortOrder: 0,
      },
    ],
    tags: [
      { id: 6, name: "도자기" },
      { id: 7, name: "티세트" },
    ],
    popupStore: {
      id: 3,
      name: "청자 공방",
      createdAt: new Date(),
    },
  },
  {
    id: 4,
    popupStoreId: 4,
    category: "가구/리빙",
    name: "북유럽 스타일 원목 사이드 테이블",
    summary: "미니멀한 디자인의 원목 테이블",
    description: "천연 원목으로 제작된 사이드 테이블",
    price: 220000,
    stock: 10,
    shippingBaseFee: 8000,
    shippingFreeThreshold: 200000,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      {
        id: 4,
        productId: 4,
        imageUrl: "https://picsum.photos/400/400?random=4",
        sortOrder: 0,
      },
    ],
    tags: [
      { id: 8, name: "원목" },
      { id: 9, name: "북유럽" },
    ],
    popupStore: {
      id: 4,
      name: "스칸디나비안 하우스",
      createdAt: new Date(),
    },
  },
];

const mockAuctions: Auction[] = [
  {
    id: 1,
    productId: 1,
    startPrice: 500000,
    minBidPrice: 10000,
    buyNowPrice: 1200000,
    depositAmount: 50000,
    startsAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1일 전 시작
    endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2일 후 종료
    status: "running",
    createdAt: new Date(),
    updatedAt: new Date(),
    currentBid: {
      id: 1,
      auctionId: 1,
      userId: 1,
      bidOrder: 1,
      amount: 750000,
      createdAt: new Date(),
    },
    bidCount: 12,
  },
  {
    id: 2,
    productId: 2,
    startPrice: 200000,
    minBidPrice: 5000,
    buyNowPrice: 400000,
    depositAmount: 20000,
    startsAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1일 후 시작
    endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 후 종료
    status: "scheduled",
    createdAt: new Date(),
    updatedAt: new Date(),
    bidCount: 0,
  },
  {
    id: 3,
    productId: 3,
    startPrice: 100000,
    minBidPrice: 5000,
    depositAmount: 10000,
    startsAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7일 전 시작
    endsAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1일 전 종료
    status: "ended",
    createdAt: new Date(),
    updatedAt: new Date(),
    currentBid: {
      id: 2,
      auctionId: 3,
      userId: 2,
      bidOrder: 1,
      amount: 195000,
      createdAt: new Date(),
    },
    bidCount: 8,
  },
];

export default function HomePage() {
  const handleProductClick = (productId: number) => {
    console.log(`Clicked product ${productId}`);
  };

  const handleViewAllClick = () => {
    console.log("View all clicked");
  };

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
          products={mockProducts}
          auctions={mockAuctions}
          title="지금 놓치면 사라져요!"
          subtitle="마감임박 상품"
          showViewAll={true}
          showTimeLeft={true}
          onProductClick={handleProductClick}
          onViewAllClick={handleViewAllClick}
        />
        <ProductSampleList
          products={mockProducts}
          auctions={mockAuctions}
          title="알찬 상품만 추렸어요!"
          subtitle="MD`S Pick"
          showViewAll={true}
          showTimeLeft={true}
          onProductClick={handleProductClick}
          onViewAllClick={handleViewAllClick}
        />
        <ProductSampleList
          products={mockProducts}
          auctions={mockAuctions}
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
        <div className=" flex h-[400px] gap-x-8">
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
            <ProductCard
              product={{
                id: 101,
                popupStoreId: 10,
                category: "키친/테이블웨어",
                name: "카누 시그니처 블렌드",
                summary: "프리미엄 원두 선물세트",
                description: "엄선된 원두로 만든 카누 시그니처 블렌드",
                price: 89000,
                stock: 5,
                shippingBaseFee: 3000,
                shippingFreeThreshold: 50000,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                images: [
                  {
                    id: 101,
                    productId: 101,
                    imageUrl: "https://picsum.photos/400/400?random=10",
                    sortOrder: 0,
                  },
                ],
                tags: [
                  { id: 101, name: "한정판" },
                  { id: 102, name: "프리미엄" },
                ],
                popupStore: {
                  id: 10,
                  name: "카누 온더 테이블",
                  createdAt: new Date(),
                },
              }}
              auction={{
                id: 101,
                productId: 101,
                startPrice: 70000,
                minBidPrice: 5000,
                buyNowPrice: 120000,
                depositAmount: 10000,
                startsAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
                endsAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
                status: "running",
                createdAt: new Date(),
                updatedAt: new Date(),
                currentBid: {
                  id: 101,
                  auctionId: 101,
                  userId: 1,
                  bidOrder: 1,
                  amount: 85000,
                  createdAt: new Date(),
                },
                bidCount: 8,
              }}
              showTimeLeft={true}
              onClick={() => console.log("카누 시그니처 블렌드 클릭")}
            />

            <ProductCard
              product={{
                id: 102,
                popupStoreId: 10,
                category: "키친/테이블웨어",
                name: "카누 텀블러 세트",
                summary: "보온보냉 스테인리스 텀블러",
                description: "카누 로고가 새겨진 프리미엄 텀블러 세트",
                price: 45000,
                stock: 12,
                shippingBaseFee: 3000,
                shippingFreeThreshold: 50000,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                images: [
                  {
                    id: 102,
                    productId: 102,
                    imageUrl: "https://picsum.photos/400/400?random=11",
                    sortOrder: 0,
                  },
                ],
                tags: [
                  { id: 103, name: "텀블러" },
                  { id: 104, name: "선물세트" },
                ],
                popupStore: {
                  id: 10,
                  name: "카누 온더 테이블",
                  createdAt: new Date(),
                },
              }}
              showTimeLeft={false}
              onClick={() => console.log("카누 텀블러 세트 클릭")}
            />
          </div>
        </div>
      </div>
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
        <div className=" flex h-[400px] gap-x-8">
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
            <ProductCard
              product={{
                id: 101,
                popupStoreId: 10,
                category: "키친/테이블웨어",
                name: "카누 시그니처 블렌드",
                summary: "프리미엄 원두 선물세트",
                description: "엄선된 원두로 만든 카누 시그니처 블렌드",
                price: 89000,
                stock: 5,
                shippingBaseFee: 3000,
                shippingFreeThreshold: 50000,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                images: [
                  {
                    id: 101,
                    productId: 101,
                    imageUrl: "https://picsum.photos/400/400?random=10",
                    sortOrder: 0,
                  },
                ],
                tags: [
                  { id: 101, name: "한정판" },
                  { id: 102, name: "프리미엄" },
                ],
                popupStore: {
                  id: 10,
                  name: "카누 온더 테이블",
                  createdAt: new Date(),
                },
              }}
              auction={{
                id: 101,
                productId: 101,
                startPrice: 70000,
                minBidPrice: 5000,
                buyNowPrice: 120000,
                depositAmount: 10000,
                startsAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
                endsAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
                status: "running",
                createdAt: new Date(),
                updatedAt: new Date(),
                currentBid: {
                  id: 101,
                  auctionId: 101,
                  userId: 1,
                  bidOrder: 1,
                  amount: 85000,
                  createdAt: new Date(),
                },
                bidCount: 8,
              }}
              showTimeLeft={true}
              onClick={() => console.log("카누 시그니처 블렌드 클릭")}
            />

            <ProductCard
              product={{
                id: 102,
                popupStoreId: 10,
                category: "키친/테이블웨어",
                name: "카누 텀블러 세트",
                summary: "보온보냉 스테인리스 텀블러",
                description: "카누 로고가 새겨진 프리미엄 텀블러 세트",
                price: 45000,
                stock: 12,
                shippingBaseFee: 3000,
                shippingFreeThreshold: 50000,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                images: [
                  {
                    id: 102,
                    productId: 102,
                    imageUrl: "https://picsum.photos/400/400?random=11",
                    sortOrder: 0,
                  },
                ],
                tags: [
                  { id: 103, name: "텀블러" },
                  { id: 104, name: "선물세트" },
                ],
                popupStore: {
                  id: 10,
                  name: "카누 온더 테이블",
                  createdAt: new Date(),
                },
              }}
              showTimeLeft={false}
              onClick={() => console.log("카누 텀블러 세트 클릭")}
            />
          </div>
        </div>
      </div>
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
