import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { AuctionStatus, BiddersFilter, PriceBucket, ProductFilters, SortOption } from '@/api/types'

interface FilterState {
  productFilters: ProductFilters
  savedFilters: (ProductFilters & { name?: string; savedAt?: string })[]

  updateFilters: (filters: Partial<ProductFilters>) => void
  resetFilters: () => void
  saveCurrentFilters: (name?: string) => void
  loadSavedFilter: (index: number) => void
  deleteSavedFilter: (index: number) => void
}

const defaultFilters: ProductFilters = {
  page: 1,
  size: 20,
  sort: SortOption.RECOMMENDED,
  status: AuctionStatus.RUNNING,
  bidders: BiddersFilter.ALL,
  price_bucket: PriceBucket.ALL,
}

export const useFilterStore = create<FilterState>()(
  devtools(
    (set, get) => ({
      productFilters: defaultFilters,
      savedFilters: [],

      updateFilters: (filters) => {
        set(
          (state) => ({
            productFilters: { ...state.productFilters, ...filters },
          }),
          false,
          'filter/update',
        )
      },

      resetFilters: () => {
        set({ productFilters: defaultFilters }, false, 'filter/reset')
      },

      saveCurrentFilters: (name) => {
        const currentFilters = get().productFilters
        const savedFilter = {
          ...currentFilters,
          savedAt: new Date().toISOString(),
          name: name || `Filter ${get().savedFilters.length + 1}`,
        }

        set(
          (state) => ({
            savedFilters: [...state.savedFilters, savedFilter],
          }),
          false,
          'filter/save',
        )
      },

      loadSavedFilter: (index) => {
        const filter = get().savedFilters[index]
        if (filter) {
          const { name, savedAt, ...productFilters } = filter
          set({ productFilters }, false, 'filter/load')
        }
      },

      deleteSavedFilter: (index) => {
        set(
          (state) => ({
            savedFilters: state.savedFilters.filter((_, i) => i !== index),
          }),
          false,
          'filter/delete',
        )
      },
    }),
    {
      name: 'filter-store',
    },
  ),
)
