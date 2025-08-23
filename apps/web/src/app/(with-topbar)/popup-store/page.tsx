// apps/web/src/app/(with-topbar)/popup-stores/page.tsx
import { Suspense } from 'react'

import PopupStoreContent from '@/components/popup-stores/popup-store-content'
import { Skeleton } from '@/components/ui/skeleton'

function PopupStorePageSkeleton() {
  return (
    <div className="min-h-screen p-4">
      {/* Banner skeleton */}
      <div className="mb-8 grid grid-cols-4 gap-2">
        <Skeleton className="col-span-2 row-span-2 aspect-square" />
        <Skeleton className="aspect-square" />
        <Skeleton className="aspect-square" />
        <Skeleton className="aspect-square" />
        <Skeleton className="aspect-square" />
      </div>

      {/* Title skeleton */}
      <div className="py-8 text-center">
        <Skeleton className="mx-auto mb-2 h-8 w-48" />
        <Skeleton className="mx-auto h-4 w-64" />
      </div>

      {/* Products grid skeleton */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-square" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-20" />
            <div className="flex gap-1">
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PopupStorePage() {
  return (
    <Suspense fallback={<PopupStorePageSkeleton />}>
      <PopupStoreContent />
    </Suspense>
  )
}
