import { cn } from '@workspace/ui/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-md bg-gray-200', className)} {...props} />
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-white">
      <Skeleton className="h-64 w-full" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  )
}

export function ProductListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}

export function CategoryTagSkeleton() {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg bg-[#f6f6f6] p-2 sm:gap-2 sm:p-3 md:gap-3 md:p-4">
      <Skeleton className="h-8 w-8 rounded-full sm:h-10 sm:w-10 md:h-12 md:w-12" />
      <Skeleton className="h-3 w-16" />
    </div>
  )
}

export function PopupStoreSectionSkeleton() {
  return (
    <div className="mt-20 w-full space-y-2">
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-x-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-8 w-full sm:w-64" />
      </div>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-x-8">
        <Skeleton className="h-[300px] sm:h-[350px] lg:h-[400px] w-full lg:w-[600px]" />
        <div className="grid grid-cols-2 gap-4 lg:flex lg:gap-4">
          <div className="w-full lg:w-64">
            <ProductCardSkeleton />
          </div>
          <div className="w-full lg:w-64">
            <ProductCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}
