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

export default function PopUpStoreTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [params, setParams] = useState({ page: 1, size: 20 });

  const { data, isLoading } = usePopupStoreList(params);
  const popupstores = data?.items || [];

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
    </div>
  );
}