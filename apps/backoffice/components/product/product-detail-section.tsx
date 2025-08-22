"use client";

import { useProduct } from "@/hooks/use-products";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuctionFormModal, { FormMode } from "../auction/auction-form-modal";

export default function ProductDetailSection({ id }: { id: string }) {
  const productId = Number(id);
  const { data: product, isLoading, isError } = useProduct(productId);
  const router = useRouter();

  const auctionId = product?.auction_id;

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

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-gray-500'>상품 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-gray-500'>
          상품 정보를 찾을 수 없거나 오류가 발생했습니다.
        </p>
      </div>
    );
  }

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
      label: "추가 배송 정보",
      value: product.shipping_extra_note || "정보 없음",
    },
  ];

  return (
    <>
      <div className='container mx-auto p-6 space-y-8'>
        <div className='flex justify-between items-center pb-6 border-b'>
          <div>
            <h1 className='text-3xl font-bold'>{product.name}</h1>
            <div className='flex gap-6'>
              <p className='text-sm text-gray-500 mt-1'>
                상품 ID:{" "}
                <span className='font-mono text-gray-700'>{product.id}</span>
              </p>
              <p className='text-sm text-gray-500 mt-1'>
                가격:{" "}
                <span className='font-mono text-gray-700'>
                  {" "}
                  {product.price.toLocaleString()}원
                </span>
              </p>
              <p className='text-sm text-gray-500 mt-1'>
                경매 ID:{" "}
                <span className='font-mono text-gray-700'>
                  {" "}
                  {product.auction_id || "없음"}
                </span>
              </p>
            </div>
          </div>
          <div className='flex gap-2'>
            {!auctionId && (
              <Button
                variant='outline'
                onClick={() => handleOpenModal("create")}
              >
                경매 등록
              </Button>
            )}
            <Button
              onClick={() => {
                router.push(`/product/edit/${productId}`);
              }}
            >
              상품 수정
            </Button>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-8 border-b'>
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-gray-800'>
              상품 요약 정보
            </h3>
            <dl className='grid grid-cols-2 gap-y-3 gap-x-6'>
              <div>
                <dt className='text-sm font-medium text-gray-500'>카테고리</dt>
                <dd className='text-sm font-semibold text-gray-800'>
                  {product.category}
                </dd>
              </div>
              <div></div>
              <div>
                <dt className='text-sm font-medium text-gray-500'>등록일</dt>
                <dd className='text-sm font-semibold text-gray-800'>
                  {new Date(product.created_at).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className='text-sm font-medium text-gray-500'>수정일</dt>
                <dd className='text-sm font-semibold text-gray-800'>
                  {new Date(product.updated_at).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-gray-800'>상품 사양</h3>
            <dl className='grid grid-cols-2 gap-y-3 gap-x-6'>
              {specsList.map((item) => (
                <div key={item.label}>
                  <dt className='text-sm font-medium text-gray-500'>
                    {item.label}
                  </dt>
                  <dd className='text-sm font-semibold text-gray-800'>
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-gray-800'>배송 정보</h3>
            <dl className='grid grid-cols-2 gap-y-3 gap-x-6'>
              {shippingInfo.map((item) => (
                <div key={item.label}>
                  <dt className='text-sm font-medium text-gray-500'>
                    {item.label}
                  </dt>
                  <dd className='text-sm font-semibold text-gray-800'>
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className='space-y-4 pb-8 border-b'>
          <h3 className='text-lg font-semibold'>상품 이미지</h3>
          <p className='text-sm text-gray-500'>
            총 {product.images.length}장의 이미지
          </p>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.name} thumbnail ${index + 1}`}
                className='w-full h-auto object-cover rounded-md'
              />
            ))}
          </div>
        </div>

        <div className='space-y-4'>
          <h3 className='text-lg font-semibold'>상품 상세 설명</h3>
          <p className='text-sm text-gray-700 leading-relaxed whitespace-pre-wrap'>
            {product.description}
          </p>
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
