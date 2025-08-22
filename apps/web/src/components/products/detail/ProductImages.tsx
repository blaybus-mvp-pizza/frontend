'use client'

import { useState } from 'react'

import Image from 'next/image'

import { Typography } from '@workspace/ui/components/typography'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/utils/cn'

// Base64 encoded shimmer placeholder
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="20%" />
      <stop stop-color="#edeef1" offset="50%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

const dataUrl = `data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`

interface ProductImagesProps {
  images: string[]
  productName: string
}

export function ProductImages({ images, productName }: ProductImagesProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gray-100 text-gray-400">
        <Typography variant="body2">이미지 없음</Typography>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={images[selectedImageIndex] || '/placeholder.png'}
          alt={productName}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL={dataUrl}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
              disabled={selectedImageIndex === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur transition-colors hover:bg-white disabled:opacity-50"
              aria-label="이전 이미지"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() =>
                setSelectedImageIndex(Math.min(images.length - 1, selectedImageIndex + 1))
              }
              disabled={selectedImageIndex === images.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur transition-colors hover:bg-white disabled:opacity-50"
              aria-label="다음 이미지"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
              {selectedImageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={cn(
                'relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                selectedImageIndex === index
                  ? 'border-black'
                  : 'border-gray-200 hover:border-gray-400',
              )}
            >
              <Image
                src={image}
                alt={`${productName} ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
                placeholder="blur"
                blurDataURL={dataUrl}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
