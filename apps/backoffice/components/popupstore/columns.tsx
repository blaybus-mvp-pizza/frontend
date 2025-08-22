"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { PopupStoreItem } from '@/api/popupstore/type';

export const columns: ColumnDef<PopupStoreItem>[] = [
  {
    accessorKey: "image_url",
    header: "",
    cell: ({ row }) => {
      const imageUrl = row.original.image_url;
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
    accessorKey: "store_id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "팝업스토어명",
  },
  {
    accessorKey: "description",
    header: "설명",
  },
  {
    accessorKey: "sales_description",
    header: "판매 조건",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const popupstore = row.original;
      const router = useRouter();
      return (
        <Button
          variant='outline'
          onClick={() => {
            router.push(`/popupstore/${popupstore.store_id}`);
          }}
        >
          상세보기
        </Button>
      );
    },
  },
];
