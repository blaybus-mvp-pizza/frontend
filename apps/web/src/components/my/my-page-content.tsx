'use client'

import { useCallback, useState } from 'react'

import DateRangeSelector from '@/components/my/date-range-selector'
import MyItemList from '@/components/my/my-item-list'
import MyProfile from '@/components/my/my-profile'
import MyStats from '@/components/my/my-stats'
import ProfileTabs from '@/components/my/profile-tabs'
import Searchbar from '@/components/my/search-bar'
import { MyAuctionFilters } from '@/api/endpoints/my.api'

export default function MyPageContent() {
  const [isEditing, setIsEditing] = useState(false)

  const [filters, setFilters] = useState<MyAuctionFilters>({
    q: '',
    period: '1m',
    startDate: undefined,
    endDate: undefined,
  })

  const handleDateRangeChange = useCallback(
    (startDate: Date | undefined, endDate: Date | undefined) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        period: startDate && endDate ? 'custom' : '1m',
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      }))
    },
    [setFilters],
  )

  const handleSearchChange = useCallback(
    (searchValue: string) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        q: searchValue,
      }))
    },
    [setFilters],
  )

  return (
    <>
      {isEditing ? (
        <div className="flex justify-center">
          <ProfileTabs />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="bg-secondary border-1 flex flex-col gap-2 rounded-sm p-5 sm:flex-row">
            <MyProfile onEditClick={() => setIsEditing(true)} />
            <MyStats />
          </div>
          <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row sm:gap-8">
            <DateRangeSelector onDateRangeChange={handleDateRangeChange} />
            <Searchbar onSearchChange={handleSearchChange} />
          </div>
          <div>
            <MyItemList filters={filters} />
          </div>
        </div>
      )}
    </>
  )
}
