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
import AuctionFormModal, { FormMode } from "./auction-form-modal";
import { Pagination, PaginationInfo } from '../common/pagination';

export default function AuctionTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<FormMode>("create");
  const [selectedAuctionId, setSelectedAuctionId] = useState<
    number | undefined
  >(undefined);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const { data, isLoading } = useAuctionList({
    page: page,
    size: size,
    q: globalFilter,
  });

  const auctions: AuctionItem[] = data?.items || [];
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / size);
  
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
      <AuctionFilter
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
      
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

      <AuctionFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        auctionId={selectedAuctionId}
      />
    </>
  );
}