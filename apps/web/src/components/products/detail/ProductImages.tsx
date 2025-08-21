"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Typography } from "@workspace/ui/components/typography";
import { cn } from "@/utils/cn";

interface ProductImagesProps {
  images: string[];
  productName: string;
}

export function ProductImages({ images, productName }: ProductImagesProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center text-gray-400">
        <Typography variant="body2">이미지 없음</Typography>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={images[selectedImageIndex] || "/placeholder.png"}
          alt={productName}
          fill
          className="object-cover"
          priority
        />

        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))
              }
              disabled={selectedImageIndex === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur rounded-full p-2 shadow-lg disabled:opacity-50 hover:bg-white transition-colors"
              aria-label="이전 이미지"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() =>
                setSelectedImageIndex(
                  Math.min(images.length - 1, selectedImageIndex + 1)
                )
              }
              disabled={selectedImageIndex === images.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur rounded-full p-2 shadow-lg disabled:opacity-50 hover:bg-white transition-colors"
              aria-label="다음 이미지"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedImageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={cn(
                "relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all",
                selectedImageIndex === index
                  ? "border-black"
                  : "border-gray-200 hover:border-gray-400"
              )}
            >
              <Image
                src={image}
                alt={`${productName} ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}