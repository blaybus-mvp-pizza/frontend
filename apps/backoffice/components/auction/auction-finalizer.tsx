"use client";

import React from "react";
import { Button } from "@workspace/ui/components/button";
import { useAuctionFinalize } from "@/hooks/use-auctions";

interface AuctionFinalizerProps {
  auctionId: number;
  currentStatus: string;
}

export default function AuctionFinalizer({
  auctionId,
  currentStatus,
}: AuctionFinalizerProps) {
  const { mutate: finalizeAuction, isPending } = useAuctionFinalize();

  const isEnded = currentStatus === "ENDED";

  const handleFinalize = () => {
    if (window.confirm("정말로 이 경매를 낙찰 확정하시겠습니까?")) {
      finalizeAuction({ auction_id: auctionId });
    }
  };

  return (
    <Button
      onClick={handleFinalize}
      disabled={isPending || !isEnded}
      variant='outline'
    >
      {isPending ? "처리 중..." : "낙찰 확정"}
    </Button>
  );
}
