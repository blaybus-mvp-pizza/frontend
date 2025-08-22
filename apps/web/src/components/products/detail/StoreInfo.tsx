'use client'

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
          <h3 className="text-lg font-bold text-[#111111]">{store.name}</h3>
          {store.description && <p className="mt-1 text-sm text-[#505050]">{store.description}</p>}
        </div>
        <img
          src={store.image_url || '/placeholder.png'}
          alt={store.name}
          className="h-10 w-10 rounded-sm object-cover"
        />
      </div>
      <div className="flex items-center justify-between bg-white px-4 py-2">
        <p className="text-sm text-[#111111]">
          이 상품과 <span className="font-semibold">함께 판매하는 상품이 있어요!</span>
        </p>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  )
}
