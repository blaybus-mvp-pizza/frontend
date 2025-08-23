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

  const isEditable =
    currentStatus === "SCHEDULED" || currentStatus === "RUNNING";

  if (!isEditable) {
    return (
      <span>
        {AUCTION_STATUS_MAP[currentStatus as keyof typeof AUCTION_STATUS_MAP]}
      </span>
    );
  }

  const selectableStatuses = Object.entries(AUCTION_STATUS_MAP)
    .filter(([status]) => status !== "ALL")
    .map(([status, translated]) => (
      <SelectItem key={status} value={status}>
        {translated}
      </SelectItem>
    ));

  return (
    <Select value={currentStatus} onValueChange={handleStatusChange}>
      <SelectTrigger className='w-[120px]'>
        <SelectValue placeholder='상태 변경' />
      </SelectTrigger>
      <SelectContent>{selectableStatuses}</SelectContent>
    </Select>
  );
}
