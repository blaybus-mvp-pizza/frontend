"use client";

import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@workspace/ui/components/select";
import { ColumnFiltersState } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { categoryMap } from "@/constants/proudct.constant";

type ProductFilterProps = {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  columnFilters: ColumnFiltersState;
  setColumnFilters: (
    updater:
      | ColumnFiltersState
      | ((old: ColumnFiltersState) => ColumnFiltersState)
  ) => void;
};

export function ProductFilter({
  globalFilter,
  setGlobalFilter,
  columnFilters,
  setColumnFilters,
}: ProductFilterProps) {
  const handleCategoryChange = (value: string) => {
    if (value === "all") {
      setColumnFilters((prev) => prev.filter((f) => f.id !== "category"));
    } else {
      setColumnFilters((prev) => {
        const existingFilter = prev.find((f) => f.id === "category");
        if (existingFilter) {
          return prev.map((f) => (f.id === "category" ? { ...f, value } : f));
        }
        return [...prev, { id: "category", value }];
      });
    }
  };

  const handleIsSoldChange = (value: string) => {
    if (value === "all") {
      setColumnFilters((prev) => prev.filter((f) => f.id !== "is_sold"));
    } else {
      setColumnFilters((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        const existingFilter = safePrev.find((f) => f.id === "is_sold");
        const booleanValue = value === "true";
        if (existingFilter) {
          return prev.map((f) =>
            f.id === "is_sold" ? { ...f, value: booleanValue } : f
          );
        }
        return [...prev, { id: "is_sold", value: booleanValue }];
      });
    }
  };

  return (
    <div className='flex items-center gap-2 py-4'>
      <div className='relative'>
        <Input
          placeholder='상품명으로 검색'
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className='max-w-sm pl-9'
        />
        <Search className='absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
      </div>

      <Select onValueChange={handleCategoryChange}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='카테고리 필터' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>전체</SelectItem>
          {Object.keys(categoryMap).map((key) => (
            <SelectItem key={key} value={key}>
              {categoryMap[key]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={handleIsSoldChange}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='판매 상태 필터' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>전체</SelectItem>
          <SelectItem value='false'>판매중</SelectItem>
          <SelectItem value='true'>판매완료</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
