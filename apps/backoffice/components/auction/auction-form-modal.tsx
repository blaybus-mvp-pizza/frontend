"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  TAuctionStatus,
} from "@/apis/auction/type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";
import {
  useAuction,
  useCreateAuction,
  useEditAuction,
} from "@/hooks/use-auctions";
import { cn } from "@workspace/ui/lib/utils";

const AuctionFormSchema = z.object({
  id: z.number().optional(),
  product_id: z.preprocess(
    (val) => Number(val),
    z.number({
      required_error: "상품 ID는 필수입니다.",
      invalid_type_error: "상품 ID는 숫자여야 합니다.",
    }).int().positive("상품 ID는 양수여야 합니다.")
  ),
  start_price: z.preprocess(
    (val) => {
      const cleaned = String(val).replace(/,/g, "");
      return parseFloat(cleaned);
    },
    z.number({
      required_error: "시작 가격은 필수입니다.",
      invalid_type_error: "시작 가격은 숫자여야 합니다.",
    }).min(0, "시작 가격은 0 이상이어야 합니다.")
  ),
  min_bid_price: z.preprocess(
    (val) => {
      const cleaned = String(val).replace(/,/g, "");
      return parseFloat(cleaned);
    },
    z.number({
      required_error: "최소 입찰가는 필수입니다.",
      invalid_type_error: "최소 입찰가는 숫자여야 합니다.",
    }).min(0, "최소 입찰가는 0 이상이어야 합니다.")
  ),
  buy_now_price: z.preprocess(
    (val) => {
      if (val === "" || val === undefined || val === null) {
        return undefined;
      }
      const cleaned = String(val).replace(/,/g, "");
      return parseFloat(cleaned);
    },
    z.number().optional()
  ),
  deposit_amount: z.preprocess(
    (val) => {
      const cleaned = String(val).replace(/,/g, "");
      return parseFloat(cleaned);
    },
    z.number({
      required_error: "보증금은 필수입니다.",
      invalid_type_error: "보증금은 숫자여야 합니다.",
    }).min(0, "보증금은 0 이상이어야 합니다.")
  ),
  starts_at: z.string().min(1, "시작 시간을 입력해야 합니다."),
  ends_at: z.string().min(1, "종료 시간을 입력해야 합니다."),
  status: z.string().optional(),
}).superRefine((data, ctx) => {
  if (new Date(data.starts_at) >= new Date(data.ends_at)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "경매 시작일시는 종료일시보다 빨라야 합니다.",
      path: ["starts_at"],
    });
  }
  if (data.start_price < data.min_bid_price) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "시작가는 최소 입찰가보다 크거나 같아야 합니다.",
      path: ["start_price"],
    });
  }
  if (data.buy_now_price !== undefined && data.start_price > data.buy_now_price) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "시작가는 즉시 구매가보다 작거나 같아야 합니다.",
      path: ["buy_now_price"],
    });
  }
});

interface AuctionFormRequest {
  id?: number;
  product_id: number;
  start_price: number;
  min_bid_price: number;
  buy_now_price: number;
  deposit_amount: number;
  starts_at: string;
  ends_at: string;
  status?: TAuctionStatus;
}

type CreateAuctionFormRequest = Omit<AuctionFormRequest, 'id' | 'status'>;
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
  const num = typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
  if (isNaN(num)) return "";
  return new Intl.NumberFormat("ko-KR").format(num);
};

const parseNumber = (value: string | number | null | undefined): number | undefined => {
  if (typeof value === "number") return value;
  if (value === null || value === undefined || value === "") return undefined;
  const num = parseFloat(value.replace(/,/g, ""));
  return isNaN(num) ? undefined : num;
};

const initialFormValues = {
  id: undefined,
  product_id: 0,
  start_price: 0,
  min_bid_price: 0,
  buy_now_price: undefined,
  deposit_amount: 0,
  starts_at: "",
  ends_at: "",
  status: "SCHEDULED",
};

export default function AuctionFormModal({
  isOpen,
  onClose,
  mode,
  auctionId,
  productId,
}: AuctionFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(AuctionFormSchema),
    defaultValues: initialFormValues,
  });

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
        id: auctionId,
        product_id: auctionData.product_id,
        start_price: auctionData.start_price,
        min_bid_price: auctionData.min_bid_price,
        buy_now_price: auctionData.buy_now_price ?? undefined,
        deposit_amount: auctionData.deposit_amount,
        starts_at: auctionData.starts_at,
        ends_at: auctionData.ends_at,
        status: auctionData.status as TAuctionStatus,
      };
      reset(formData);
    } else if (mode === "create") {
      reset({ ...initialFormValues, product_id: productId ?? 0 });
    }
  }, [mode, isDataLoaded, auctionData, reset, auctionId, productId]);

  const onSubmit = (data: any) => {
    const processedData: AuctionFormRequest = {
      id: data.id,
      product_id: data.product_id,
      start_price: data.start_price,
      min_bid_price: data.min_bid_price,
      buy_now_price: data.buy_now_price,
      deposit_amount: data.deposit_amount,
      starts_at: data.starts_at,
      ends_at: data.ends_at,
      status: data.status,
    };
    if (mode === "create") {
      const { id, status, ...createData } = processedData;
      createMutation.mutate(createData as CreateAuctionFormRequest, {
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
  const isPending = createMutation.isPending || editMutation.isPending || isSubmitting;

  if (isDataLoading && (mode === "edit" || mode === "view")) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="flex items-center justify-center p-12">
          <DialogHeader>
            <DialogTitle>{getTitle()}</DialogTitle>
            <div className="flex flex-col items-center">
              <span className="text-gray-500">데이터를 불러오는 중입니다.</span>
            </div>
          </DialogHeader>
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
      const currentValue = parseNumber(String(getValues(key as any) || "0")) || 0;
      setValue(key as any, currentValue + amount, { shouldValidate: true });
    };

    const value = getValues(key as any);
    const displayValue = isPriceField ? formatNumber(value) : value;

    return (
      <div key={key} className="grid grid-cols-[1fr_3fr] items-center gap-4">
        <Label htmlFor={String(key)} className="text-right font-medium">
          {label}
        </Label>
        <div>
          <Input
            id={String(key)}
            {...register(key as any)}
            type={isPriceField ? "text" : type}
            value={displayValue || ""}
            onChange={(e) => {
              const parsedValue = isPriceField ? parseNumber(e.target.value) : e.target.value;
              setValue(key as any, parsedValue, { shouldValidate: true });
            }}
            className={isReadOnly ? "bg-gray-100" : ""}
            disabled={isPending}
            readOnly={isReadOnly}
          />
          {errors[key] && (
            <p className="text-red-500 text-xs mt-1">
              {errors[key]?.message as string}
            </p>
          )}
          {isPriceField && !isViewMode && (
            <div className="flex flex-wrap gap-1 mt-2">
              <Button
                type="button"
                variant="outline"
                className="h-7 px-2 text-xs"
                onClick={() => handleIncrement(1000)}
                disabled={isPending}
              >
                +1천원
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-7 px-2 text-xs"
                onClick={() => handleIncrement(10000)}
                disabled={isPending}
              >
                +1만원
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-7 px-2 text-xs"
                onClick={() => handleIncrement(100000)}
                disabled={isPending}
              >
                +10만원
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-7 px-2 text-xs"
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <div
            className={cn(
              "text-[10px] text-gray-600 border border-gray-300 rounded p-2",
              "bg-gray-50 dark:bg-gray-900",
              "w-full text-left"
            )}
          >
            <ul className="space-y-1">
              <li>- 시작가 ≥ 최소입찰가</li>
              <li>- 시작가 ≤ 즉시구매가</li>
              <li>- 경매 시작일시는 종료일시보다 항상 빨라야 합니다.</li>
              <li>- 한 상품에는 하나의 경매만 등록할 수 있습니다.</li>
              <li>- 경매 수정은 경매 시작일시 이전, 경매 예정 상태에서만 가능합니다.</li>
            </ul>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-2">
          {renderFormField("상품 ID", "product_id", "text", true)}
          {renderFormField("시작 가격", "start_price", "text", true)}
          {renderFormField("최소 입찰가", "min_bid_price", "text", true)}
          {renderFormField("즉시 구매가", "buy_now_price", "text", false)}
          {renderFormField("보증금", "deposit_amount", "text", true)}
          {renderFormField("시작 시간", "starts_at", "datetime-local", true)}
          {renderFormField("종료 시간", "ends_at", "datetime-local", true)}
          <div className="flex justify-center pt-2">
            {!isViewMode && (
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? "처리 중..."
                  : mode === "create"
                    ? "등록하기"
                    : "수정하기"}
              </Button>
            )}
            {isViewMode && (
              <Button type="button" variant="outline" onClick={onClose}>
                닫기
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}