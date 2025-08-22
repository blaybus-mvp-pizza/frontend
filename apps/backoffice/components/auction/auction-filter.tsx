"use client";

import React from "react";
import { ColumnFiltersState } from "@tanstack/react-table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@workspace/ui/components/select";
import { AUCTION_STATUS_MAP } from "@/api/auction/type";

interface AuctionFilterProps {
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
}

export default function AuctionFilter({
  globalFilter,
  setGlobalFilter,
  columnFilters,
  setColumnFilters,
}: AuctionFilterProps) {
  const handleStatusChange = (value: string) => {
    if (value === "all") {
      setColumnFilters((prev) => prev.filter((f) => f.id !== "status"));
    } else {
      setColumnFilters((prev) => {
        const existingFilter = prev.find((f) => f.id === "status");
        if (existingFilter) {
          return prev.map((f) => (f.id === "status" ? { ...f, value } : f));
        }
        return [...prev, { id: "status", value }];
      });
    }
  };

  return (
    <div className='flex items-center gap-2 py-4'>
      <Select onValueChange={handleStatusChange}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='경매 상태 필터' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>전체</SelectItem>
          {Object.entries(AUCTION_STATUS_MAP).map(
            ([status, translated]) =>
              status !== "ALL" && (
                <SelectItem key={status} value={status}>
                  {translated}
                </SelectItem>
              )
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
