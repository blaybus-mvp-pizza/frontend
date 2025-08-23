import { useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number | number[]
  rootMargin?: string
  triggerOnce?: boolean
  enabled?: boolean
}

interface UseIntersectionObserverReturn {
  ref: React.RefObject<HTMLDivElement | null>
  isIntersecting: boolean
  hasIntersected: boolean
}

/**
 * Hook to observe when an element enters the viewport
 * Uses IntersectionObserver API for efficient viewport detection
 */
export function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = '100px',
  triggerOnce = true,
  enabled = true,
}: UseIntersectionObserverOptions = {}): UseIntersectionObserverReturn {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)

  useEffect(() => {
    if (!enabled) return

    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        
        setIsIntersecting(entry.isIntersecting)
        
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true)
          
          // If triggerOnce is true, stop observing after first intersection
          if (triggerOnce) {
            observer.unobserve(element)
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
      observer.disconnect()
    }
  }, [threshold, rootMargin, triggerOnce, enabled, hasIntersected])

  return {
    ref,
    isIntersecting,
    hasIntersected,
  }
}

/**
 * Hook for lazy loading API data when element enters viewport
 * Prevents API calls until the content is about to be visible
 */
export function useLazyLoad(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn & { shouldLoad: boolean } {
  const intersectionResult = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '200px', // Start loading 200px before element is visible
    triggerOnce: true,
    ...options,
  })

  return {
    ...intersectionResult,
    shouldLoad: intersectionResult.hasIntersected,
  }
}