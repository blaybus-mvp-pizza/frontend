'use client'

import React from 'react'
import { motion } from 'framer-motion'

import StoreSection from '@/components/home/StoreSection'
import { LazyStoreSection } from '@/components/common/LazySection'
import { useStoreMeta, useStoreProductMeta } from '@/hooks/queries/useProductDetail'
import { useLazyLoad } from '@/hooks/useIntersectionObserver'
import { PopupStoreSectionSkeleton } from '@/components/ui/skeleton'

interface LazyStoreSectionProps {
  storeId: number
  onProductClick: (productId: number) => void
  delay?: number
}

/**
 * Lazy-loaded store section that only fetches data when approaching viewport
 */
function LazyStoreSectionContent({ 
  storeId, 
  onProductClick, 
  delay = 0 
}: LazyStoreSectionProps) {
  const { ref, shouldLoad } = useLazyLoad({
    rootMargin: '200px',
    threshold: 0.1,
    triggerOnce: true,
  })

  // Only fetch data when the component should load
  const { data: storeMeta, isLoading: storeMetaLoading } = useStoreMeta(storeId, {
    enabled: shouldLoad,
  })

  const { data: storeProductMeta, isLoading: storeProductMetaLoading } = useStoreProductMeta(storeId, {
    enabled: shouldLoad,
  })

  const isLoading = storeMetaLoading || storeProductMetaLoading

  return (
    <div ref={ref}>
      {!shouldLoad ? (
        <PopupStoreSectionSkeleton />
      ) : isLoading ? (
        <PopupStoreSectionSkeleton />
      ) : storeMeta && storeProductMeta ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay }}
        >
          <StoreSection
            storeData={storeMeta}
            productData={storeProductMeta.items}
            onProductClick={onProductClick}
          />
        </motion.div>
      ) : null}
    </div>
  )
}

/**
 * Container component for multiple lazy-loaded store sections
 */
interface LazyStoreSectionsProps {
  storeIds: number[]
  onProductClick: (productId: number) => void
}

export function LazyStoreSections({ 
  storeIds, 
  onProductClick 
}: LazyStoreSectionsProps) {
  return (
    <>
      {storeIds.map((storeId, index) => (
        <LazyStoreSectionContent
          key={`lazy-store-${storeId}`}
          storeId={storeId}
          onProductClick={onProductClick}
          delay={index * 0.1} // Stagger animation delays
        />
      ))}
    </>
  )
}

export default LazyStoreSectionContent