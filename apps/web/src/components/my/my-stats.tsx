"use client";

import { useUserStats } from "@/hooks/queries/useMyItems";
import { Skeleton } from "../ui/skeleton";
import CountItem from "./count-item";

export default function MyStats() {
  const { data, isLoading } = useUserStats();

  if (isLoading || !data) {
    return <MyStatsSkeleton />;
  }

  const userStats = [
    { label: "경매 진행 상품", count: data.inProgress },
    { label: "입금 확인 중", count: data.depositing },
    { label: "배송중인 상품", count: data.inDelivery },
    { label: "배송완료 상품", count: data.deliveryCompleted },
  ];

  return (
    <div className='flex gap-2 flex-grow h-full flex-wrap'>
      {userStats.map((item, index) => (
        <CountItem
          key={index}
          label={item.label}
          count={item.count}
          className='flex-grow h-full'
        />
      ))}
    </div>
  );
}

function MyStatsSkeleton() {
  return (
    <div className='flex gap-2 flex-grow h-full flex-wrap'>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className='flex gap-2 flex-grow h-full flex-wrap'>
          <div className='flex flex-grow h-full flex-col gap-1.5 items-center justify-center text-center bg-white px-6 py-4'>
            <Skeleton className='h-6 w-15' />
            <Skeleton className='h-6 w-20' />
          </div>
        </div>
      ))}
    </div>
  );
}
