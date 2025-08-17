"use client";
import { Typography } from "@workspace/ui/components/typography";
import { ProductSampleList } from "@workspace/ui/components/product/product-sample-list";
import { Product, Auction } from "@workspace/ui/types";

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
    // TODO: Navigate to product detail page
  };

  const handleViewAllClick = () => {
    console.log("View all clicked");
    // TODO: Navigate to products list page
  };

  return (
    <div className="space-y-8 pt-2">
      <div className="w-full h-[380px] rounded-2xl bg-gradient-to-b from-gray-200 to-gray-600"></div>

      {/* 카테고리 태그 */}
      <div className="w-full grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2 h-auto lg:h-[110px]">
        {PRODUCT_TAGS.map((v) => (
          <div
            className="bg-[#f6f6f6] rounded-lg p-4 flex flex-col items-center gap-3 hover:bg-[#ececec] transition-colors cursor-pointer"
            key={v.name}
          >
            <img
              src={v.imgSrc}
              alt={v.name}
              className="w-12 h-12 object-contain"
            />
            <Typography
              variant="body3"
              align="center"
              weight="medium"
              color="muted"
            >
              {v.name}
            </Typography>
          </div>
        ))}
      </div>

      {/* 상품 리스트 섹션 */}
      <div className="space-y-20 mt-20">
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
    </div>
  );
}
