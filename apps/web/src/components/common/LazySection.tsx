'use client'

import React from 'react'
import { motion } from 'framer-motion'

import { useLazyLoad } from '@/hooks/useIntersectionObserver'

interface LazySectionProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
  rootMargin?: string
  threshold?: number
  animateOnLoad?: boolean
}

/**
 * Lazy loading wrapper component that only renders children when in viewport
 * Useful for sections that require API calls or expensive rendering
 */
export function LazySection({
  children,
  fallback,
  className,
  rootMargin = '200px',
  threshold = 0.1,
  animateOnLoad = true,
}: LazySectionProps) {
  const { ref, shouldLoad, hasIntersected } = useLazyLoad({
    rootMargin,
    threshold,
    triggerOnce: true,
  })

  return (
    <div ref={ref} className={className}>
      {shouldLoad ? (
        animateOnLoad ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {children}
          </motion.div>
        ) : (
          children
        )
      ) : (
        fallback || <div className="h-64 w-full" /> // Default placeholder height
      )}
    </div>
  )
}

/**
 * Lazy loading wrapper for product sections with proper skeleton fallback
 */
export function LazyProductSection({
  children,
  skeletonHeight = 'h-64',
  className,
  ...props
}: LazySectionProps & { skeletonHeight?: string }) {
  const fallback = (
    <div className={`animate-pulse rounded-lg bg-gray-200 ${skeletonHeight}`} />
  )

  return (
    <LazySection {...props} fallback={fallback} className={className}>
      {children}
    </LazySection>
  )
}

/**
 * Lazy loading wrapper for store sections with proper skeleton fallback
 */
export function LazyStoreSection({
  children,
  className,
  ...props
}: LazySectionProps) {
  const fallback = (
    <div className="mt-12 space-y-4 md:mt-16 lg:mt-20">
      <div className="flex animate-pulse items-center gap-2">
        <div className="h-8 w-32 rounded bg-gray-200" />
        <div className="h-6 w-64 rounded bg-gray-200" />
      </div>
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-x-8">
        <div className="aspect-square w-full animate-pulse rounded-lg bg-gray-200 lg:h-[400px] lg:max-w-[442px]" />
        <div className="flex gap-3 sm:gap-4">
          <div className="aspect-[3/4] w-32 animate-pulse rounded-lg bg-gray-200" />
          <div className="aspect-[3/4] w-32 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  )

  return (
    <LazySection {...props} fallback={fallback} className={className}>
      {children}
    </LazySection>
  )
}