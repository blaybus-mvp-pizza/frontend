"use client";

import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { createColumns } from "@/components/product/columns";
import { DataTable } from "@/components/product/data-table";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { useState } from "react";
import { ProductFilter } from "./product-filter";
import ProductExcelDownloadButton from "./product-excel-download-button";
import { useProductList } from "@/hooks/use-products";
import { ProductItem } from "@/api/product/type";
import AuctionFormModal from "../auction/auction-form-modal";

export default function ProductTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data, isLoading } = useProductList({
    page: 1,
    size: 100,
    q: globalFilter,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const handleOpenAuctionModal = (productId: number) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProductId(null);
  };

  const columns = createColumns({
    onOpenAuctionModal: handleOpenAuctionModal,
  });

  const products: ProductItem[] = data?.items || [];

  const table = useReactTable({
    data: products || [],
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
        <ProductFilter
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        />
        <ProductExcelDownloadButton />
      </div>
      <DataTable table={table} />

      <AuctionFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode='create'
        productId={selectedProductId || undefined}
      />
    </>
  );
}
