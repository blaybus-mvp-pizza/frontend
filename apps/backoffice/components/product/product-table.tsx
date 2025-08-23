"use client";

import {
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { createColumns } from "@/components/product/columns";
import { DataTable } from "@/components/product/data-table";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { useState } from "react";
import { ProductFilter } from "./product-filter";
import ProductExcelDownloadButton from "./product-excel-download-button";
import { useProductList } from "@/hooks/use-products";
import { ProductItem } from "@/apis/product/type";
import AuctionFormModal from "../auction/auction-form-modal";
import { Pagination, PaginationInfo } from '../common/pagination';
import { useDebounce } from '@/hooks/use-debounce';

export default function ProductTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedGlobalFilter = useDebounce(globalFilter, 500);

  const [category, setCategory] = useState("ALL");
  const [isSold, setIsSold] = useState<boolean | null>(false);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(8);

  const { data, isLoading } = useProductList({
    page: page,
    size: size,
    q: debouncedGlobalFilter,
    category: category !== "ALL" ? category : undefined,
    is_sold: isSold ? isSold : undefined,
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
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / size);

  const table = useReactTable({
    data: products || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading && !data) {
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
          category={category}
          setCategory={setCategory}
          isSold={isSold}
          setIsSold={setIsSold}
        />
        <ProductExcelDownloadButton />
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

      <AuctionFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode='create'
        productId={selectedProductId || undefined}
      />
    </>
  );
}