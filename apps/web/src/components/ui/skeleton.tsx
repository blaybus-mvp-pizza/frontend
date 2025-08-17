import { cn } from "@workspace/ui/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200",
        className
      )}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <Skeleton className="h-64 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

export function ProductListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export function CategoryTagSkeleton() {
  return (
    <div className="bg-[#f6f6f6] rounded-lg p-2 sm:p-3 md:p-4 flex flex-col items-center gap-1 sm:gap-2 md:gap-3">
      <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

export function PopupStoreSectionSkeleton() {
  return (
    <div className="w-full space-y-2 mt-20">
      <div className="mt-8 flex gap-x-2 items-center">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-8 w-64" />
      </div>
      <div className="flex h-[400px] gap-x-8">
        <Skeleton className="w-[600px] h-[400px]" />
        <div className="flex gap-4">
          <div className="w-64">
            <ProductCardSkeleton />
          </div>
          <div className="w-64">
            <ProductCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}