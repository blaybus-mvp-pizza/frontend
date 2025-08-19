"use client";

import DateRangeSelector from "@/components/my/date-range-selector";
import Searchbar from "@/components/my/search-bar";
import MyProfile from "@/components/my/my-profile";
import MyStats from "@/components/my/my-stats";
import { useCallback, useState } from "react";
import MyItemList from "@/components/my/my-item-list";
import { ItemFilters } from "@/services/api/my";
import ProfileTabs from "@/components/my/profile-tabs";

export default function MyPageContent() {
  const [isEditing, setIsEditing] = useState(false);

  const [filters, setFilters] = useState<ItemFilters>({
    search: "",
    startDate: undefined,
    endDate: undefined,
  });

  const handleDateRangeChange = useCallback(
    (startDate: Date | undefined, endDate: Date | undefined) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        startDate,
        endDate,
      }));
    },
    [setFilters]
  );

  const handleSearchChange = useCallback(
    (searchValue: string) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        search: searchValue,
      }));
    },
    [setFilters]
  );

  return (
    <>
      {isEditing ? (
        <div className='flex justify-center'>
          <ProfileTabs />
        </div>
      ) : (
        <div className='flex flex-col gap-5'>
          <div className='flex flex-col sm:flex-row gap-2 bg-secondary border-1 p-5 rounded-sm'>
            <MyProfile onEditClick={() => setIsEditing(true)} />
            <MyStats />
          </div>
          <div className='flex flex-col gap-4 sm:flex-row sm:gap-8 justify-between items-center w-full'>
            <DateRangeSelector onDateRangeChange={handleDateRangeChange} />
            <Searchbar onSearchChange={handleSearchChange} />
          </div>
          <div>
            <MyItemList filters={filters} />
          </div>
        </div>
      )}
    </>
  );
}
