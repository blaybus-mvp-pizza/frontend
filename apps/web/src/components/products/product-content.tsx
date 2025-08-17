"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useProducts, useAuctions } from "@/hooks/queries/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { Dropdown } from "@/components/ui/dropdown";
import { SearchableDropdown } from "@/components/ui/searchable-dropdown";
import { Pagination } from "@/components/ui/pagination";
import { ProductCard } from "@workspace/ui/components/product-card";
import { SlidersHorizontal } from "lucide-react";
import { PRODUCT_TAGS } from "@/constants/filter.constant";
import {
  ContentType,
  CONTENT_TITLES,
  SORT_OPTIONS,
  STATUS_OPTIONS,
  BIDDER_OPTIONS,
  PRICE_OPTIONS,
  ITEMS_PER_PAGE,
  DEFAULT_FILTERS,
} from "@/constants/product.constant";
function ProductContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL parameters with defaults
  const content = (searchParams.get("content") as ContentType) || DEFAULT_FILTERS.content;
  const filter = searchParams.get("filter") || DEFAULT_FILTERS.filter;
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") || DEFAULT_FILTERS.sort;
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || String(DEFAULT_FILTERS.page), 10);

  // Fetch products and auctions using React Query
  const { data: products, isLoading: productsLoading } = useProducts({
    category: category || undefined,
  });

  const { data: auctions, isLoading: auctionsLoading } = useAuctions();

  const handleFilterClick = (tag: any) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("filter", tag);
    params.set("page", "1"); // Reset to first page when filter changes
    router.push(`?${params.toString()}`);
  };

  const handleDropdownChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    if (key !== "page") {
      params.set("page", "1"); // Reset to first page when filters change
    }
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter and sort products
  const getFilteredProducts = () => {
    if (!products) return [];

    let filtered = [...products];

    // Apply category filter
    if (filter !== "전체") {
      filtered = filtered.filter((p) => p.category === filter);
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.summary?.toLowerCase().includes(searchLower)
      );
    }

    // Apply content type filter

    // Apply sorting
    switch (sort) {
      case "recommended":
        // Sort by recommendation logic (mock: by stock)
        filtered.sort((a, b) => (b.stock || 0) - (a.stock || 0));
        break;
      case "latest":
        // Sort by creation date
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "popular":
        // Sort by popularity (mock: by price as popularity indicator)
        filtered.sort((a, b) => b.price - a.price);
        break;
    }

    return filtered;
  };

  // Loading state
  if (productsLoading || auctionsLoading) {
    return (
      <div className="min-h-screen">
        <Skeleton className="h-20 w-full mb-4" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(16)].map((_, i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Get filtered products
  const filteredProducts = getFilteredProducts();
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Paginate products
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div>
      <div className="space-y-4 pb-4 border-b border-[#E5E5E5]">
        <h1 className="font-semibold text-3xl">
          {CONTENT_TITLES[content].title}
        </h1>
        <h2 className="text-sm text-gray-500">
          {CONTENT_TITLES[content].subtitle}
        </h2>
        <div className="flex gap-x-2">
          <span
            onClick={() => handleFilterClick("전체")}
            className={`${filter === "전체" ? "bg-black text-white" : "bg-white text-[#111111]"} cursor-pointer px-4 py-2 border border-[#E5E5E5] rounded-full`}
          >
            전체
          </span>
          {PRODUCT_TAGS.map((v) => (
            <span
              key={v.name}
              onClick={() => handleFilterClick(v.name)}
              className={`${filter === v.name ? "bg-black text-white" : "bg-white text-[#111111]"} cursor-pointer px-4 py-2 border border-[#E5E5E5] rounded-full`}
            >
              {v.name}
            </span>
          ))}
        </div>
      </div>

      {/* 필터 드롭다운 섹션 */}
      {/* 필터 섹션 */}
      <div className="flex flex-col gap-y-4 py-4">
        {/* 상단 필터 버튼과 정렬 */}
        <div className="flex justify-between items-center">
          <div className="flex gap-x-3">
            {/* 상태 드롭다운 */}
            <Dropdown
              value={searchParams.get("status") || "all"}
              onChange={(value) => handleDropdownChange("status", value)}
              options={STATUS_OPTIONS}
              placeholder="상태 선택"
              className="min-w-[120px]"
            />

            {/* 입찰인원 드롭다운 */}
            <Dropdown
              value={searchParams.get("bidders") || "all"}
              onChange={(value) => handleDropdownChange("bidders", value)}
              options={BIDDER_OPTIONS}
              placeholder="입찰인원 선택"
              className="min-w-[140px]"
            />

            {/* 가격 드롭다운 */}
            <Dropdown
              value={searchParams.get("price") || "all"}
              onChange={(value) => handleDropdownChange("price", value)}
              options={PRICE_OPTIONS}
              placeholder="가격 선택"
              className="min-w-[140px]"
            />
          </div>
        </div>
      </div>

      {/* Product List Header - 총 개수와 정렬 */}
      <div className="flex justify-between items-center py-4 border-b border-[#E5E5E5]">
        <div className="text-sm text-gray-600">
          총 <span className="font-semibold text-gray-900">{totalItems}개</span>
          의 상품
        </div>

        {/* 정렬 드롭다운 - 추천순/등록순/인기순 */}
        <Dropdown
          value={sort}
          onChange={(value) => handleDropdownChange("sort", value)}
          options={SORT_OPTIONS}
          placeholder="정렬"
          className="min-w-[120px]"
        />
      </div>

      {/* Product Grid - 4x4 레이아웃 */}
      {paginatedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-6">
            {paginatedProducts.map((product) => {
              // 각 상품에 대한 경매 정보 찾기
              const auction = auctions?.find((a) => a.productId === product.id);

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  auction={auction}
                  showTimeLeft={true}
                  onClick={() => {
                    // 상품 상세 페이지로 이동
                    router.push(`/products/${product.id}`);
                  }}
                />
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center py-8 border-t border-[#E5E5E5]">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-gray-400 mb-4">
            <SlidersHorizontal className="w-12 h-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            상품이 없습니다
          </h3>
          <p className="text-sm text-gray-500">다른 필터를 선택해보세요</p>
        </div>
      )}
    </div>
  );
}

export default ProductContent;
