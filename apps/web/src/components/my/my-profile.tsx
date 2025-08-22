'use client'

import { Button } from '@workspace/ui/components/button'
import { ChevronRight } from 'lucide-react'

import { useUserProfile } from '@/hooks/queries/useMyItems'
import { cn } from '@/utils/cn'

import { Skeleton } from '../ui/skeleton'

interface UserProfileProps {
  onEditClick: () => void
}

export default function MyProfile({ onEditClick }: UserProfileProps) {
  const { data: user, isLoading, isPlaceholderData } = useUserProfile()

  if (isLoading && !isPlaceholderData) {
    return <MyProfileSkeleton />
  }

  return (
    <div className={cn('flex h-full items-center gap-3 px-6 py-4', 'bg-background-100')}>
      <div className={cn('h-14 w-14 overflow-hidden rounded-full border', 'border-border-default')}>
        <img src={user?.profileImageUrl} alt="profile" className="h-full w-full object-cover" />
      </div>
      <div className="text-lg font-semibold">{user?.nickname}</div>
      <Button
        onClick={onEditClick}
        className={cn(
          'flex items-center gap-0 rounded p-1.5 text-[13px] font-semibold',
          'bg-background-100 text-text-primary border-border-default border',
          'hover:bg-background-200',
        )}
      >
        정보 수정 <ChevronRight />
      </Button>
    </div>
  )
}

function MyProfileSkeleton() {
  return (
    <div className={cn('flex h-full items-center gap-3 px-6 py-4', 'bg-background-100')}>
      <Skeleton className="h-14 w-14 rounded-full" />
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-8 w-20" />
    </div>
  )
}
