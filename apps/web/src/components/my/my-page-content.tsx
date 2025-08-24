'use client'

import { useCallback, useState } from 'react'

import { MyAuctionFilters } from '@/api/endpoints/my.api'
import DateRangeSelector from '@/components/my/date-range-selector'
import MyItemList from '@/components/my/my-item-list'
import MyProfile from '@/components/my/my-profile'
import MyStats from '@/components/my/my-stats'
import ProfileTabs from '@/components/my/profile-tabs'
import Searchbar from '@/components/my/search-bar'

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
      let finalStartDate: string | undefined = undefined
      let finalEndDate: string | undefined = undefined

      if (startDate) {
        startDate.setHours(0, 0, 0, 0)
        finalStartDate = startDate.toISOString()
      }

      if (endDate) {
        endDate.setHours(23, 59, 59, 999)
        finalEndDate = endDate.toISOString()
      }

      setFilters((prevFilters) => ({
        ...prevFilters,
        period: finalStartDate && finalEndDate ? 'custom' : '1m',
        startDate: finalStartDate,
        endDate: finalEndDate,
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
          <div className="flex flex-col gap-2 rounded border border-[#E5E5EC] bg-[#F8F8F8] p-5 sm:flex-row">
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
