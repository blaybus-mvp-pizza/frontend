'use client'

import { useParams } from 'next/navigation'

import { Button } from '@workspace/ui/components/button'
import { Typography } from '@workspace/ui/components/typography'

// Import modular components
import { ProductImages } from '@/components/products/detail/ProductImages'
import { ProductInfo } from '@/components/products/detail/ProductInfo'
import { ProductSpecs } from '@/components/products/detail/ProductSpecs'
import { ProductTabs } from '@/components/products/detail/ProductTabs'
import { PurchaseOptions } from '@/components/products/detail/PurchaseOptions'
import { SimilarProducts } from '@/components/products/detail/SimilarProducts'
import { StoreInfo } from '@/components/products/detail/StoreInfo'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'
import { useProductDetail } from '@/hooks/queries/useProductDetail'

export default function ProductDetailPage() {
  const params = useParams()
  const productId = Number(params.id)

  const { product, auction, similar, isLoading } = useProductDetail(productId)

  if (isLoading) {
    return <ProductDetailSkeleton />
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Typography variant="h3" className="mb-2">
            상품을 찾을 수 없습니다
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            요청하신 상품이 존재하지 않거나 삭제되었습니다.
          </Typography>
          <Button variant="outline" className="mt-4" onClick={() => window.history.back()}>
            돌아가기
          </Button>
        </div>
      </div>
    )
  }

  const breadcrumbItems = [
    { label: '홈', href: '/' },
    {
      label: product.category || '상품',
      href: `/products?content=popular&filter=${product.category}&page=1`,
    },
    { label: product.name },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} className="mb-6" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left Column - Images and Details */}
        <div className="space-y-6">
          <div className="space-y-4">
            <ProductImages images={product.images || []} productName={product.name} />
            <ProductSpecs />
          </div>
          <ProductTabs />
        </div>

        {/* Right Column - Product Info and Purchase */}
        <div className="space-y-5">
          <ProductInfo
            tags={product.tags || []}
            title={product.title || product.name}
            description={product.description}
          />

          <StoreInfo store={product.store} />

          <PurchaseOptions
            buyNowPrice={auction?.buy_now_price}
            onBuyNow={() => console.log('Buy now clicked')}
          />

          <div className="h-[600px] w-full bg-black"></div>
        </div>
      </div>

      <SimilarProducts items={similar?.items || []} />
    </div>
  )
}

function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Skeleton className="mb-6 h-5 w-64" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-4">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-20 rounded-lg" />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Skeleton className="mb-2 h-6 w-32" />
            <Skeleton className="mb-2 h-10 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>

          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-24" />
          <Skeleton className="h-14 rounded-lg" />
        </div>
      </div>

      <div className="mt-12">
        <Skeleton className="mb-4 h-12 w-full" />
        <Skeleton className="h-64" />
      </div>
    </div>
  )
}
