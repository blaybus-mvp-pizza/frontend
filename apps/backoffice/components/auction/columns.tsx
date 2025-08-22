"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AuctionItem } from "@/api/auction/type";
import Link from "next/link";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import AuctionFinalizer from "./auction-finalizer";
import AuctionStatusEditor from "./auction-status-editor";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@workspace/ui/components/dropdown-menu";
import { MoreVertical } from "lucide-react";

export const getColumns = (
  handleOpenModal: (
    mode: "create" | "edit" | "view",
    auctionId?: number
  ) => void
): ColumnDef<AuctionItem>[] => [
  {
    accessorKey: "auction_id",
    header: "ID",
  },
  {
    accessorKey: "product_name",
    header: "상품명",
    cell: ({ row }) => (
      <Link href={`/admin/auctions/${row.original.auction_id}`}>
        <span className='font-mediu'>{row.getValue("product_name")}</span>
      </Link>
    ),
  },
  {
    accessorKey: "start_price",
    header: "시작 가격",
    cell: ({ row }) => {
      const startPrice = row.getValue("start_price") as number;
      return <span>{startPrice.toLocaleString()}원</span>;
    },
  },
  {
    accessorKey: "buy_now_price",
    header: "즉시 구매가",
    cell: ({ row }) => {
      const startPrice = row.getValue("start_price") as number;
      const buyNowPrice = row.getValue("buy_now_price") as number;
      return buyNowPrice ? (
        <span>{buyNowPrice.toLocaleString()}원</span>
      ) : (
        <span>{startPrice.toLocaleString()}원</span>
      );
    },
  },
  {
    accessorKey: "starts_at",
    header: "시작일",
    cell: ({ row }) => {
      const startsAt = row.getValue("starts_at") as string;
      return <span>{new Date(startsAt).toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "ends_at",
    header: "종료일",
    cell: ({ row }) => {
      const endsAt = row.getValue("ends_at") as string;
      return <span>{new Date(endsAt).toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "상태",
    cell: ({ row }) => {
      return (
        <div className='flex justify-center'>
          <AuctionStatusEditor
            auctionId={row.original.auction_id}
            currentStatus={row.original.status}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "payment_status",
    header: "결제 상태",
  },
  {
    accessorKey: "shipment_status",
    header: "배송 상태",
  },
  {
    accessorKey: "is_won",
    header: "낙찰 여부",
    cell: ({ row }) => {
      const auction = row.original;
      const status = auction.status;
      const isWon = auction.is_won;

      // 경매가 종료된 상태
      if (status === "ENDED") {
        // 낙찰 여부가 결정되었을 경우 (null이 아닌 경우)
        if (isWon !== null) {
          return isWon ? (
            <Badge className='bg-green-100 text-green-600'>낙찰</Badge>
          ) : (
            <Badge className='bg-gray-200 text-gray-800'>유찰</Badge>
          );
        }
        // 낙찰 여부가 아직 결정되지 않았을 경우 (is_won === null)
        return (
          <AuctionFinalizer
            auctionId={auction.auction_id}
            currentStatus={auction.status}
          />
        );
      }
      // 경매가 종료되지 않았을 경우
      return null;
    },
  },
  {
    id: "actions",
    header: "작업",
    cell: ({ row }) => {
      const auctionId = row.original.auction_id;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>작업</span>
              <MoreVertical className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem
              onClick={() => handleOpenModal("view", auctionId)}
            >
              상세보기
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleOpenModal("edit", auctionId)}
            >
              수정하기
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
