"use client";

import { Search } from "lucide-react";
import { ChangeEvent } from "react";

interface SearchbarProps {
  onSearchChange: (value: string) => void;
}

export default function Searchbar({ onSearchChange }: SearchbarProps) {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };
  return (
    <div className='rounded-none gap-2.5 relative w-full border border-gray-200'>
      <input
        className='bg-[#f5f5f5] px-4 w-full h-10 text-sm
                    border border-transparent focus:outline-none focus:ring-1'
        placeholder='상품명 또는 브랜드 검색'
        onChange={handleInputChange}
      />
      <Search className='absolute right-2 top-1/2 -translate-y-1/2 text-black w-5 h-5' />
    </div>
  );
}
