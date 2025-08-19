"use client";

import { useUserProfile } from "@/hooks/queries/useMyItems";
import { Button } from "@workspace/ui/components/button";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface UserProfileProps {
  onEditClick: () => void;
}

export default function MyProfile({ onEditClick }: UserProfileProps) {
  const { data: user, isLoading, isPlaceholderData } = useUserProfile();

  if (isLoading && !isPlaceholderData) {
    return <MyProfileSkeleton />;
  }

  return (
    <div className='flex gap-3 items-center bg-white px-6 py-4 h-full'>
      <div className='w-14 h-14 rounded-full overflow-hidden border-1 border-gray-200'>
        <img
          src={user?.profileImageUrl}
          alt='profile'
          className='h-full w-full object-cover'
        />
      </div>
      <div className='text-lg font-semibold'>{user?.nickname}</div>
      <Button
        onClick={onEditClick}
        className='flex items-center gap-0 bg-white text-black border-1 border-gray-200 rounded hover:bg-gray-100 text-[13px] font-semibold p-1.5'
      >
        정보 수정 <ChevronRight />
      </Button>
    </div>
  );
}

function MyProfileSkeleton() {
  return (
    <div className='flex gap-3 items-center bg-white px-6 py-4 h-full'>
      <Skeleton className='w-14 h-14 rounded-full' />
      <Skeleton className='h-6 w-16' />
      <Skeleton className='h-8 w-20' />
    </div>
  );
}
