import { ProductFilters, StoreFilters } from './types'

export const queryKeys = {
  all: ['api'] as const,

  auth: {
    all: ['auth'] as const,
    loginUrl: () => [...queryKeys.auth.all, 'login-url'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },

  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: ProductFilters) => [...queryKeys.products.lists(), filters] as const,
    detail: (id: number) => [...queryKeys.products.all, 'detail', id] as const,
    endingSoon: (filters?: ProductFilters) =>
      [...queryKeys.products.all, 'ending-soon', filters] as const,
    recommended: (filters?: ProductFilters) =>
      [...queryKeys.products.all, 'recommended', filters] as const,
    new: (filters?: ProductFilters) => [...queryKeys.products.all, 'new', filters] as const,
    upcoming: (filters?: ProductFilters) => [...queryKeys.products.all, 'upcoming', filters] as const,
    popularAuctions: (filters?: ProductFilters) => [...queryKeys.products.all, 'popular-auctions', filters] as const,
    stores: {
      all: () => [...queryKeys.products.all, 'stores'] as const,
      recent: (filters?: any) => [...queryKeys.products.stores.all(), 'recent', filters] as const,
      list: (filters?: StoreFilters) =>
        [...queryKeys.products.stores.all(), 'list', filters] as const,
    },
  },

  users: {
    all: ['users'] as const,
    me: () => [...queryKeys.users.all, 'me'] as const,
    profile: (id: number) => [...queryKeys.users.all, 'profile', id] as const,
  },

  auctions: {
    all: ['auctions'] as const,
    detail: (id: number) => [...queryKeys.auctions.all, id] as const,
    bids: (id: number) => [...queryKeys.auctions.all, id, 'bids'] as const,
  },

  notifications: {
    all: ['notifications'] as const,
    list: (limit?: number) => [...queryKeys.notifications.all, 'list', { limit }] as const,
    unread: () => [...queryKeys.notifications.all, 'unread'] as const,
  },

  payments: {
    all: ['payments'] as const,
    history: () => [...queryKeys.payments.all, 'history'] as const,
    methods: () => [...queryKeys.payments.all, 'methods'] as const,
  },
} as const
