"use client";
import { TOP_NAVBAR_MENU } from "@/constants";
import { Bell, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AuthBtns } from "./AuthBtns";
import { Typography } from "@workspace/ui/components/typography";
export function TopNavBar() {
  return (
    <header className="fixed z-50 bg-white top-0 left-0 right-0 border-b border-[#E5E5EC]">
      <div className="bg-black sticky text-center">
        <Typography variant="caption" align="center" className="text-white p-1">
          신규 오픈, 지금 <span className="text-[#B5F5EB]">NafaL</span>에서{" "}
          <span className="text-[#B5F5EB]">나만의 한정판 굿즈</span>를
          입찰하세요
        </Typography>
      </div>
      <nav className="max-w-container mx-auto px-2 w-full">
        <div className="flex justify-between items-center h-18 w-full">
          <div className="flex items-center gap-x-4">
            <Link href={"/home"}>
              <Image
                src="/images/LOGO_HEADER.svg"
                alt="Logo"
                width={84}
                height={28}
                className="inline-block mr-2"
              />
            </Link>
            <div className="relative w-80">
              <input
                className="bg-[#f5f5f5] p-2 pr-10 w-full text-sm h-12"
                placeholder="찾으시는 상품이 있으신가요?"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          <div className="space-x-2 flex items-center">
            <Bell size="16" className="w-6 h-6 inline-block mr-4" />
            <AuthBtns />
          </div>
        </div>
        <div className="w-full flex h-12 items-center">
          <ul className="flex gap-x-2 font-semibold">
            {TOP_NAVBAR_MENU.map((v) => (
              <li key={v.href}>
                <Link href={v.href} className="p-2 w-full hover:bg-[#f5f5f5]">
                  {v.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
