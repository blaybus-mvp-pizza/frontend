'use client'

import Image from 'next/image'

import { ChevronRight } from 'lucide-react'

interface StoreInfoProps {
  store: {
    name: string
    description?: string
    image_url?: string
  }
}

export function StoreInfo({ store }: StoreInfoProps) {
  return (
    <div className="space-y-3 bg-[#F6F6F6] p-4">
      <div className="flex items-start gap-4">
        <div className="flex flex-1 flex-col">
          <h3 className="text-text-primary text-lg font-bold">{store.name}</h3>
          {store.description && (
            <p className="text-text-secondary mt-1 text-sm">{store.description}</p>
          )}
        </div>
        <div className="relative h-10 w-10 overflow-hidden rounded-sm">
          <Image
            src={store.image_url || '/placeholder.png'}
            alt={store.name}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
      </div>
      <div className="flex items-center justify-between bg-white px-4 py-2">
        <p className="text-text-primary text-sm">
          이 상품과 <span className="font-semibold">함께 판매하는 상품이 있어요!</span>
        </p>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  )
}
