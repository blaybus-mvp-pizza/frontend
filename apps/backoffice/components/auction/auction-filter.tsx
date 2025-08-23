"use client";

import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@workspace/ui/components/select";
import { AUCTION_STATUS_MAP, TAuctionStatus } from "@/apis/auction/type";

interface AuctionFilterProps {
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
  status: TAuctionStatus | null;
  setStatus: (value: TAuctionStatus | null) => void;
}

export default function AuctionFilter({
  globalFilter,
  setGlobalFilter,
  status,
  setStatus,
}: AuctionFilterProps) {
  const handleStatusChange = (value: TAuctionStatus) => {
    if (value === "ALL") {
      setStatus(null);
    } else {
      setStatus(value);
    }
  };

  return (
    <div className='flex items-center gap-2 py-4'>
      <Select onValueChange={handleStatusChange} value={status || "ALL"}>
        <SelectTrigger className='w-[180px] border-black'>
          <SelectValue placeholder='경매 상태 필터' />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(AUCTION_STATUS_MAP).map(([statusKey, translated]) => (
            <SelectItem key={statusKey} value={statusKey}>
              {translated}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}