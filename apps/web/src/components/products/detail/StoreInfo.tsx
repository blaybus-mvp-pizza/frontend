"use client";

import { ChevronRight } from "lucide-react";

interface StoreInfoProps {
  store: {
    name: string;
    description?: string;
    image_url?: string;
  };
}

export function StoreInfo({ store }: StoreInfoProps) {
  return (
    <div className="bg-[#F6F6F6] p-4 space-y-3">
      <div className="flex items-start gap-4">
        <div className="flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-[#111111]">{store.name}</h3>
          {store.description && (
            <p className="text-sm text-[#505050] mt-1">{store.description}</p>
          )}
        </div>
        <img
          src={store.image_url || "/placeholder.png"}
          alt={store.name}
          className="w-10 h-10 rounded-sm object-cover"
        />
      </div>
      <div className="bg-white flex items-center justify-between px-4 py-2">
        <p className="text-sm text-[#111111]">
          이 상품과{" "}
          <span className="font-semibold">함께 판매하는 상품이 있어요!</span>
        </p>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
}