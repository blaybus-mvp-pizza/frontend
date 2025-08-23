"use client";

import { useProduct } from "@/hooks/use-products";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuctionFormModal, { FormMode } from "../auction/auction-form-modal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@workspace/ui/components/tooltip";
import { useAuction } from '@/hooks/use-auctions';
import { AUCTION_STATUS_MAP } from "@/apis/auction/type";

export default function ProductDetailSection({ id }: { id: string }) {
  const productId = Number(id);
  const { data: product, isLoading: isProductLoading, isError: isProductError } = useProduct(productId);
  const router = useRouter();

  const auctionId = product?.auction_id;

  const { data: auctionData, isLoading: isAuctionLoading } = useAuction(auctionId as number);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<FormMode>("create");
  const [selectedAuctionId, setSelectedAuctionId] = useState<
    number | undefined
  >(undefined);

  const handleOpenModal = (mode: FormMode, auctionId?: number) => {
    setModalMode(mode);
    setSelectedAuctionId(auctionId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAuctionId(undefined);
  };

  if (isProductLoading || (auctionId && isAuctionLoading)) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-gray-500'>상품 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (isProductError || !product) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-gray-500'>
          상품 정보를 찾을 수 없거나 오류가 발생했습니다.
        </p>
      </div>
    );
  }
  
  const auctionStatus = auctionData?.status;
  const startsAt = auctionData?.starts_at;
  const startsAtDate = startsAt ? new Date(startsAt) : null;
  const now = new Date();
  const isEditable = auctionStatus === "SCHEDULED" && startsAtDate && startsAtDate > now;
  const tooltipText = "경매 수정은 경매 시작일시 이전, 경매 예정 상태에서만 가능합니다.";

  const specsList = [
    { label: "재료", value: product.specs.material },
    { label: "사용 장소", value: product.specs.place_of_use },
    { label: "너비", value: `${product.specs.width_cm} cm` },
    { label: "높이", value: `${product.specs.height_cm} cm` },
    { label: "오차", value: `${product.specs.tolerance_cm} cm` },
    { label: "에디션 정보", value: product.specs.edition_info },
    { label: "상태 설명", value: product.specs.condition_note },
  ];

  const shippingInfo = [
    { label: "택배사", value: product.courier_name || "정보 없음" },
    {
      label: "기본 배송비",
      value: `${product.shipping_base_fee.toLocaleString()}원`,
    },
    {
      label: "무료 배송 기준액",
      value: `${product.shipping_free_threshold.toLocaleString()}원`,
    },
    {
      label: "배송 추가 정보",
      value: product.shipping_extra_note || "정보 없음",
    },
  ];

  return (
    <>
      <div className='container mx-auto p-4 space-y-8'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center pb-2'>
          <div>
            <h1 className='text-3xl font-bold'>{product.name}</h1>
            <div className='flex flex-wrap gap-x-4 text-sm text-gray-500 mt-2'>
              <p>
                상품 ID:{" "}
                <span className='font-mono text-gray-700'>{product.id}</span>
              </p>
              <p>
                경매 ID:{" "}
                <span className='font-mono text-gray-700'>
                  {product.auction_id || "없음"}
                </span>
              </p>
              <p>
                등록일:{" "}
                <span className='font-mono text-gray-700'>
                  {new Date(product.created_at).toLocaleDateString()}
                </span>
              </p>
              <p>
                수정일:{" "}
                <span className='font-mono text-gray-700'>
                  {new Date(product.updated_at).toLocaleDateString()}
                </span>
              </p>
            </div>
          </div>
          <div className='flex gap-2 mt-4 md:mt-0'>
            <TooltipProvider>
              {auctionId ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className={!isEditable ? 'cursor-not-allowed' : ''}>
                      <Button
                        variant='outline'
                        onClick={() => handleOpenModal("edit", auctionId)}
                        disabled={!isEditable}
                        className={!isEditable ? 'pointer-events-none' : ''}
                      >
                        경매 수정
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {!isEditable && (
                    <TooltipContent side='bottom'>
                      <p>{tooltipText}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              ) : (
                <Button
                  variant='outline'
                  onClick={() => handleOpenModal("create")}
                >
                  경매 등록
                </Button>
              )}
            </TooltipProvider>
            <Button
              onClick={() => {
                router.push(`/product/edit/${productId}`);
              }}
            >
              상품 수정
            </Button>
          </div>
        </div>

        <div className='grid lg:grid-cols-2 gap-8'>
          <div className='space-y-8'>
            <section className='space-y-6'>
              <h3 className='text-xl font-semibold text-gray-800 border-b pb-2'>
                기본 정보
              </h3>
              <dl className='grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6'>
                <div>
                  <dt className='text-sm font-medium text-gray-500'>상품명</dt>
                  <dd className='text-sm text-gray-800'>{product.name}</dd>
                </div>
                <div>
                  <dt className='text-sm font-medium text-gray-500'>카테고리</dt>
                  <dd className='text-sm text-gray-800'>{product.category}</dd>
                </div>
                <div>
                  <dt className='text-sm font-medium text-gray-500'>가격</dt>
                  <dd className='text-sm text-gray-800'>{product.price.toLocaleString()}원</dd>
                </div>
                <div>
                  <dt className='text-sm font-medium text-gray-500'>재고</dt>
                  <dd className='text-sm text-gray-800'>{product.stock}개</dd>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <dt className='text-sm font-medium text-gray-500'>상품 요약</dt>
                  <dd className='text-sm text-gray-800 leading-relaxed whitespace-pre-wrap'>{product.summary}</dd>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <dt className='text-sm font-medium text-gray-500'>상세 설명</dt>
                  <dd className='text-sm text-gray-800 leading-relaxed whitespace-pre-wrap'>{product.description}</dd>
                </div>
              </dl>
            </section>

            <section className='space-y-6'>
              <h3 className='text-xl font-semibold text-gray-800 border-b pb-2'>
                상품 사양
              </h3>
              <dl className='grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6'>
                {specsList.map((item) => (
                  <div key={item.label}>
                    <dt className='text-sm font-medium text-gray-500'>
                      {item.label}
                    </dt>
                    <dd className='text-sm text-gray-800'>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>

          <div className='space-y-8'>
          {auctionData && (
            <section className='space-y-6'>
              <h3 className='text-xl font-semibold text-gray-800 border-b pb-2'>
                경매 정보
              </h3>
              <dl className='grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6'>
                <div>
                  <dt className='text-sm font-medium text-gray-500'>경매 상태</dt>
                  <dd className='text-sm text-gray-800'>{AUCTION_STATUS_MAP[auctionData.status as keyof typeof AUCTION_STATUS_MAP] || auctionData.status}</dd>
                </div>
                <div>
                  <dt className='text-sm font-medium text-gray-500'>경매 시작가</dt>
                  <dd className='text-sm text-gray-800'>{auctionData.start_price.toLocaleString()}원</dd>
                </div>
                <div>
                  <dt className='text-sm font-medium text-gray-500'>현재 최고 입찰가</dt>
                  <dd className='text-sm text-gray-800'>
                    {auctionData.current_highest_bid ? `${auctionData.current_highest_bid.toLocaleString()}원` : "입찰 없음"}
                  </dd>
                </div>
                <div>
                  <dt className='text-sm font-medium text-gray-500'>경매 시작일시</dt>
                  <dd className='text-sm text-gray-800'>{new Date(auctionData.starts_at).toLocaleString()}</dd>
                </div>
                <div>
                  <dt className='text-sm font-medium text-gray-500'>경매 종료일시</dt>
                  <dd className='text-sm text-gray-800'>{new Date(auctionData.ends_at).toLocaleString()}</dd>
                </div>
              </dl>
            </section>
            )}

            <section className='space-y-6'>
              <h3 className='text-xl font-semibold text-gray-800 border-b pb-2'>
                상품 이미지
              </h3>
              <p className='text-sm text-gray-500'>
                총 {product.images.length}장의 이미지
              </p>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className='w-full h-auto object-cover rounded-md'
                  />
                ))}
              </div>
            </section>

            <section className='space-y-6'>
              <h3 className='text-xl font-semibold text-gray-800 border-b pb-2'>
                배송 정보
              </h3>
              <dl className='grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6'>
                {shippingInfo.map((item) => (
                  <div key={item.label}>
                    <dt className='text-sm font-medium text-gray-500'>
                      {item.label}
                    </dt>
                    <dd className='text-sm text-gray-800'>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>
      </div>
      <AuctionFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        auctionId={selectedAuctionId}
        productId={productId}
      />
    </>
  );
}