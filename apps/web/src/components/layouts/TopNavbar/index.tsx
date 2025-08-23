'use client'

import { useState, useRef } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Typography } from '@workspace/ui/components/typography'
import { Bell, Menu, Search, X } from 'lucide-react'

import { useUnreadNotificationsCount } from '@/api/hooks/queries/useNotifications'
import { TOP_NAVBAR_MENU } from '@/constants'
import { useAuthStore } from '@/store/auth.store'

import { AuthBtns } from './AuthBtns'

export function TopNavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const desktopSearchRef = useRef<HTMLInputElement>(null)
  const mobileSearchRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { isAuthenticated, isHydrated } = useAuthStore()
  const { data: unreadCount } = useUnreadNotificationsCount(isAuthenticated && isHydrated)

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim()
    if (trimmedQuery && trimmedQuery.length >= 1) {
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`)
      setIsSearchOpen(false)
      setSearchQuery('')
      // Clear both search inputs
      if (desktopSearchRef.current) desktopSearchRef.current.value = ''
      if (mobileSearchRef.current) mobileSearchRef.current.value = ''
    }
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement
      handleSearch(target.value)
    }
  }

  const handleSearchButtonClick = (isMobile: boolean) => {
    const inputRef = isMobile ? mobileSearchRef : desktopSearchRef
    if (inputRef.current) {
      handleSearch(inputRef.current.value)
    }
  }

  return (
    <>
      {/* Announcement banner - normal flow, disappears on scroll */}
      <div className="bg-black py-2.5 text-center">
        <Typography variant="caption" align="center" className="text-xs text-white md:text-sm">
          신규 오픈, 지금 <span className="text-brand-mint">NafaL</span>에서{' '}
          <span className="hidden sm:inline">
            <span className="text-brand-mint">나만의 한정판 굿즈</span>를 입찰하세요
          </span>
          <span className="sm:hidden">
            <span className="text-brand-mint">한정판</span> 입찰!
          </span>
        </Typography>
      </div>

      {/* Sticky navigation header */}
      <header className="sticky top-0 z-50 border-b border-[#E5E5EC] bg-white pt-2">
        <nav className="bg-white">
          <div className="max-w-container mx-auto px-2 md:px-4">
            <div className="md:h-18 flex h-16 items-center justify-between">
              <div className="flex flex-1 items-center gap-x-2 md:gap-x-4">
                <button
                  className="p-2 md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <div className="flex items-center gap-8 pl-2">
                  <Link href="/home" className="flex-shrink-0">
                    <Image
                      src="/images/LOGO_HEADER.svg"
                      alt="Logo"
                      width={84}
                      height={28}
                      className="w-16 md:w-20 lg:w-[84px]"
                    />
                  </Link>

                  {/* 데스크톱 검색바 */}
                  <div className="relative hidden w-[320px] max-w-xs md:block lg:max-w-md xl:max-w-lg">
                    <input
                      ref={desktopSearchRef}
                      className="bg-secondary h-10 w-full rounded-sm px-4 pr-10 text-sm md:h-12"
                      placeholder="찾으시는 상품이 있으신가요?"
                      onKeyPress={handleSearchKeyPress}
                    />
                    <button
                      onClick={() => handleSearchButtonClick(false)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:text-gray-600"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 오른쪽: 아이콘 + 버튼 */}
              <div className="flex items-center gap-x-2 md:gap-x-4">
                {/* 모바일 검색 토글 */}
                <button className="p-2 md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                  <Search size={20} />
                </button>

                <div className="flex items-center gap-4">
                  {/* 알림 아이콘 */}
                  <button className="relative p-2" onClick={() => router.push('/notifications')}>
                    <Bell size={20} className="md:h-6 md:w-6" />
                    {isAuthenticated && unreadCount && unreadCount.count > 0 && (
                      <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {unreadCount.count > 9 ? '9+' : unreadCount.count}
                      </span>
                    )}
                  </button>

                  {/* 인증 버튼 */}
                  <div className="hidden space-x-2 sm:block">
                    <AuthBtns />
                  </div>
                </div>
              </div>
            </div>

            {/* 모바일 검색바 */}
            {isSearchOpen && (
              <div className="pb-3 md:hidden">
                <div className="relative">
                  <input
                    ref={mobileSearchRef}
                    className="h-10 w-full rounded-lg bg-[#f5f5f5] px-4 pr-10 text-sm"
                    placeholder="찾으시는 상품이 있으신가요?"
                    onKeyPress={handleSearchKeyPress}
                    autoFocus
                  />
                  <button
                    onClick={() => handleSearchButtonClick(true)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* 데스크톱 메뉴 */}
            <div className="mt-1 hidden h-12 w-full items-center md:flex">
              <ul className="flex gap-x-2 lg:gap-x-4">
                {TOP_NAVBAR_MENU.map((v) => (
                  <li key={v.href}>
                    <Link
                      href={v.href}
                      className="text-text-primary rounded-md px-3 py-2 font-medium transition-colors hover:bg-[#f5f5f5]"
                    >
                      {v.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 모바일 메뉴 */}
          {isMobileMenuOpen && (
            <div className="border-t border-[#E5E5EC] bg-white md:hidden">
              <div className="px-4 py-2">
                {/* 모바일 인증 버튼 */}
                <div className="border-b border-[#E5E5EC] py-3 sm:hidden">
                  <AuthBtns />
                </div>

                {/* 모바일 메뉴 항목 */}
                <ul className="py-2">
                  {TOP_NAVBAR_MENU.map((v) => (
                    <li key={v.href}>
                      <Link
                        href={v.href}
                        className="block rounded-md px-2 py-3 hover:bg-[#f5f5f5]"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Typography variant="body2" weight="medium">
                          {v.name}
                        </Typography>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  )
}
