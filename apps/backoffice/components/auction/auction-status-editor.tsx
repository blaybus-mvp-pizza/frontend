"use client";

import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@workspace/ui/components/select";
import { AUCTION_STATUS_MAP } from "@/apis/auction/type";
import { useEditAuctionStatus } from "@/hooks/use-auctions";

interface AuctionStatusEditorProps {
  auctionId: number;
  currentStatus: string;
}

export default function AuctionStatusEditor({
  auctionId,
  currentStatus,
}: AuctionStatusEditorProps) {
  const { mutate: editStatus } = useEditAuctionStatus();

  const handleStatusChange = (value: string) => {
    editStatus({ auction_id: auctionId, status: value });
  };

  const getSelectableStatuses = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return ["SCHEDULED", "RUNNING"];
      case "RUNNING":
        return ["RUNNING", "PAUSED"];
      case "PAUSED":
        return ["PAUSED", "RUNNING"];
      default:
        return [];
    }
  };

  const selectableStatusKeys = getSelectableStatuses(currentStatus);
  const isEditable = selectableStatusKeys.length > 0;

  if (!isEditable) {
    return (
      <span>
        {AUCTION_STATUS_MAP[currentStatus as keyof typeof AUCTION_STATUS_MAP]}
      </span>
    );
  }

  return (
    <Select value={currentStatus} onValueChange={handleStatusChange}>
      <SelectTrigger className='w-[120px]'>
        <SelectValue placeholder='상태 변경' />
      </SelectTrigger>
      <SelectContent>
        {selectableStatusKeys.map((status) => (
          <SelectItem key={status} value={status}>
            {AUCTION_STATUS_MAP[status as keyof typeof AUCTION_STATUS_MAP]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}