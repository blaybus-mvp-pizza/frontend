"use client";

import * as React from "react";
import {
  PieChart,
  Package,
  ClipboardCheck,
  Truck,
  MessageSquare,
  User,
  ReceiptText,
  Megaphone,
  LucideProps,
  Library,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@workspace/ui/components/sidebar";
import { usePathname } from "next/navigation";
import { NavUser } from "./nav-user";
import { useSession } from "next-auth/react";

export interface MenuItem {
  title: string;
  url: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}

export interface MenuGroup {
  title: string;
  url: string;
  items: MenuItem[];
}

export interface SidebarData {
  navMain: MenuGroup[];
}

const baseSidebarData: SidebarData = {
  navMain: [
    {
      title: "홈",
      url: "#",
      items: [{ title: "대시보드", url: "/dashboard", icon: PieChart }],
    },
    {
      title: "상품/경매 관리",
      url: "#",
      items: [
        { title: "상품 등록 및 수정", url: "/product", icon: Package },
        { title: "경매 설정", url: "/auction", icon: Megaphone },
        { title: "낙찰/유찰 관리", url: "#", icon: ClipboardCheck },
      ],
    },
    {
      title: "주문/배송 관리",
      url: "#",
      items: [
        { title: "결제 상태 확인", url: "#", icon: ReceiptText },
        { title: "배송 관리", url: "#", icon: Truck },
      ],
    },
    {
      title: "고객 관리",
      url: "#",
      items: [{ title: "문의 답변", url: "#", icon: MessageSquare }],
    },
    {
      title: "NafaL's Story",
      url: "#",
      items: [{ title: "나팔 스토리 관리", url: "#", icon: Library }],
    },
  ],
};

const superAdminMenu: MenuGroup = {
  title: "시스템 설정",
  url: "#",
  items: [{ title: "계정 권한 관리", url: "/admin", icon: User }],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const disabledItems = ["#"];

  const isSuperAdmin = session?.user?.role === "SUPERADMIN";
  const navItems = isSuperAdmin
    ? [...baseSidebarData.navMain, superAdminMenu]
    : baseSidebarData.navMain;

  if (status === "loading") {
    return null;
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader className='flex items-center/'>
        <SidebarGroup className='pl-2.5 pb-0'>
          <img
            src='/images/LOGO_HEADER.svg'
            alt='Nafal Backoffice'
            width={80}
            height={10}
          />
        </SidebarGroup>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <SidebarGroupLabel className='text-gray-500 text-xs'>
                    {item.title}
                  </SidebarGroupLabel>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {item.items.map((item) => {
                    const isDisabled = disabledItems.includes(item.url);
                    return (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === item.url}
                          className={isDisabled ? "text-muted-foreground" : ""}
                          aria-disabled={isDisabled}
                        >
                          {isDisabled ? (
                            <span className='cursor-not-allowed'>
                              {item.icon && <item.icon />}
                              <span>{item.title}</span>
                            </span>
                          ) : (
                            <a href={item.url}>
                              {item.icon && <item.icon />}
                              <span>{item.title}</span>
                            </a>
                          )}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
