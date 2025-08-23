"use client";

import { Input } from "@workspace/ui/components/input";
import { Search } from "lucide-react";

type PopUpStoreFilterProps = {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
};

export function PopUpStoreFilter({
  globalFilter,
  setGlobalFilter,
}: PopUpStoreFilterProps) {
  return (
    <div className='flex items-center gap-2 py-4'>
      <div className='relative'>
        <Input
          placeholder='팝업스토어명으로 검색'
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className='max-w-sm pl-9 border-black'
        />
        <Search className='absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
      </div>
    </div>
  );
}
