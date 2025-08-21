"use client";

import { useUserProfile } from "@/hooks/queries/useMyItems";
import { Button } from "@workspace/ui/components/button";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/utils/cn";

interface UserProfileProps {
  onEditClick: () => void;
}

export default function MyProfile({ onEditClick }: UserProfileProps) {
  const { data: user, isLoading, isPlaceholderData } = useUserProfile();

  if (isLoading && !isPlaceholderData) {
    return <MyProfileSkeleton />;
  }

  return (
    <div className={cn(
      'flex gap-3 items-center px-6 py-4 h-full',
      'bg-background-100'
    )}>
      <div className={cn(
        'w-14 h-14 rounded-full overflow-hidden border',
        'border-border-default'
      )}>
        <img
          src={user?.profileImageUrl}
          alt='profile'
          className='h-full w-full object-cover'
        />
      </div>
      <div className='text-lg font-semibold'>{user?.nickname}</div>
      <Button
        onClick={onEditClick}
        className={cn(
          'flex items-center gap-0 rounded text-[13px] font-semibold p-1.5',
          'bg-background-100 text-text-primary border border-border-default',
          'hover:bg-background-200'
        )}
      >
        정보 수정 <ChevronRight />
      </Button>
    </div>
  );
}

function MyProfileSkeleton() {
  return (
    <div className={cn(
      'flex gap-3 items-center px-6 py-4 h-full',
      'bg-background-100'
    )}>
      <Skeleton className='w-14 h-14 rounded-full' />
      <Skeleton className='h-6 w-16' />
      <Skeleton className='h-8 w-20' />
    </div>
  );
}
