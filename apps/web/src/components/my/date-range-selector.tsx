'use client'

import { SetStateAction, useEffect, useState } from 'react'

import { Button } from '@workspace/ui/components/button'
import { Calendar } from '@workspace/ui/components/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/popover'
import { format, startOfDay, subMonths } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChevronDownIcon } from 'lucide-react'

const dateRanges = [
  { label: '최근 1개월', value: '1month' },
  { label: '최근 3개월', value: '3months' },
  { label: '직접 입력', value: 'custom' },
]

interface DateRangeSelectorProps {
  onDateRangeChange: (from: Date | undefined, to: Date | undefined) => void
}

export default function DateRangeSelector({ onDateRangeChange }: DateRangeSelectorProps) {
  const [selectedRange, setSelectedRange] = useState('1month')
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined)
  const [toDate, setToDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    const today = startOfDay(new Date())
    let newFromDate: Date | undefined
    let newToDate: Date | undefined
    switch (selectedRange) {
      case '1month':
        newFromDate = subMonths(today, 1)
        newToDate = today
        break
      case '3months':
        newFromDate = subMonths(today, 3)
        newToDate = today
        break
      default:
        return
    }
    setFromDate(newFromDate)
    setToDate(newToDate)
    onDateRangeChange(newFromDate, newToDate)
  }, [selectedRange, onDateRangeChange])

  useEffect(() => {
    if (selectedRange === 'custom' && fromDate && toDate) {
      onDateRangeChange(fromDate, toDate)
    }
  }, [fromDate, toDate, selectedRange, onDateRangeChange])

  const handleRangeClick = (range: SetStateAction<string>) => {
    setSelectedRange(range)
  }

  const handleFromDateSelect = (date: Date | undefined) => {
    setFromDate(date)
    if (toDate) {
      onDateRangeChange(date, toDate)
    }
    setSelectedRange('custom')
  }

  const handleToDateSelect = (date: Date | undefined) => {
    setToDate(date)
    if (fromDate) {
      onDateRangeChange(fromDate, date)
    }
    setSelectedRange('custom')
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="flex items-center rounded-md">
        {dateRanges.map((range, idx) => (
          <Button
            key={range.value}
            className={`h-12 min-w-[100px] flex-1 border bg-transparent p-5 shadow-none transition-colors hover:bg-gray-100 ${
              selectedRange === range.value
                ? 'z-10 border-black text-black'
                : 'border-gray-200 text-gray-300'
            } ${idx > 0 ? '-ml-[1px]' : ''} ${
              idx === 0
                ? 'rounded-l-md rounded-r-none'
                : idx === dateRanges.length - 1
                  ? 'rounded-l-none rounded-r-md'
                  : 'rounded-none'
            }`}
            onClick={() => handleRangeClick(range.value)}
          >
            {range.label}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <DateButton label="시작일" date={fromDate} onDateSelect={handleFromDateSelect} />
        <span>~</span>
        <DateButton label="종료일" date={toDate} onDateSelect={handleToDateSelect} />
      </div>
    </div>
  )
}

function DateButton({
  label,
  date,
  onDateSelect,
}: {
  label: string
  date: Date | undefined
  onDateSelect: (date: Date | undefined) => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-38 justify-between rounded border-gray-200 p-5 shadow-none hover:bg-gray-100"
        >
          {date ? format(date, 'PPP', { locale: ko }) : label}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateSelect}
          locale={ko}
          captionLayout="dropdown"
          defaultMonth={date}
        />
      </PopoverContent>
    </Popover>
  )
}
