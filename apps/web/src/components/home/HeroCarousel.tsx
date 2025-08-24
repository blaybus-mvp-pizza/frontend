'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Slider from 'react-slick'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import './HeroCarousel.css'

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

// Custom arrow components
const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-[#181A1D]/20 p-2 backdrop-blur-sm transition-all hover:bg-white/30"
    aria-label="Previous slide"
  >
    <ChevronLeft className="h-5 w-5 text-white sm:h-6 sm:w-6" />
  </button>
)

const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-[#181A1D]/20 p-2 backdrop-blur-sm transition-all hover:bg-white/30"
    aria-label="Next slide"
  >
    <ChevronRight className="h-5 w-5 text-white sm:h-6 sm:w-6" />
  </button>
)

export default function HeroCarousel() {
  const router = useRouter()
  const sliderRef = useRef<Slider>(null)

  const handleBannerClick = (href: string) => {
    router.push(href)
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000, // Slower transition (1 second)
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false, // Autoplay disabled
    autoplaySpeed: 6000, // If enabled later, slower autoplay
    pauseOnHover: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    customPaging: () => (
      <div className="hero-dot">
        <span />
      </div>
    ),
    appendDots: (dots: React.ReactNode) => (
      <div className="hero-dots-container">
        <ul className="hero-dots">{dots}</ul>
      </div>
    ),
  }

  return (
    <div className="hero-carousel-wrapper relative w-full">
      <div className="relative h-[200px] w-full overflow-hidden rounded-md sm:h-[280px] md:h-[380px] md:rounded-lg">
        <Slider ref={sliderRef} {...settings}>
          {BANNER_PROPS.map((banner) => (
            <div key={banner.id} className="relative">
              <div className="relative h-[200px] w-full sm:h-[280px] md:h-[380px]">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                />
                
                {/* Text content */}
                <div className="absolute bottom-0 left-0 right-0 p-10 text-white sm:p-8 md:px-20 md:py-[52px]">
                  <div className="space-y-5">
                    <div className="flex flex-col gap-y-2 text-white">
                      <p className="text-sm font-semibold md:text-[28px]">
                        {banner.title}
                      </p>
                      <p className="line-clamp-2 text-xs md:text-base">
                        {banner.subtitle}
                      </p>
                    </div>
                    <button
                      onClick={() => handleBannerClick(banner.href)}
                      className="text-text-primary rounded-sm bg-white px-3 py-2 text-xs font-semibold md:p-3 md:text-sm"
                    >
                      {banner.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}