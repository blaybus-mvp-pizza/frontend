'use client'

import { useEffect, useRef, useState } from 'react'

import { cn } from '@workspace/ui/lib/utils'
import { ChevronDown } from 'lucide-react'

interface DropdownOption {
  value: string
  label: string
}

interface DropdownProps {
  options: DropdownOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = '선택하세요',
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Find the current selected option
  const selectedOption = options.find((opt) => opt.value === value)

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'focus:ring-brand-mint flex items-center justify-between rounded border border-gray-300 bg-white px-4 py-2 text-sm transition-all hover:border-gray-400 focus:border-transparent focus:outline-none focus:ring-2',
          isOpen && 'ring-brand-mint border-gray-400 ring-2',
          `${placeholder === '정렬' ? 'border-none focus:ring-0' : ''}`,
          className,
        )}
      >
        <span className={cn('mr-2', !selectedOption && 'text-gray-500')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn('h-4 w-4 text-gray-600 transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="max-h-60 overflow-auto py-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={cn(
                  'w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50',
                  option.value === value && 'bg-brand-mint/20 font-medium',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Multi-select dropdown component
interface MultiSelectDropdownProps {
  options: DropdownOption[]
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelectDropdown({
  options,
  values,
  onChange,
  placeholder = '선택하세요',
  className,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleToggle = (optionValue: string) => {
    if (values.includes(optionValue)) {
      onChange(values.filter((v) => v !== optionValue))
    } else {
      onChange([...values, optionValue])
    }
  }

  const selectedLabels = options
    .filter((opt) => values.includes(opt.value))
    .map((opt) => opt.label)
    .join(', ')

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
        <span className={cn('mr-2 truncate', !selectedLabels && 'text-gray-500')}>
          {selectedLabels || placeholder}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 flex-shrink-0 text-gray-600 transition-transform',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="max-h-60 overflow-auto py-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleToggle(option.value)}
                className={cn(
                  'flex w-full items-center px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50',
                  values.includes(option.value) && 'bg-brand-mint/20 font-medium',
                )}
              >
                <input
                  type="checkbox"
                  checked={values.includes(option.value)}
                  onChange={() => {}}
                  className="accent-brand-mint mr-2"
                />
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
