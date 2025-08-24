'use client'

import { ChangeEvent } from 'react'

import { Search } from 'lucide-react'

interface SearchbarProps {
  onSearchChange: (value: string) => void
}

export default function Searchbar({ onSearchChange }: SearchbarProps) {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value)
  }
  return (
    <div className="relative w-full gap-2.5 rounded border-none border-gray-200">
      <input
        className="h-10 w-full border border-[#f8f8f8] bg-[#f8f8f8] px-4 text-sm text-black focus:outline-none focus:ring-1"
        placeholder="상품명 또는 브랜드명 검색"
        onChange={handleInputChange}
      />
      <Search className="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 text-black" />
    </div>
  )
}
