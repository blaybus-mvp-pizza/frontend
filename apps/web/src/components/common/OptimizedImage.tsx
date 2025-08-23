'use client'

import { useState } from 'react'

import Image from 'next/image'

import { cn } from '@/utils/cn'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  sizes?: string
  fill?: boolean
  width?: number
  height?: number
  onLoad?: () => void
  fallbackSrc?: string
}

const PLACEHOLDER_BLUR =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAACAAIDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmX/9k='

export function OptimizedImage({
  src,
  alt,
  className,
  priority = false,
  sizes,
  fill = false,
  width,
  height,
  onLoad,
  fallbackSrc = '/placeholder.png',
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setError(true)
    setIsLoading(false)
  }

  // 에러 발생 시 fallback 이미지 사용
  const imageSrc = error ? fallbackSrc : src

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* 로딩 중일 때 표시할 스켈레톤 */}
      {isLoading && <div className="absolute inset-0 animate-pulse bg-gray-200" />}

      {fill ? (
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className={cn(
            'transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            className,
          )}
          sizes={sizes || '100vw'}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          placeholder="blur"
          blurDataURL={PLACEHOLDER_BLUR}
          onLoad={handleLoad}
          onError={handleError}
          quality={85}
        />
      ) : (
        <Image
          src={imageSrc}
          alt={alt}
          width={width || 400}
          height={height || 400}
          className={cn(
            'transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            className,
          )}
          sizes={sizes}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          placeholder="blur"
          blurDataURL={PLACEHOLDER_BLUR}
          onLoad={handleLoad}
          onError={handleError}
          quality={85}
        />
      )}
    </div>
  )
}
