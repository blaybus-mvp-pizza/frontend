'use client'

import { useMemo } from 'react'

import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

import { useMyItemsWithPagination } from '@/hooks/queries/useMyItems'
import { ItemFilters } from '@/services/api/my'
import { Item } from '@/services/api/my'

import { Pagination } from '../ui/pagination'
import { Skeleton } from '../ui/skeleton'
import MyItem from './my-item'

interface MyItemListProps {
  filters: ItemFilters
}

export default function MyItemList({ filters }: MyItemListProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const page = parseInt(searchParams.get('page') || String(1))
  const combinedFilters = useMemo(
    () => ({
      ...filters,
      page,
      pageSize: 6,
    }),
    [filters, page],
  )

  const {
    data: paginatedItems,
    isLoading,
    isPlaceholderData,
  } = useMyItemsWithPagination(combinedFilters)

  if (isLoading && !isPlaceholderData) {
    return <MyItemListSkeleton />
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const items = paginatedItems?.data || []
  const pagination = paginatedItems?.pagination
  const totalPages = pagination?.totalPages || 1

  type GroupedItems = {
    [key: string]: Item[]
  }

  const groupedItems = items.reduce((acc, item) => {
    const dateKey = format(new Date(item.date), 'yyyy.MM.dd', {
      locale: ko,
    })
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(item)
    return acc
  }, {} as GroupedItems)

  const sortedDates = Object.keys(groupedItems || {}).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  )

  if (items.length === 0) {
    return <div className="py-10 text-center text-gray-500">검색 결과가 없습니다.</div>
  }

  return (
    <>
      <div className="space-y-8">
        {sortedDates.map((date) => (
          <div key={date}>
            <div className="mb-4 border-t-2 border-[#111111]"></div>
            <h2 className="mb-4 ml-4 text-lg font-semibold text-gray-800">{date}</h2>
            <div className="space-y-4">
              {groupedItems[date]?.map((item) => (
                <MyItem
                  key={item.id}
                  item={item}
                  onClick={() => {
                    router.push(item.link || '')
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center py-20">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </>
  )
}

function MyItemListSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="mb-4 border-t-2 border-[#111111]"></div>
        <Skeleton className="ml-4 h-6 w-32" />
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-4 border-t border-gray-200 p-4"
            >
              <div className="flex flex-1 flex-shrink-0 items-center gap-6">
                <Skeleton className="w-29 h-29 rounded-sm" />
                <div className="flex flex-1 flex-col gap-1.5">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
              <div className="h-29 mx-4 hidden w-px bg-gray-100 md:block"></div>
              <div className="flex w-full flex-shrink-0 flex-col items-center gap-2 text-center md:w-1/3">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="mb-4 border-t-2 border-[#111111]"></div>
        <Skeleton className="ml-4 h-6 w-32" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-4 border-t border-gray-200 p-4"
            >
              <div className="flex flex-1 flex-shrink-0 items-center gap-6">
                <Skeleton className="w-29 h-29 rounded-sm" />
                <div className="flex flex-1 flex-col gap-1.5">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
              <div className="h-29 mx-4 hidden w-px bg-gray-100 md:block"></div>
              <div className="flex w-full flex-shrink-0 flex-col items-center gap-2 text-center md:w-1/3">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center py-20">
        <Skeleton className="h-8 w-48" />
      </div>
    </div>
  )
}
