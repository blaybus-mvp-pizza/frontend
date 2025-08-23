import { Suspense } from 'react'

import SearchContent from '@/components/search/search-content'
import { ProductListSkeleton } from '@/components/ui/skeleton'

// Search results page with Suspense boundary
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <ProductListSkeleton />
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}