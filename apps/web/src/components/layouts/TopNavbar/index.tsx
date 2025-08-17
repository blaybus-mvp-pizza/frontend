"use client";
import { TOP_NAVBAR_MENU } from "@/constants";
import { Bell, Search, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AuthBtns } from "./AuthBtns";
import { Typography } from "@workspace/ui/components/typography";
import { useState } from "react";

export function TopNavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="fixed z-50 bg-white top-0 left-0 right-0 border-b border-[#E5E5EC]">
      <div className="bg-black text-center">
        <Typography
          variant="caption"
          align="center"
          className="text-white p-1 px-2 text-xs md:text-sm"
        >
          신규 오픈, 지금 <span className="text-[#B5F5EB]">NafaL</span>에서{" "}
          <span className="hidden sm:inline">
            <span className="text-[#B5F5EB]">나만의 한정판 굿즈</span>를
            입찰하세요
          </span>
          <span className="sm:hidden">
            <span className="text-[#B5F5EB]">한정판</span> 입찰!
          </span>
        </Typography>
      </div>

      <nav className="bg-white">
        <div className="max-w-container mx-auto px-2 md:px-4">
          <div className="flex justify-between items-center h-16 md:h-18">
            <div className="flex items-center gap-x-2 md:gap-x-4 flex-1">
              <button
                className="md:hidden p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

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
              <div className="hidden md:block relative w-full max-w-xs lg:max-w-md xl:max-w-lg">
                <input
                  className="bg-[#f5f5f5] rounded-lg px-4 pr-10 w-full text-sm h-10 md:h-12"
                  placeholder="찾으시는 상품이 있으신가요?"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {/* 오른쪽: 아이콘 + 버튼 */}
            <div className="flex items-center gap-x-2 md:gap-x-4">
              {/* 모바일 검색 토글 */}
              <button
                className="md:hidden p-2"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search size={20} />
              </button>

              {/* 알림 아이콘 */}
              <button className="p-2">
                <Bell size={20} className="md:w-6 md:h-6" />
              </button>

              {/* 인증 버튼 */}
              <div className="hidden sm:block">
                <AuthBtns />
              </div>
            </div>
          </div>

          {/* 모바일 검색바 */}
          {isSearchOpen && (
            <div className="md:hidden pb-3">
              <div className="relative">
                <input
                  className="bg-[#f5f5f5] rounded-lg px-4 pr-10 w-full text-sm h-10"
                  placeholder="찾으시는 상품이 있으신가요?"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
          )}

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex w-full h-12 items-center">
            <ul className="flex gap-x-2 lg:gap-x-4">
              {TOP_NAVBAR_MENU.map((v) => (
                <li key={v.href}>
                  <Link
                    href={v.href}
                    className="px-3 py-2 hover:bg-[#f5f5f5] rounded-md transition-colors"
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

        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#E5E5EC] bg-white">
            <div className="px-4 py-2">
              {/* 모바일 인증 버튼 */}
              <div className="sm:hidden py-3 border-b border-[#E5E5EC]">
                <AuthBtns />
              </div>

              {/* 모바일 메뉴 항목 */}
              <ul className="py-2">
                {TOP_NAVBAR_MENU.map((v) => (
                  <li key={v.href}>
                    <Link
                      href={v.href}
                      className="block px-2 py-3 hover:bg-[#f5f5f5] rounded-md"
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
  );
}
