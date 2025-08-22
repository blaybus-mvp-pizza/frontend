"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  AuctionResponse,
  AuctionFormRequest,
  TAuctionStatus,
} from "@/api/auction/type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";

import {
  useAuction,
  useCreateAuction,
  useEditAuction,
} from "@/hooks/use-auctions";

export type FormMode = "create" | "edit" | "view";

interface AuctionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: FormMode;
  auctionId?: number;
  productId?: number;
}

const formatNumber = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === "") return "";
  const num =
    typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
  if (isNaN(num)) return "";
  return new Intl.NumberFormat("ko-KR").format(num);
};

const parseNumber = (
  value: string | number | null | undefined
): number | null => {
  if (typeof value === "number") return value;
  if (value === null || value === undefined || value === "") return null;
  const num = parseFloat(value.replace(/,/g, ""));
  return isNaN(num) ? null : num;
};

export default function AuctionFormModal({
  isOpen,
  onClose,
  mode,
  auctionId,
  productId,
}: AuctionFormModalProps) {
  const { register, handleSubmit, reset, getValues, setValue } =
    useForm<AuctionFormRequest>();

  const shouldFetch = mode !== "create" && typeof auctionId === "number";
  const {
    data: auctionData,
    isLoading: isDataLoading,
    isSuccess: isDataLoaded,
  } = useAuction(shouldFetch ? auctionId : 0);

  const createMutation = useCreateAuction();
  const editMutation = useEditAuction();

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && isDataLoaded && auctionData) {
      const formData: AuctionFormRequest = {
        ...auctionData,
        status: auctionData.status as TAuctionStatus,
        id: auctionId,
      };
      reset(formData);
    } else if (mode === "create") {
      reset({ product_id: productId });
    }
  }, [mode, isDataLoaded, auctionData, reset, auctionId, productId]);

  const onSubmit = (data: AuctionFormRequest) => {
    const processedData = {
      ...data,
      start_price: parseNumber(data.start_price),
      min_bid_price: parseNumber(data.min_bid_price),
      buy_now_price: parseNumber(data.buy_now_price),
      deposit_amount: parseNumber(data.deposit_amount),
    };

    if (mode === "create") {
      const { id, ...createData } = processedData;
      createMutation.mutate(createData as AuctionFormRequest, {
        onSuccess: () => onClose(),
      });
    } else if (mode === "edit" && auctionId) {
      editMutation.mutate(
        { ...processedData, id: auctionId } as AuctionFormRequest,
        {
          onSuccess: () => onClose(),
        }
      );
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "경매 등록";
      case "edit":
        return "경매 수정";
      case "view":
        return "경매 상세";
    }
  };

  const isViewMode = mode === "view";
  const isPending = createMutation.isPending || editMutation.isPending;

  if (isDataLoading && (mode === "edit" || mode === "view")) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='flex items-center justify-center p-12'>
          <DialogHeader>
            <DialogTitle>{getTitle()}</DialogTitle>
            <DialogDescription>데이터를 불러오는 중입니다.</DialogDescription>
          </DialogHeader>
          <span className='ml-2 text-gray-500'></span>
        </DialogContent>
      </Dialog>
    );
  }

  const renderFormField = (
    label: string,
    key: keyof AuctionFormRequest,
    type: "text" | "number" | "datetime-local" = "text",
    required = false
  ) => {
    const isProductId = key === "product_id";
    const isReadOnly = isViewMode || isProductId;
    const isPriceField =
      key === "start_price" ||
      key === "min_bid_price" ||
      key === "buy_now_price" ||
      key === "deposit_amount";

    const handleIncrement = (amount: number) => {
      const currentValue = parseNumber(getValues(key as any) || "0") || 0;
      setValue(key as any, formatNumber(currentValue + amount));
    };

    const fieldValue = auctionData?.[key as keyof AuctionResponse];
    const defaultValue =
      fieldValue !== undefined && fieldValue !== null ? String(fieldValue) : "";

    return (
      <div key={key} className='grid grid-cols-[1fr_3fr] items-center gap-4'>
        <Label htmlFor={String(key)} className='text-right font-medium'>
          {label}
        </Label>
        <div>
          <Input
            id={String(key)}
            {...register(key as any)}
            type={isPriceField ? "text" : type}
            defaultValue={
              isPriceField ? formatNumber(defaultValue) : defaultValue
            }
            onChange={(e) => {
              if (isPriceField) {
                const numericValue = e.target.value.replace(/,/g, "");
                setValue(key as any, formatNumber(numericValue));
              } else {
                setValue(key as any, e.target.value);
              }
            }}
            className={isReadOnly ? "bg-gray-100" : ""}
            disabled={isPending || isViewMode}
            readOnly={isReadOnly}
          />
          {isPriceField && !isViewMode && (
            <div className='flex flex-wrap gap-1 mt-2'>
              <Button
                type='button'
                variant='outline'
                className='h-7 px-2 text-xs'
                onClick={() => handleIncrement(1000)}
                disabled={isPending}
              >
                +1천원
              </Button>
              <Button
                type='button'
                variant='outline'
                className='h-7 px-2 text-xs'
                onClick={() => handleIncrement(10000)}
                disabled={isPending}
              >
                +1만원
              </Button>
              <Button
                type='button'
                variant='outline'
                className='h-7 px-2 text-xs'
                onClick={() => handleIncrement(100000)}
                disabled={isPending}
              >
                +10만원
              </Button>
              <Button
                type='button'
                variant='outline'
                className='h-7 px-2 text-xs'
                onClick={() => handleIncrement(1000000)}
                disabled={isPending}
              >
                +100만원
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            경매 정보를 확인하고{" "}
            {mode === "view" ? "닫을 수 있습니다." : "수정할 수 있습니다."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 py-4'>
          {renderFormField("상품 ID", "product_id", "number", true)}
          {renderFormField("시작 가격", "start_price", "text", true)}
          {renderFormField("최소 입찰가", "min_bid_price", "text", true)}
          {renderFormField("즉시 구매가", "buy_now_price", "text", false)}
          {renderFormField("보증금", "deposit_amount", "text", true)}
          {renderFormField("시작 시간", "starts_at", "datetime-local", true)}
          {renderFormField("종료 시간", "ends_at", "datetime-local", true)}
          <div className='flex justify-center pt-2'>
            {!isViewMode && (
              <Button type='submit' disabled={isPending}>
                {isPending
                  ? "처리 중..."
                  : mode === "create"
                    ? "등록하기"
                    : "수정하기"}
              </Button>
            )}
            {isViewMode && (
              <Button type='button' variant='outline' onClick={onClose}>
                닫기
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
