'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Button } from '@workspace/ui/components/button'
import { Typography } from '@workspace/ui/components/typography'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface BannerProps {
  id: number
  image: string
  title: string
  subtitle: string
  href: string
  buttonText: string
}

const BANNER_PROPS: BannerProps[] = [
  {
    id: 1,
    image: '/images/01.png',
    title: '버려질 뻔한 굿즈, 동네 카페에 특별한 인테리어로',
    subtitle: '철거 예정이던 브랜드 테이블. 나팔을 만나 동네 카페의 특별한 포인트가 되기까지',
    href: '/story',
    buttonText: '스토리 보러가기',
  },
  {
    id: 2,
    image: '/images/02.png',
    title: '전시 의자가, 디자이너 작업실로 가기까지',
    subtitle:
      '행사를 위해 제작된 소품 의자, 한 디자이너의 작업실에서 새로운 가치를 이어가고 있어요.',
    href: '/story',
    buttonText: '스토리 보러가기',
  },
  {
    id: 3,
    image: '/images/03.png',
    title: '포토존을 지키던 인형, 사진관에서 추억을 담다',
    subtitle: '버려질 뻔한 대형 인형. 이제는 사진 속 추억을 기록하는 소품이 되었어요.',
    href: '/story',
    buttonText: '스토리 보러가기',
  },
  {
    id: 4,
    image: '/images/04.png',
    title: '팝업스토어 굿즈, 손님들의 대화 한가운데로',
    subtitle: '카누 팝업스토어 가구가 나팔 경매를 통해 새로운 카페 인테리어로 다시 태어났어요.',
    href: '/story',
    buttonText: '스토리 보러가기',
  },
]

export default function HeroCarousel() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const handlePrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? BANNER_PROPS.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % BANNER_PROPS.length)
  }

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
  }

  const handleBannerClick = () => {
    router.push(BANNER_PROPS[currentIndex]!.href)
  }

  return (
    <div className="relative w-full">
      <div
        className="relative h-[200px] w-full overflow-hidden rounded-md sm:h-[280px] md:h-[380px] md:rounded-lg"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <AnimatePresence mode="wait">
          <div key={currentIndex} className="relative h-full w-full">
            <Image
              src={BANNER_PROPS[currentIndex]!.image}
              alt={BANNER_PROPS[currentIndex]!.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />

            {/* Text content */}
            <div className="absolute bottom-0 left-0 right-0 p-10 text-white sm:p-8 md:px-20 md:py-[52px]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-5"
              >
                <div className="flex flex-col gap-y-2 text-white">
                  <p className="text-lg font-semibold md:text-[28px]">
                    {BANNER_PROPS[currentIndex]!.title}
                  </p>
                  <p className="line-clamp-2 text-xs md:text-base">
                    {BANNER_PROPS[currentIndex]!.subtitle}
                  </p>
                </div>
                <button
                  onClick={handleBannerClick}
                  className="text-text-primary rounded-sm bg-white px-3 py-2 text-xs font-semibold md:p-3 md:text-sm"
                >
                  {BANNER_PROPS[currentIndex]!.buttonText}
                </button>
              </motion.div>
            </div>
          </div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <button
          onClick={handlePrevious}
          className="absolute top-1/2 -translate-y-1/2 bg-[#181A1D]/20 p-2 backdrop-blur-sm transition-all hover:bg-white/30"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5 text-white sm:h-6 sm:w-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 bg-[#181A1D]/20 p-2 backdrop-blur-sm transition-all hover:bg-white/30"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5 text-white sm:h-6 sm:w-6" />
        </button>

        {/* Dots indicator */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
          {BANNER_PROPS.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentIndex ? 'w-8 bg-white' : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
