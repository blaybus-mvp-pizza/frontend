'use client'

import Image from 'next/image'

import { ProductCard } from '@workspace/ui/components/product-card'
import { Typography } from '@workspace/ui/components/typography'

import { ProductListItem } from '@/api/types'
import { MapIcon } from '@/components/icons'
import { useStoreMeta } from '@/hooks/queries/useProductDetail'
import { StoreMeta } from '@/types/api'

interface StoreData {
  store: {
    store_id: number
    name: string
    image_url?: string | null
    description?: string
    sales_description?: string
  }
  products: Array<{
    product_id: number
    product_name: string
    popup_store_name: string
    labels?: string[]
    representative_image?: string
    buy_now_price?: number | null
    current_highest_bid?: number | null
    auction_ends_at?: string | null
  }>
}

interface StoreSectionProps {
  storeData: StoreMeta
  productData: ProductListItem[]
  onProductClick: (productId: number) => void
}

export default function StoreSection({
  storeData,
  productData,
  onProductClick,
}: StoreSectionProps) {
  return (
    <div className="mt-12 w-full space-y-4 md:mt-16 lg:mt-20">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-x-2">
        <span className="text-brand-mint inline-flex w-fit shrink-0 items-center gap-x-1.5 bg-black px-2 py-1 sm:gap-x-2">
          <MapIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          <Typography className="text-brand-mint text-sm font-semibold sm:text-base md:text-xl">
            {storeData.name}
          </Typography>
        </span>
        <Typography variant="h6" className="text-sm font-semibold sm:text-base md:text-xl">
          {storeData.sales_description || '팝업스토어에서 판매중인 아이템'}
        </Typography>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:gap-x-8">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg lg:h-[400px] lg:max-w-[442px] lg:shrink-0">
          {storeData.image_url && (
            <Image
              src={storeData.image_url}
              alt={`${storeData.name} 썸네일`}
              quality={100}
              fill
              className="object-cover"
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 442px"
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 sm:p-6">
            <Typography
              variant="h5"
              className="mb-1 text-lg font-bold text-white sm:mb-2 sm:text-xl lg:text-2xl"
            >
              {storeData.name}
            </Typography>
            <Typography variant="body1" className="line-clamp-2 text-sm text-white/90 sm:text-base">
              {storeData.description}
            </Typography>
          </div>
        </div>
        <div className="flex h-fit gap-3 sm:gap-4 lg:flex lg:gap-4">
          {productData.slice(0, 2).map((product) => {
            const productData = {
              id: product.product_id,
              popupStoreId: 0,
              category: '아트/컬렉터블',
              name: product.product_name,
              summary: product.popup_store_name,
              labels: product.labels,
              description: '',
              price: product.buy_now_price || product.current_highest_bid || 0,
              stock: 1,
              shippingBaseFee: 3000,
              shippingFreeThreshold: 50000,
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date(),
              images: product.representative_image
                ? [
                    {
                      id: product.product_id,
                      productId: product.product_id,
                      imageUrl: product.representative_image,
                      sortOrder: 0,
                    },
                  ]
                : [],
              tags: [],
              popupStore: {
                id: storeData.store_id,
                name: product.popup_store_name,
                createdAt: new Date(),
              },
            }

            const auctionData = product.auction_ends_at
              ? {
                  id: product.product_id,
                  productId: product.product_id,
                  startPrice: product.current_highest_bid || 0,
                  minBidPrice: 1000,
                  buyNowPrice: product.buy_now_price || 0,
                  depositAmount: 0,
                  startsAt: new Date(),
                  endsAt: new Date(product.auction_ends_at),
                  status:
                    new Date(product.auction_ends_at) > new Date()
                      ? ('running' as const)
                      : ('ended' as const),
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  currentBid: product.current_highest_bid
                    ? {
                        id: 1,
                        auctionId: product.product_id,
                        userId: 1,
                        bidOrder: 1,
                        amount: product.current_highest_bid,
                        createdAt: new Date(),
                      }
                    : undefined,
                  bidCount: 0,
                }
              : undefined

            return (
              <div key={product.product_id} className=",max-md:grid-cols-2 grid w-full">
                <ProductCard
                  product={productData}
                  auction={auctionData}
                  showTimeLeft={!!auctionData}
                  onClick={() => onProductClick(product.product_id)}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
