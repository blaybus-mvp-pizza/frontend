"use client";

import { popup_store } from "@/generated/prisma";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import PopUpStoreCreateButton from "./popupstore-create-button";
import { PopUpStoreFilter } from "./popupstore-filter";

export default function PopUpStoreTable() {
  const [globalFilter, setGlobalFilter] = useState("");

  const { data: popupstores, isLoading } = useQuery<popup_store[]>({
    queryKey: ["popup_stores"],
    queryFn: async () => {
      const response = await axios.get("/api/popupstore");
      return response.data;
    },
  });

  const table = useReactTable({
    data: popupstores || [],
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-[400px] w-full' />
      </div>
    );
  }
  return (
    <>
      <div className='flex justify-between items-center'>
        <PopUpStoreFilter
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <PopUpStoreCreateButton />
      </div>
      <DataTable table={table} />
    </>
  );
}
