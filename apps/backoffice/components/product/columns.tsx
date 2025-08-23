"use client";

import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { ImageOff, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProductItem } from "@/api/product/type";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@workspace/ui/components/dropdown-menu";

interface ProductTableActions {
  onOpenAuctionModal: (productId: number) => void;
}

export const createColumns = ({
  onOpenAuctionModal,
}: ProductTableActions): ColumnDef<ProductItem>[] => [
  {
    accessorKey: "representative_image",
    header: "",
    cell: ({ row }) => {
      const imageUrl = row.original.representative_image;
      if (imageUrl) {
        return (
          <div className='relative h-12 w-12'>
            <Image
              src={imageUrl}
              alt={row.original.name}
              fill
              style={{ objectFit: "cover" }}
              className='rounded-md'
            />
          </div>
        );
      }
      return (
        <div className='flex h-12 w-12 items-center justify-center rounded-md bg-gray-100 text-gray-400'>
          <ImageOff className='h-6 w-6' />
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "상품명",
  },
  {
    accessorKey: "category",
    header: "카테고리",
  },
  {
    accessorKey: "created_at",
    header: "등록일",
    cell: ({ row }) => {
      const createdDate = new Date(row.original.created_at);
      return createdDate.toLocaleDateString();
    },
  },
  {
    accessorKey: "updated_at",
    header: "수정일",
    cell: ({ row }) => {
      const updatedDate = new Date(row.original.updated_at);
      return updatedDate.toLocaleDateString();
    },
  },
  {
    accessorKey: "status",
    header: "상태",
    cell: ({ row }) => {
      const isSold = row.original.status === "SOLD";
      return (
        <Badge
          className={`px-2.5 py-1 ${isSold ? "bg-gray-200 text-gray-800" : "bg-green-100 text-green-600"}`}
        >
          {isSold ? "판매완료" : "판매 중"}
        </Badge>
      );
    },
  },
  {
    id: "auction",
    header: "경매",
    cell: ({ row }) => {
      const product = row.original;
      if (product.auction_id) {
        return (
          <span className='text-gray-500'>
            등록됨 (ID: {product.auction_id})
          </span>
        );
      }
      return (
        <Button
          variant='outline'
          size='sm'
          onClick={() => onOpenAuctionModal(product.id)}
        >
          경매 등록
        </Button>
      );
    },
  },
  {
    id: "actions",
    header: "작업",
    cell: function ActionsCell({ row }) {
      const product = row.original;
      const router = useRouter();
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
              onClick={() => router.push(`/product/${product.id}`)}
            >
              상세보기
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/product/edit/${product.id}`)}
            >
              수정하기
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
