"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  useProductsWithPagination,
  useAuctionsForProducts,
} from "@/hooks/queries/useProducts";
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
import { useMemo } from "react";

function ProductContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL parameters with defaults
  const content =
    (searchParams.get("content") as ContentType) || DEFAULT_FILTERS.content;
  const filter = searchParams.get("filter") || DEFAULT_FILTERS.filter;
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") || DEFAULT_FILTERS.sort;
  const search = searchParams.get("search");
  const page = parseInt(
    searchParams.get("page") || String(DEFAULT_FILTERS.page),
    10
  );
  const status = searchParams.get("status") || DEFAULT_FILTERS.status;
  const bidders = searchParams.get("bidders") || DEFAULT_FILTERS.bidders;
  const price = searchParams.get("price") || DEFAULT_FILTERS.price;

  // Prepare filters for API call
  const filters = useMemo(
    () => ({
      content,
      category: filter !== "전체" ? filter : category || undefined,
      sort,
      search: search || undefined,
      page,
      pageSize: ITEMS_PER_PAGE,
      status,
      bidders,
      price,
    }),
    [content, filter, category, sort, search, page, status, bidders, price]
  );

  // Fetch paginated products using React Query
  const {
    data: paginatedResponse,
    isLoading: productsLoading,
    isPlaceholderData,
  } = useProductsWithPagination(filters);

  // Get product IDs for fetching auctions
  const productIds = useMemo(
    () => paginatedResponse?.data.map((p) => p.id) || [],
    [paginatedResponse]
  );

  // Fetch auctions for current page products
  const { data: auctions } = useAuctionsForProducts(productIds);

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

  // Loading state
  if (productsLoading && !isPlaceholderData) {
    return (
      <div>
        {/* Title skeleton */}
        <div className="space-y-4 pb-4 border-b border-[#E5E5E5]">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-5 w-64" />
          {/* Category tags skeleton */}
          <div className="flex gap-x-2">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
        </div>

        {/* Filters skeleton */}
        <div className="flex flex-col gap-y-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <Skeleton className="h-10 w-28 rounded-lg" />
              <Skeleton className="h-10 w-32 rounded-lg" />
              <Skeleton className="h-10 w-28 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Header with count and sort skeleton */}
        <div className="flex justify-between items-center py-4 border-b border-[#E5E5E5]">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>

        {/* Product grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-6">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="space-y-2 px-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex justify-between items-center pt-1">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const products = paginatedResponse?.data || [];
  const pagination = paginatedResponse?.pagination;
  const totalItems = pagination?.total || 0;
  const totalPages = pagination?.totalPages || 1;

  return (
    <div>
      <div className="space-y-4 pb-4 border-b border-[#E5E5E5]">
        <h1 className="font-semibold text-3xl">
          {CONTENT_TITLES[content].title}
        </h1>
        <h2 className="text-sm text-gray-500">
          {CONTENT_TITLES[content].subtitle}
        </h2>
        <div
          className="flex gap-x-2 text-nowrap overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <span
            onClick={() => handleFilterClick("전체")}
            className={`${filter === "전체" ? "bg-black text-white" : "bg-white text-[#111111]"} text-sm cursor-pointer px-3 py-1 border border-[#E5E5E5] rounded-full`}
          >
            전체
          </span>
          {PRODUCT_TAGS.map((v) => (
            <span
              key={v.name}
              onClick={() => handleFilterClick(v.name)}
              className={`${filter === v.name ? "bg-black text-white" : "bg-white text-[#111111]"} text-sm cursor-pointer px-3 py-1 border border-[#E5E5E5] rounded-full`}
            >
              {v.name}
            </span>
          ))}
        </div>
      </div>

      {/* 필터 드롭다운 섹션 */}
      <div className="flex flex-col gap-y-4 py-4">
        {/* 상단 필터 버튼과 정렬 */}
        <div className="flex justify-between items-center">
          <div className="flex gap-3 flex-wrap">
            {/* 상태 드롭다운 */}
            <Dropdown
              value={status}
              onChange={(value) => handleDropdownChange("status", value)}
              options={STATUS_OPTIONS}
              placeholder="상태 선택"
              className="min-w-[120px]"
            />

            {/* 입찰인원 드롭다운 */}
            <Dropdown
              value={bidders}
              onChange={(value) => handleDropdownChange("bidders", value)}
              options={BIDDER_OPTIONS}
              placeholder="입찰인원 선택"
              className="min-w-[140px]"
            />

            {/* 가격 드롭다운 */}
            <Dropdown
              value={price}
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
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-6">
            {products.map((product) => {
              // 각 상품에 대한 경매 정보 찾기
              const auction = auctions?.find((a) => a.productId === product.id);
              
              // If price is 0, use current_highest_bid or buy_now_price from the product
              const displayProduct = {
                ...product,
                price: product.price || 
                       (auction?.currentBid?.amount) || 
                       (auction?.startPrice) || 
                       product.price
              };

              return (
                <ProductCard
                  key={product.id}
                  product={displayProduct}
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
