'use client'

import React from 'react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

/**
 * Debug component to visualize intersection observer behavior
 * Only use in development mode
 */
export function IntersectionDebug({ 
  children, 
  label = 'Section',
  showDebug = process.env.NODE_ENV === 'development'
}: { 
  children: React.ReactNode
  label?: string
  showDebug?: boolean
}) {
  const { ref, isIntersecting, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: false, // Keep observing for debug
  })

  if (!showDebug) {
    return <>{children}</>
  }

  return (
    <div ref={ref} className="relative">
      {children}
      <div className="fixed bottom-4 right-4 z-50 rounded bg-black/80 p-2 text-xs text-white">
        <div>{label}</div>
        <div>Intersecting: {isIntersecting ? '✅' : '❌'}</div>
        <div>Has Intersected: {hasIntersected ? '✅' : '❌'}</div>
      </div>
    </div>
  )
}