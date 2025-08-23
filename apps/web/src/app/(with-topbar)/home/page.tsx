'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Button } from '@workspace/ui/components/button'
import { Typography } from '@workspace/ui/components/typography'
import { motion } from 'framer-motion'

import { LazySection } from '@/components/common/LazySection'
import HeroCarousel from '@/components/home/HeroCarousel'
import {
  LazyEndingSoonSection,
  LazyNewProductsSection,
  LazyRecommendedSection,
  LazyPopularAuctionsSection,
  LazyUpcomingProductsSection,
} from '@/components/home/LazyProductSection'
import { LazyStoreSections } from '@/components/home/LazyStoreSection'
import PartnershipInquiryButton from '@/components/inquiry/PartnershipInquiryButton'
import { PRODUCT_TAGS } from '@/constants/filter.constant'

export default function HomePage() {
  const router = useRouter()
  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`)
  }

  const handleViewAllClick = (content?: string) => {
    if (content) {
      router.push(`/products?content=${content}`)
    } else {
      router.push('/products')
    }
  }

  return (
    <div className="min-h-screen">
      {/* 히어로 배너 캐러셀 */}
      <motion.div
        className="mt-4 w-full md:mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <HeroCarousel />
      </motion.div>

      {/* 카테고리 태그 */}
      <motion.div
        className="mt-6 md:mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-4 md:grid-cols-5 md:gap-3 lg:grid-cols-7">
          {PRODUCT_TAGS.map((v, index) => (
            <motion.div
              className="flex cursor-pointer flex-col items-center gap-1 rounded-lg bg-[#f6f6f6] p-2 transition-colors hover:bg-[#ececec] sm:gap-2 sm:p-3 md:gap-3 md:p-4"
              key={v.name}
              onClick={() => router.push(`/products?filter=${encodeURIComponent(v.name)}`)}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Image
                src={v.imgSrc}
                alt={v.name}
                width={48}
                height={48}
                className="h-8 w-8 object-contain sm:h-10 sm:w-10 md:h-12 md:w-12"
                loading="lazy"
              />
              <Typography
                variant="caption"
                align="center"
                weight="medium"
                color="muted"
                className="text-[10px] sm:text-xs md:text-sm"
              >
                {v.name}
              </Typography>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Lazy-loaded product sections */}
      <div className="mt-8 space-y-12 pb-8 md:mt-12 md:space-y-16 md:pb-12 lg:mt-14 lg:space-y-20 lg:pb-16">
        <LazyEndingSoonSection
          onProductClick={handleProductClick}
          onViewAllClick={handleViewAllClick}
        />

        <LazyRecommendedSection
          onProductClick={handleProductClick}
          onViewAllClick={handleViewAllClick}
        />

        <LazyNewProductsSection
          onProductClick={handleProductClick}
          onViewAllClick={handleViewAllClick}
        />
      </div>

      {/* Lazy-loaded banner */}
      <LazySection rootMargin="100px">
        <motion.div
          onClick={() => {}}
          className="relative h-40 text-white max-md:-mx-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            alt="배너1"
            src="/images/BANNER1.webp"
            fill
            className="object-cover"
            sizes="100vw"
            priority={false}
            loading="lazy"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[24px] md:text-[32px]">SHOW ROOM OPEN EVENT</p>
            <p className="font-light">나팔 서비스 오픈기념 이벤트</p>
          </div>
        </motion.div>
      </LazySection>

      {/* Lazy-loaded store sections */}
      <LazyStoreSections storeIds={[2020, 2021]} onProductClick={handleProductClick} />

      {/* Additional product sections */}
      <div className="mt-8 space-y-12 pb-8 md:mt-12 md:space-y-16 md:pb-12 lg:mt-14 lg:space-y-20 lg:pb-16">
        <LazyPopularAuctionsSection
          onProductClick={handleProductClick}
          onViewAllClick={handleViewAllClick}
        />

        <LazyUpcomingProductsSection
          onProductClick={handleProductClick}
          onViewAllClick={handleViewAllClick}
        />
      </div>

      {/* Lazy-loaded bottom banner */}
      <LazySection rootMargin="100px">
        <motion.div
          className="relative mb-40 mt-20 h-60 text-white max-md:-mx-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative h-[200px] w-full md:h-[280px]">
            <Image
              alt="배너2"
              src="/images/BANNER2.webp"
              fill
              className="object-cover"
              priority={false}
              loading="lazy"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-5 py-14 text-center md:px-10">
              <div className="flex flex-col gap-3">
                <p className="text-lg font-normal md:text-[28px]">
                  기업의 자산을 사회적 가치로 전환합니다
                </p>
                <p className="text-xs font-light md:text-[16px]">
                  나팔은 버려지는 기업과 자산이 새로운 공간에서
                  <br className="sm:hidden" /> 가치를 이어갈 수 있도록 함께합니다.
                </p>
              </div>
              <PartnershipInquiryButton />
            </div>
          </div>
        </motion.div>
      </LazySection>
    </div>
  )
}
