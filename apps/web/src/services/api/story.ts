import { Story } from '@workspace/ui/types';

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

export interface StoryFilters {
  page?: number;
  pageSize?: number;
}

const generateMockStories = (): Story[] => {
  const stories: Story[] = [];

  for (let i = 1; i <= 18; i++) {
    stories.push({
      id: i,
      userId: Math.floor(Math.random() * 10) + 1,
      productId: Math.floor(Math.random() * 10) + 1,
      title: `버려질뻔한 굿즈를 재탄생 시킨 이쁜 카페 인테리어`,
      content: `성수동 팝업스토어에서 철거 예정이던 테이블과 의자를 나팔 경매로 낙찰받아, 작은 동네 카페의 한켠을 성수동 팝업스토어에서 철거 예정이던 테이블과 의자를 나팔 경매로 낙찰받아, 작은 동네 카페의 한켠을`,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        id: Math.floor(Math.random() * 10) + 1,
        nickname: `나팔러_${i}`,
        isPhoneVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      product: {
        id: Math.floor(Math.random() * 10) + 1,
        popupStoreId: Math.floor(Math.random() * 5) + 1,
        category: '패션',
        name: `카누 팝업스토어 에디션 텀블러 (${i}번 상품)`,
        price: 15000,
        stock: 1,
        shippingBaseFee: 2500,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        popupStore: {
          id: Math.floor(Math.random() * 5) + 1,
          name: `카누 팝업스토어 에디션 텀블러`,
          description: `카누 팝업스토어 전시 공간에서 실제 사용된 카누 원두 에디션 텀블러.`,
          bannerImageUrl: `https://picsum.photos/400/200?random=${i + 10}`,
          createdAt: new Date(),
        },
      },
      images: [
        {
          id: 1,
          storyId: i,
          imageUrl: `https://picsum.photos/400/400?random=${i}`,
          sortOrder: 1,
        },
      ],
    });
  }
  return stories;
};

const mockStories = generateMockStories();

export const storyApi = {
  async getStoriesWithPagination(
    filters: StoryFilters = {}
  ): Promise<PaginatedResponse<Story>> {
    await mockDelay(500);

    const page = filters.page || 1;
    const pageSize = filters.pageSize || 16;

    const total = mockStories.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = mockStories.slice(start, end);

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

  async getStoryById(id: number): Promise<Story | null> {
    await mockDelay();
    const story = mockStories.find((story) => story.id === id);
    return story || null;
  },
};
