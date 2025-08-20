import { Product, Auction } from "@workspace/ui/types";

// Mock delay to simulate API call
const mockDelay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Interface for paginated response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Interface for product filters
export interface ProductFilters {
  content?: string;
  category?: string;
  status?: string;
  bidders?: string;
  price?: string;
  sort?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

// Generate more mock products for realistic pagination
const generateMockProducts = (): Product[] => {
  const categories = [
    "아트/컬렉터블",
    "패션/잡화",
    "키친/테이블웨어",
    "가구/리빙",
    "뷰티",
    "테크",
  ];

  // More realistic product names by category
  const productNames = {
    "아트/컬렉터블": [
      "빈티지 LP 플레이어 한정판",
      "앤티크 브론즈 조각상",
      "리미티드 에디션 포스터",
      "수집가용 빈티지 카메라",
      "아트 프린트 세트",
      "한정판 피규어 컬렉션",
      "빈티지 포스터 프레임 세트",
      "레트로 라디오 복원품",
      "아티스트 사인 에디션",
    ],
    "패션/잡화": [
      "수제 가죽 크로스백",
      "프리미엄 캐시미어 스카프",
      "디자이너 선글라스",
      "한정판 스니커즈",
      "빈티지 데님 자켓",
      "수입 가죽 지갑",
      "핸드메이드 실버 팔찌",
      "캔버스 토트백",
      "울 베레모",
    ],
    "키친/테이블웨어": [
      "도자기 티세트 (6인용)",
      "스테인리스 커트러리 세트",
      "와인 디캔터 세트",
      "대리석 치즈 보드",
      "수제 도자기 머그컵",
      "유리 텀블러 세트",
      "원목 서빙 트레이",
      "프리미엄 커피 드리퍼",
      "세라믹 접시 세트",
    ],
    "가구/리빙": [
      "북유럽 스타일 원목 사이드 테이블",
      "미니멀 플로어 램프",
      "모듈러 책장",
      "인테리어 쿠션 세트",
      "대리석 화분",
      "벽걸이 거울",
      "원목 옷걸이 행거",
      "수납 바스켓 세트",
      "디자인 시계",
    ],
    뷰티: [
      "프리미엄 스킨케어 세트",
      "천연 향수 컬렉션",
      "수제 비누 선물세트",
      "뷰티 디바이스",
      "네일 아트 키트",
      "헤어 케어 에센스",
      "메이크업 브러시 세트",
      "아로마 캔들 세트",
      "바디 스크럽",
    ],
    테크: [
      "무선 충전 스탠드",
      "블루투스 스피커",
      "스마트 워치 스트랩",
      "노이즈 캔슬링 이어폰",
      "휴대용 프로젝터",
      "기계식 키보드",
      "웹캠 커버 세트",
      "태블릿 거치대",
      "스마트 홈 허브",
    ],
  };

  const summaries = {
    "아트/컬렉터블": [
      "수집가들의 필수 아이템",
      "한정 수량 특별 에디션",
      "예술적 가치가 있는 제품",
      "빈티지 컬렉터 아이템",
      "투자 가치가 있는 작품",
    ],
    "패션/잡화": [
      "일상을 특별하게 만드는 아이템",
      "프리미엄 소재로 제작",
      "장인의 손길이 느껴지는",
      "트렌디한 디자인",
      "실용성과 스타일을 겸비한",
    ],
    "키친/테이블웨어": [
      "품격있는 다이닝을 위한",
      "요리의 즐거움을 더하는",
      "특별한 날을 위한 준비",
      "매일 사용하고 싶은",
      "주방의 품격을 높이는",
    ],
    "가구/리빙": [
      "공간에 포인트를 주는",
      "실용적이고 아름다운",
      "인테리어의 완성",
      "편안한 일상을 위한",
      "미니멀한 디자인",
    ],
    뷰티: [
      "피부를 위한 특별한 선물",
      "자연에서 온 아름다움",
      "건강한 아름다움을 위한",
      "매일 사용하는 필수템",
      "선물하기 좋은",
    ],
    테크: [
      "스마트한 일상을 위한",
      "최신 기술이 적용된",
      "편리함을 더하는",
      "생산성을 높이는",
      "일상을 업그레이드하는",
    ],
  };

  const baseProducts: Product[] = [
    {
      id: 1,
      popupStoreId: 1,
      category: "아트/컬렉터블",
      name: "빈티지 LP 플레이어 한정판",
      summary: "1970년대 클래식 턴테이블 완벽 복원품",
      description: "완벽하게 복원된 빈티지 LP 플레이어입니다.",
      price: 850000,
      stock: 1,
      shippingBaseFee: 5000,
      shippingFreeThreshold: 0,
      isActive: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
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
      name: "이탈리아 수제 가죽 크로스백",
      summary: "장인이 한땀한땀 만든 프리미엄 가죽백",
      description: "100% 수제작 가죽 크로스백",
      price: 320000,
      stock: 5,
      shippingBaseFee: 3000,
      shippingFreeThreshold: 50000,
      isActive: true,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
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
      name: "청자 도자기 티세트 (6인용)",
      summary: "전통 기법으로 제작된 핸드메이드 청자",
      description: "전통 기법으로 제작된 청자 티세트",
      price: 180000,
      stock: 3,
      shippingBaseFee: 4000,
      shippingFreeThreshold: 100000,
      isActive: true,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
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
  ];

  // Generate 200+ diverse products for realistic pagination
  const generatedProducts: Product[] = Array.from({ length: 200 }, (_, i) => {
    const category = categories[i % categories.length]!;
    const categoryProducts =
      productNames[category as keyof typeof productNames];
    const categorySummaries = summaries[category as keyof typeof summaries];

    if (!categoryProducts || !categorySummaries) {
      // Skip if category data is missing
      return null;
    }

    const productIndex = i % categoryProducts.length;
    const summaryIndex = i % categorySummaries.length;

    // Vary prices by category
    const basePrices: Record<string, number> = {
      "아트/컬렉터블": 500000,
      "패션/잡화": 150000,
      "키친/테이블웨어": 80000,
      "가구/리빙": 250000,
      뷰티: 60000,
      테크: 120000,
    };

    const basePrice = basePrices[category] || 100000;
    const priceVariation = Math.floor(Math.random() * basePrice * 2);
    const price = basePrice + priceVariation;

    // Create varied creation dates for better sorting tests
    const daysAgo = Math.floor(Math.random() * 30) + i * 0.5;

    const product: Product = {
      id: i + 4,
      popupStoreId: (i % 15) + 1,
      category,
      name: categoryProducts[productIndex]!,
      summary: `${categorySummaries[summaryIndex]} ${categoryProducts[productIndex]}`,
      description: `${categoryProducts[productIndex]}의 상세 설명입니다. ${categorySummaries[summaryIndex]} 제품으로 많은 사랑을 받고 있습니다.`,
      price,
      stock: Math.floor(Math.random() * 20) + 1,
      shippingBaseFee: price > 100000 ? 0 : 3000,
      shippingFreeThreshold: price > 100000 ? 0 : 50000,
      isActive: true,
      createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      images: [
        {
          id: i + 4,
          productId: i + 4,
          imageUrl: `https://picsum.photos/400/400?random=${i + 4}`,
          sortOrder: 0,
        },
      ],
      tags: [],
      popupStore: {
        id: (i % 15) + 1,
        name: `${category} 전문 팝업 ${(i % 15) + 1}`,
        createdAt: new Date(),
      },
    };
    
    return product;
  }).filter((p): p is Product => p !== null);

  return [...baseProducts, ...generatedProducts];
};

const mockProducts = generateMockProducts();

// Mock auction data with more entries
const mockAuctions: Auction[] = mockProducts
  .slice(0, 100)
  .map((product, i) => ({
    id: i + 1,
    productId: product.id,
    startPrice: Math.floor(product.price * 0.7),
    minBidPrice: Math.floor(product.price * 0.05),
    buyNowPrice: Math.floor(product.price * 1.5),
    depositAmount: Math.floor(product.price * 0.1),
    startsAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    endsAt: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
    status: ["running", "scheduled", "ended"][Math.floor(Math.random() * 3)] as
      | "running"
      | "scheduled"
      | "ended",
    createdAt: new Date(),
    updatedAt: new Date(),
    currentBid:
      Math.random() > 0.5
        ? {
            id: i + 1,
            auctionId: i + 1,
            userId: Math.floor(Math.random() * 100) + 1,
            bidOrder: 1,
            amount: Math.floor(product.price * (0.8 + Math.random() * 0.4)),
            createdAt: new Date(),
          }
        : undefined,
    bidCount: Math.floor(Math.random() * 50),
  }));

// Kanu popup store products
const kanuProducts: Product[] = [
  {
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
  },
  {
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
  },
];

const kanuAuction: Auction = {
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
};

// Helper function to filter and sort products
const filterAndSortProducts = (
  products: Product[],
  filters: ProductFilters
): Product[] => {
  let filtered = [...products];

  // Apply category filter
  if (filters.category && filters.category !== "전체") {
    filtered = filtered.filter((p) => p.category === filters.category);
  }

  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.summary?.toLowerCase().includes(searchLower)
    );
  }

  // Apply price filter
  if (filters.price && filters.price !== "all") {
    switch (filters.price) {
      case "0-100000":
        filtered = filtered.filter((p) => p.price <= 100000);
        break;
      case "100000-500000":
        filtered = filtered.filter(
          (p) => p.price > 100000 && p.price <= 500000
        );
        break;
      case "500000-1000000":
        filtered = filtered.filter(
          (p) => p.price > 500000 && p.price <= 1000000
        );
        break;
      case "1000000+":
        filtered = filtered.filter((p) => p.price > 1000000);
        break;
    }
  }

  // Apply status filter (based on auction status)
  if (filters.status && filters.status !== "all") {
    const auctionProductIds = mockAuctions
      .filter(
        (a) =>
          a.status === filters.status ||
          (filters.status === "ongoing" && a.status === "running")
      )
      .map((a) => a.productId);

    if (
      filters.status === "ongoing" ||
      filters.status === "scheduled" ||
      filters.status === "completed"
    ) {
      filtered = filtered.filter((p) => auctionProductIds.includes(p.id));
    }
  }

  // Apply bidders filter
  if (filters.bidders && filters.bidders !== "all") {
    const filteredAuctionIds = mockAuctions
      .filter((a) => {
        const bidCount = a.bidCount || 0;
        switch (filters.bidders) {
          case "0-10":
            return bidCount <= 10;
          case "11-50":
            return bidCount > 10 && bidCount <= 50;
          case "51-100":
            return bidCount > 50 && bidCount <= 100;
          case "100+":
            return bidCount > 100;
          default:
            return true;
        }
      })
      .map((a) => a.productId);

    filtered = filtered.filter((p) => filteredAuctionIds.includes(p.id));
  }

  // Apply content type filter
  if (filters.content) {
    switch (filters.content) {
      case "popular":
        // Sort by bid count and filter to active auctions
        const popularAuctionIds = mockAuctions
          .filter((a) => a.status === "running")
          .sort((a, b) => (b.bidCount || 0) - (a.bidCount || 0))
          .slice(0, 50)
          .map((a) => a.productId);
        filtered = filtered.filter((p) => popularAuctionIds.includes(p.id));
        break;
      case "new":
        // Filter to recent products (last 7 days)
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter((p) => new Date(p.createdAt) > oneWeekAgo);
        break;
      case "upcoming":
        // Products with scheduled auctions
        const upcomingAuctionIds = mockAuctions
          .filter((a) => a.status === "scheduled")
          .map((a) => a.productId);
        filtered = filtered.filter((p) => upcomingAuctionIds.includes(p.id));
        break;
      case "ending-soon":
        // Products with auctions ending within 24 hours
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const endingSoonIds = mockAuctions
          .filter(
            (a) => a.status === "running" && new Date(a.endsAt) < tomorrow
          )
          .map((a) => a.productId);
        filtered = filtered.filter((p) => endingSoonIds.includes(p.id));
        break;
    }
  }

  // Apply sorting
  switch (filters.sort) {
    case "recommended":
      // Sort by stock and price (as a proxy for popularity)
      filtered.sort((a, b) => b.stock * b.price - a.stock * a.price);
      break;
    case "latest":
      // Sort by creation date
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "popular":
      // Sort by bid count
      filtered.sort((a, b) => {
        const auctionA = mockAuctions.find(
          (auction) => auction.productId === a.id
        );
        const auctionB = mockAuctions.find(
          (auction) => auction.productId === b.id
        );
        return (auctionB?.bidCount || 0) - (auctionA?.bidCount || 0);
      });
      break;
  }

  return filtered;
};

// Import real API if enabled
import { productApiReal } from './products-real';

// Check if we should use mock data
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === 'true';

// Mock API service functions
const productApiMock = {
  // Get paginated products with filters
  async getProductsWithPagination(
    filters: ProductFilters = {}
  ): Promise<PaginatedResponse<Product>> {
    await mockDelay(500);

    const page = filters.page || 1;
    const pageSize = filters.pageSize || 16;

    // Apply filters and sorting
    const filteredProducts = filterAndSortProducts(mockProducts, filters);

    // Calculate pagination
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // Get paginated data
    const paginatedData = filteredProducts.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    };
  },

  // Get auctions for specific products
  async getAuctionsForProducts(productIds: number[]): Promise<Auction[]> {
    await mockDelay(300);
    return mockAuctions.filter((a) => productIds.includes(a.productId));
  },

  // Legacy methods for compatibility
  async getProducts(filters?: {
    category?: string;
    popupStoreId?: number;
  }): Promise<Product[]> {
    await mockDelay();

    let products = [...mockProducts];

    if (filters?.category) {
      products = products.filter((p) => p.category === filters.category);
    }

    if (filters?.popupStoreId) {
      products = products.filter(
        (p) => p.popupStoreId === filters.popupStoreId
      );
    }

    return products;
  },

  async getAuctions(): Promise<Auction[]> {
    await mockDelay();
    return [...mockAuctions];
  },

  async getPopupStoreProducts(popupStoreId: number): Promise<{
    products: Product[];
    auctions: Auction[];
  }> {
    await mockDelay();

    if (popupStoreId === 10) {
      return {
        products: kanuProducts,
        auctions: [kanuAuction],
      };
    }

    const products = mockProducts.filter(
      (p) => p.popupStoreId === popupStoreId
    );
    const productIds = products.map((p) => p.id);
    const auctions = mockAuctions.filter((a) =>
      productIds.includes(a.productId)
    );

    return { products, auctions };
  },

  async getFeaturedProducts(): Promise<{
    urgentProducts: Product[];
    mdPicks: Product[];
    newProducts: Product[];
    auctions: Auction[];
  }> {
    await mockDelay();

    return {
      urgentProducts: mockProducts.slice(0, 4),
      mdPicks: mockProducts.slice(4, 8),
      newProducts: mockProducts.slice(8, 12),
      auctions: mockAuctions.slice(0, 12),
    };
  },

  async getProductById(id: number): Promise<Product | null> {
    await mockDelay();
    const product =
      mockProducts.find((p) => p.id === id) ||
      kanuProducts.find((p) => p.id === id);
    return product || null;
  },

  async getAuctionByProductId(productId: number): Promise<Auction | null> {
    await mockDelay();
    const auction =
      mockAuctions.find((a) => a.productId === productId) ||
      (productId === 101 ? kanuAuction : null);
    return auction || null;
  },
};

// Export the appropriate API based on environment
export const productApi = USE_MOCK_DATA ? productApiMock : productApiReal;
