'use client'

import { ProductCard } from '@workspace/ui/components/product-card'
import type { Auction, Product } from '@workspace/ui/types'

interface SimilarProductItem {
  product_id: number
  popup_store_name: string
  product_name: string
  current_highest_bid?: number
  buy_now_price?: number
  representative_image?: string | null
  auction_ends_at?: string
}

interface SimilarProductsProps {
  items: SimilarProductItem[]
}

export function SimilarProducts({ items }: SimilarProductsProps) {
  if (!items || items.length === 0) return null

  return (
    <div className="border-border-light mt-10 space-y-4 border-t pt-4">
      <p className="text-text-primary">비슷한 상품</p>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {items.map((item) => {
          // Transform API response to Product and Auction objects
          const product: Product = {
            id: item.product_id,
            popupStoreId: 0,
            category: '',
            name: item.product_name,
            price: item.buy_now_price || 0,
            stock: 0,
            shippingBaseFee: 0,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            images: item.representative_image
              ? [
                  {
                    id: 1,
                    productId: item.product_id,
                    imageUrl: item.representative_image,
                    sortOrder: 0,
                  },
                ]
              : [],
            popupStore: {
              id: 0,
              name: item.popup_store_name,
              createdAt: new Date(),
            },
            currentHighestBid: item.current_highest_bid,
            buyNowPrice: item.buy_now_price,
            auctionEndsAt: item.auction_ends_at,
          }

          const auction: Auction | undefined = item.auction_ends_at
            ? {
                id: 0,
                productId: item.product_id,
                startPrice: 0,
                minBidPrice: 0,
                buyNowPrice: item.buy_now_price,
                depositAmount: 0,
                startsAt: new Date(),
                endsAt: new Date(item.auction_ends_at),
                status: 'running' as const,
                createdAt: new Date(),
                updatedAt: new Date(),
                currentBid: item.current_highest_bid
                  ? {
                      id: 0,
                      auctionId: 0,
                      userId: 0,
                      bidOrder: 0,
                      amount: item.current_highest_bid,
                      createdAt: new Date(),
                    }
                  : undefined,
              }
            : undefined

          return (
            <a key={item.product_id} href={`/products/${item.product_id}`} className="block">
              <ProductCard product={product} auction={auction} showTimeLeft={true} />
            </a>
          )
        })}
      </div>
    </div>
  )
}
