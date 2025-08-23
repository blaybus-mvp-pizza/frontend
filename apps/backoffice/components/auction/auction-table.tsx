"use client";

import {
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { getColumns } from "./columns";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { useAuctionList } from "@/hooks/use-auctions";
import { AuctionItem, TAuctionStatus } from "@/apis/auction/type";
import AuctionFilter from "./auction-filter";
import { DataTable } from "./data-table";
import AuctionFormModal, { FormMode } from "./auction-form-modal";
import { Pagination, PaginationInfo } from '../common/pagination';
import { useDebounce } from '@/hooks/use-debounce';

export default function AuctionTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedGlobalFilter = useDebounce(globalFilter, 500);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<FormMode>("create");
  const [selectedAuctionId, setSelectedAuctionId] = useState<
    number | undefined
  >(undefined);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const [status, setStatus] = useState<TAuctionStatus | null>('ALL');

  const { data, isLoading } = useAuctionList({
    page: page,
    size: size,
    q: debouncedGlobalFilter,
    status: status ? status : undefined,
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
    },
    getCoreRowModel: getCoreRowModel(),
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
        status={status}
        setStatus={setStatus}
      />
      
      <DataTable table={table} />
      
      {totalPages > 0 &&
        <>
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
        </>
      }
      <AuctionFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        auctionId={selectedAuctionId}
      />
    </>
  );
}