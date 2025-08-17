import { Product, Auction } from "@workspace/ui/types";

// Mock delay to simulate API call
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock products data
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
    startsAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
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
    startsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
    startsAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endsAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
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

// API service functions (ready to replace with real API calls)
export const productApi = {
  // Get all products with optional filters
  async getProducts(filters?: {
    category?: string;
    popupStoreId?: number;
  }): Promise<Product[]> {
    await mockDelay();
    
    let products = [...mockProducts];
    
    if (filters?.category) {
      products = products.filter(p => p.category === filters.category);
    }
    
    if (filters?.popupStoreId) {
      products = products.filter(p => p.popupStoreId === filters.popupStoreId);
    }
    
    return products;
  },

  // Get all auctions
  async getAuctions(): Promise<Auction[]> {
    await mockDelay();
    return [...mockAuctions];
  },

  // Get products by popup store
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
    
    const products = mockProducts.filter(p => p.popupStoreId === popupStoreId);
    const productIds = products.map(p => p.id);
    const auctions = mockAuctions.filter(a => productIds.includes(a.productId));
    
    return { products, auctions };
  },

  // Get featured products (마감임박, MD's Pick, 신규)
  async getFeaturedProducts(): Promise<{
    urgentProducts: Product[];
    mdPicks: Product[];
    newProducts: Product[];
    auctions: Auction[];
  }> {
    await mockDelay();
    
    return {
      urgentProducts: mockProducts,
      mdPicks: mockProducts,
      newProducts: mockProducts,
      auctions: mockAuctions,
    };
  },

  // Get product by ID
  async getProductById(id: number): Promise<Product | null> {
    await mockDelay();
    const product = mockProducts.find(p => p.id === id) || 
                   kanuProducts.find(p => p.id === id);
    return product || null;
  },

  // Get auction by product ID
  async getAuctionByProductId(productId: number): Promise<Auction | null> {
    await mockDelay();
    const auction = mockAuctions.find(a => a.productId === productId) ||
                   (productId === 101 ? kanuAuction : null);
    return auction || null;
  },
};