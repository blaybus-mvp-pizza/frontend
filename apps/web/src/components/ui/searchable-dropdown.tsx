'use client'

import { useEffect, useRef, useState } from 'react'

import { cn } from '@workspace/ui/lib/utils'
import { ChevronDown, Search, X } from 'lucide-react'

interface DropdownOption {
  value: string
  label: string
  icon?: React.ReactNode
}

interface SearchableDropdownProps {
  options: DropdownOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  className?: string
  showSearch?: boolean
}

export function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder = '선택하세요',
  searchPlaceholder = '검색...',
  className,
  showSearch = true,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Find the current selected option
  const selectedOption = options.find((opt) => opt.value === value)

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && showSearch && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen, showSearch])

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
    setSearchQuery('')
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
    setSearchQuery('')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'focus:ring-brand-mint flex items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-all hover:border-gray-400 focus:border-transparent focus:outline-none focus:ring-2',
          isOpen && 'ring-brand-mint border-gray-400 ring-2',
          className,
        )}
      >
        <div className="mr-2 flex flex-1 items-center">
          {selectedOption?.icon && <span className="mr-2">{selectedOption.icon}</span>}
          <span className={cn('truncate', !selectedOption && 'text-gray-500')}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <div className="flex items-center">
          {selectedOption && value && (
            <X className="mr-1 h-4 w-4 text-gray-400 hover:text-gray-600" onClick={handleClear} />
          )}
          <ChevronDown
            className={cn('h-4 w-4 text-gray-600 transition-transform', isOpen && 'rotate-180')}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          {/* Search Input */}
          {showSearch && (
            <div className="border-b border-gray-100 p-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="focus:ring-brand-mint w-full rounded-md border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-transparent focus:outline-none focus:ring-2"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-auto py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'flex w-full items-center px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50',
                    option.value === value && 'bg-brand-mint/20 font-medium',
                  )}
                >
                  {option.icon && <span className="mr-2">{option.icon}</span>}
                  <span>{option.label}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-center text-sm text-gray-500">
                검색 결과가 없습니다
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
