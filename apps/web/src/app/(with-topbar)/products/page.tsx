import { Suspense } from 'react'

import ProductContent from '@/components/products/product-content'
import { ProductListSkeleton } from '@/components/ui/skeleton'

// Main component with Suspense boundary
export default function ProductPage() {
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
      <ProductContent />
    </Suspense>
  )
}
