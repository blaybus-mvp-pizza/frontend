'use client'

import Image from 'next/image'

import { useUserProfile } from '@/api/hooks/queries/useMyPage'
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
    <div className={cn('flex h-[88px] items-center gap-3 px-6 py-4', 'bg-background-100')}>
      <div
        className={cn('h-12 w-12 shrink-0 overflow-hidden rounded-full', 'border border-[#E5E5EC]')}
      >
        <img
          src={user?.profile_image_url || '/images/Default_user.webp'}
          alt="profile"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="line-clamp-1 text-lg font-semibold">{user?.nickname}</div>
      <button
        onClick={onEditClick}
        className="flex h-[30px] items-center justify-center rounded border border-[#E5E5EC] bg-white pb-[6px] pl-[10px] pr-[6px] pt-[6px] text-[13px] font-semibold shadow-none outline-none focus:outline-none"
      >
        정보 수정
        <Image src="/icons/ChevronRight.svg" alt=">" width={16} height={16} />
      </button>
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
