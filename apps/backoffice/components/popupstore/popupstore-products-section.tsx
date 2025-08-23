"use client";

import { DataTable } from "@/components/product/data-table";
import {
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { ProductFilter } from "../product/product-filter";
import ProductCreateButton from "../product/product-create-button";
import { TPOPUPSTORE } from "@/types";
import { useProductList } from "@/hooks/use-products";
import { ProductItem } from "@/apis/product/type";
import { createColumns } from "../product/columns";
import AuctionFormModal from "../auction/auction-form-modal";
import { Pagination, PaginationInfo } from '../common/pagination';
import { useDebounce } from '@/hooks/use-debounce';

type PopUpStoreProductsSectionProps = {
  popupstore: TPOPUPSTORE;
};

export default function PopUpStoreProductsSection({
  popupstore,
}: PopUpStoreProductsSectionProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedGlobalFilter = useDebounce(globalFilter, 500);

  const [category, setCategory] = useState("ALL");
  const [isSold, setIsSold] = useState<boolean | null>(null);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(8);

  const { data, isLoading } = useProductList({
    page: page,
    size: size,
    q: debouncedGlobalFilter,
    store_id: popupstore.id,
    category: category !== "ALL" ? category : undefined,
    is_sold: isSold !== null ? isSold : undefined,
  });

  const [displayProducts, setDisplayProducts] = useState<ProductItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (data) {
      setDisplayProducts(data.items);
      setTotalItems(data.total);
    }
  }, [data]);

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

  const totalPages = Math.ceil(totalItems / size);

  const table = useReactTable({
    data: displayProducts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <h2 className='text-2xl font-bold mb-2 mt-10'>관련 상품 목록</h2>
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
          <div className='flex gap-1'>
            <ProductCreateButton storeId={popupstore.id} />
          </div>
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
    </>
  );
}