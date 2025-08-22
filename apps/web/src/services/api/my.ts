import { Auction, User } from '@workspace/ui/types'

import { MyItemStatus } from '@/constants/myitem.constant'

export interface Item {
  id: number
  auction: Auction
  status: string
  link?: string
  date: Date
  myBid: {
    amount: number
  }
}

export interface UserStats {
  inProgress: number
  depositing: number
  inDelivery: number
  deliveryCompleted: number
}

// Mock delay to simulate API call
const mockDelay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms))

// Interface for paginated response
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export interface ItemFilters {
  page?: number
  pageSize?: number
  startDate?: Date
  endDate?: Date
  search?: string
}

const generateMockItems = (): Item[] => {
  const items: Item[] = []
  const now = new Date()

  const today = new Date()
  const yesterday = new Date(now.getTime() - 1000 * 60 * 60 * 24)

  const allStatuses = Object.values(MyItemStatus)

  for (let i = 0; i < 3; i++) {
    const randomStatusIndex = Math.floor(Math.random() * allStatuses.length)
    const randomStatus = allStatuses[randomStatusIndex]
    const item: Item = {
      id: i + 1,
      auction: {
        id: i + 100,
        product: {
          name: `오늘 상품 ${i + 1}`,
          images: [{ imageUrl: `https://picsum.photos/400/400?random=${i}` }],
        },
        currentBid: { amount: 10000 + i * 1000 },
      } as Auction,
      status: randomStatus as MyItemStatus,
      link: '',
      date: today,
      myBid: {
        amount: 5000 + i * 500,
      },
    }
    items.push(item)
  }

  for (let i = 3; i < 7; i++) {
    const randomStatusIndex = Math.floor(Math.random() * allStatuses.length)
    const randomStatus = allStatuses[randomStatusIndex]

    const item: Item = {
      id: i + 1,
      auction: {
        id: i + 100,
        product: {
          name: `어제 상품 ${i + 1}`,
          images: [{ imageUrl: `https://picsum.photos/400/400?random=${i}` }],
        },
        currentBid: { amount: 10000 + i * 100 },
      } as Auction,
      status: randomStatus as MyItemStatus,
      link: '',
      date: yesterday,
      myBid: {
        amount: 5000 + i * 50,
      },
    }
    items.push(item)
  }

  for (let i = 0; i < allStatuses.length; i++) {
    const status = allStatuses[i]
    const item: Item = {
      id: i + 1,
      auction: {
        id: i + 100,
        product: {
          name: `샘플 상품 ${i + 1}`,
          images: [{ imageUrl: `https://picsum.photos/400/400?random=${i}` }],
        },
        currentBid: { amount: 10000 + i * 1000 },
      } as Auction,
      status: status as MyItemStatus,
      link: '',
      date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * (i + 1)),
      myBid: {
        amount: 5000 + i * 500,
      },
    }

    items.push(item)
  }

  for (let i = 6; i < 30; i++) {
    const randomStatusIndex = Math.floor(Math.random() * allStatuses.length)
    const randomStatus = allStatuses[randomStatusIndex]

    const item: Item = {
      id: i,
      auction: {
        id: i + 100,
        product: {
          name: `샘플 상품 ${i}`,
          images: [{ imageUrl: `https://picsum.photos/400/400?random=${i}` }],
        },
        currentBid: { amount: 10000 + i * 100 },
      } as Auction,
      status: randomStatus as MyItemStatus,
      link: '',
      date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * (i + 1)),
      myBid: {
        amount: 5000 + i * 50,
      },
    }

    items.push(item)
  }

  return items
}

const mockItems = generateMockItems()

const mockUserProfile = {
  id: 1,
  email: 'diyung530@gmail.com',
  nickname: 'diyung',
  phoneNumber: '010-1234-1234',
  profileImageUrl: 'https://picsum.photos/400/400',
  isPhoneVerified: false,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockUserStats = {
  inProgress: 2,
  depositing: 5,
  inDelivery: 10,
  deliveryCompleted: 8,
} as UserStats

export const myApi = {
  async getUserProfile(): Promise<User> {
    await mockDelay(500)
    return mockUserProfile
  },

  async getUserStats(): Promise<UserStats> {
    await mockDelay(500)
    return mockUserStats
  },

  async getItemsWithPagination(filters: ItemFilters = {}): Promise<PaginatedResponse<Item>> {
    await mockDelay(500)

    const { page = 1, pageSize = 6, startDate, endDate, search } = filters

    let filteredData = mockItems
    if (search) {
      const lowercasedSearch = search.toLowerCase()
      filteredData = filteredData.filter((item) =>
        item.auction.product?.name.toLowerCase().includes(lowercasedSearch),
      )
    }
    if (startDate && endDate) {
      const adjustedEndDate = new Date(endDate.setHours(23, 59, 59, 999))
      filteredData = filteredData.filter((item) => {
        const itemDate = new Date(item.date)
        return itemDate >= startDate && itemDate <= adjustedEndDate
      })
    }

    const total = filteredData.length
    const totalPages = Math.ceil(total / pageSize)
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedData = filteredData.slice(start, end)

    return {
      data: paginatedData,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    }
  },
}
