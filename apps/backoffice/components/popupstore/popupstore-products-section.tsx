"use client";

import { columns } from "@/components/product/columns";
import { DataTable } from "@/components/product/data-table";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { ProductFilter } from "../product/product-filter";
import ProductCreateButton from "../product/product-create-button";
import { TPOPUPSTORE } from "@/types";
import { useProductList } from "@/hooks/use-products";
import { ProductItem } from "@/app/api/product/type";

type PopUpStoreProductsSectionProps = {
  popupstore: TPOPUPSTORE;
};

export default function PopUpStoreProductsSection({
  popupstore,
}: PopUpStoreProductsSectionProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data } = useProductList({
    page: 1,
    size: 100,
    q: globalFilter,
    store_id: popupstore.id,
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

  return (
    <>
      <h2 className='text-2xl font-bold mb-2 mt-10'>관련 상품 목록</h2>
      <>
        <div className='flex justify-between items-center'>
          <ProductFilter
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
          <div className='flex gap-1'>
            <ProductCreateButton storeId={popupstore.id} />
          </div>
        </div>
        <DataTable table={table} />
      </>
    </>
  );
}
