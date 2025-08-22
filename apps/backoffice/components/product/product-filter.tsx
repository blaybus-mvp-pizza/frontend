"use client";

import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@workspace/ui/components/select";
import { Search } from "lucide-react";
import { categoryMap } from "@/constants/proudct.constant";

type ProductFilterProps = {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
};

export function ProductFilter({
  globalFilter,
  setGlobalFilter,
  category,
  setCategory,
  status,
  setStatus,
}: ProductFilterProps) {
  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
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

      <Select onValueChange={handleCategoryChange} value={category}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='카테고리 필터' />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(categoryMap).map((key) => (
            <SelectItem key={key} value={key}>
              {categoryMap[key]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={handleStatusChange} value={status}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='판매 상태 필터' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='ALL'>전체</SelectItem>
          <SelectItem value='AVAILABLE'>판매중</SelectItem>
          <SelectItem value='SOLD'>판매완료</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}