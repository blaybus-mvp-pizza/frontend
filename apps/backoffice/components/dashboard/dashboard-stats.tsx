"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Package,
  Gavel,
  Truck,
  MessageSquare,
  DollarSign,
  ShoppingCart,
} from "lucide-react";
import { DashboardCard, DashboardCardSkeleton } from "./dashboard-card";

export const statsIconMap = {
  "현재 진행 중인 경매 수": Gavel,
  "총 상품 수": Package,
  "오늘 결제 건수": DollarSign,
  "배송 준비 건수": Truck,
  "미답변 고객 문의": MessageSquare,
  "판매 완료된 상품": ShoppingCart,
};

type StatTitle = keyof typeof statsIconMap;

type Stat = {
  title: StatTitle;
  value: string;
  description: string;
};

export default function DashboardStats() {
  const { data: stats, isLoading } = useQuery<Stat[]>({
    queryKey: ["stats"],
    queryFn: async () => {
      const response = await axios.get("/api/dashboard/stats");
      return response.data.stats;
    },
  });

  if (isLoading || !stats) {
    return (
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, index) => (
          <DashboardCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {stats.map((stat, index) => {
        const Icon = statsIconMap[stat.title];
        return (
          <DashboardCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={Icon}
          />
        );
      })}
    </div>
  );
}
