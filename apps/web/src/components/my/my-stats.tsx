'use client'

import { useUserStats } from '@/hooks/queries/useMyItems'

import { Skeleton } from '../ui/skeleton'
import CountItem from './count-item'

export default function MyStats() {
  const { data, isLoading } = useUserStats()

  if (isLoading || !data) {
    return <MyStatsSkeleton />
  }

  const userStats = [
    { label: '경매 진행 상품', count: data.inProgress },
    { label: '입금 확인 중', count: data.depositing },
    { label: '배송중인 상품', count: data.inDelivery },
    { label: '배송완료 상품', count: data.deliveryCompleted },
  ]

  return (
    <div className="flex h-full flex-grow flex-wrap gap-2">
      {userStats.map((item, index) => (
        <CountItem key={index} label={item.label} count={item.count} className="h-full flex-grow" />
      ))}
    </div>
  )
}

function MyStatsSkeleton() {
  return (
    <div className="flex h-full flex-grow flex-wrap gap-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex h-full flex-grow flex-wrap gap-2">
          <div className="flex h-full flex-grow flex-col items-center justify-center gap-1.5 bg-white px-6 py-4 text-center">
            <Skeleton className="w-15 h-6" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}
