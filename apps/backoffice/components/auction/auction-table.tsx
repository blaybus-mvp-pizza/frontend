"use client";

import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { getColumns } from "./columns";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { useAuctionList } from "@/hooks/use-auctions";
import { AuctionItem } from "@/api/auction/type";
import AuctionFilter from "./auction-filter";
import { DataTable } from "./data-table";
import { Button } from "@workspace/ui/components/button";
import AuctionFormModal from "./auction-form-modal";

type FormMode = "create" | "edit" | "view";

export default function AuctionTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<FormMode>("create");
  const [selectedAuctionId, setSelectedAuctionId] = useState<
    number | undefined
  >(undefined);

  const { data, isLoading } = useAuctionList({
    page: 1,
    size: 20,
    q: globalFilter,
  });

  const auctions: AuctionItem[] = data?.items || [];

  const handleOpenModal = (mode: FormMode, auctionId?: number) => {
    setModalMode(mode);
    setSelectedAuctionId(auctionId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalMode("create");
    setSelectedAuctionId(undefined);
  };

  const columns = useMemo(() => getColumns(handleOpenModal), []);

  const table = useReactTable({
    data: auctions || [],
    columns,
    state: {
      globalFilter,
      columnFilters,
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
        <AuctionFilter
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        />
        <Button onClick={() => handleOpenModal("create")}>경매 등록</Button>
      </div>
      <DataTable table={table} />

      <AuctionFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        auctionId={selectedAuctionId}
      />
    </>
  );
}
