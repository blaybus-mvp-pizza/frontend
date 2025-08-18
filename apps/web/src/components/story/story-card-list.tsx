'use client';

import StoryCard from '@/components/story/story-card';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { useStoriesWithPagination } from '@/hooks/queries/useStories';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export default function StoryCardList() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = parseInt(searchParams.get('page') || String(1));
  const filters = useMemo(
    () => ({
      page,
      pageSize: 9,
    }),
    [page]
  );

  const { data, isLoading, isPlaceholderData } =
    useStoriesWithPagination(filters);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stories = data?.data || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages || 1;

  return (
    <>
      {isLoading && !isPlaceholderData ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[20px] gap-y-[56px] justify-items-center'>
          {Array.from({ length: 9 }).map((_, index) => (
            <StoryCardSkeleton key={index} />
          ))}
        </div>
      ) : stories.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[20px] gap-y-[56px] justify-items-center'>
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onClick={() => {
                router.push(`/story/${story.id}`);
              }}
            />
          ))}
        </div>
      ) : (
        <div className='text-center'>No Results</div>
      )}

      {totalPages > 1 && (
        <div className='flex justify-center py-20'>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}

const StoryCardSkeleton = () => (
  <div className='w-[301px] flex flex-col rounded-[1px] overflow-hidden'>
    <Skeleton className='w-full aspect-video' />
    <div className='px-4 pt-4 pb-6 space-y-3'>
      <Skeleton className='w-2/3 h-5 mb-2' />
      <Skeleton className='w-full h-4' />
      <Skeleton className='w-full h-4' />
    </div>
    <div className='bg-[#F5F5F5] w-full p-4 flex items-center space-x-4'>
      <Skeleton className='w-10 h-10 rounded-sm' />
      <div className='flex flex-col flex-1 space-y-2'>
        <Skeleton className='w-3/4 h-3' />
        <Skeleton className='w-1/2 h-3' />
      </div>
    </div>
  </div>
);
