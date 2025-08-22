"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import PopUpStoreCreateButton from "./popupstore-create-button";
import { PopUpStoreFilter } from "./popupstore-filter";
import { usePopupStoreList } from '@/hooks/use-popupstore';
import { Pagination, PaginationInfo } from '../common/pagination';

export default function PopUpStoreTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(8);

  const { data, isLoading } = usePopupStoreList({
    page: page,
    size: size,
  });
  const popupstores = data?.items || [];
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / size);

  const table = useReactTable({
    data: popupstores,
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }
  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <PopUpStoreFilter
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <PopUpStoreCreateButton />
      </div>
      <DataTable table={table} />
      <div className='flex justify-end py-3'>
        <PaginationInfo
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={size}
        />
        </div>
        <div className='flex justify-center'>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}