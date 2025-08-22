"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { Textarea } from "@workspace/ui/components/textarea";
import { Loader2, CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Calendar } from "@workspace/ui/components/calendar";
import { cn } from "@workspace/ui/lib/utils";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { PopupStore } from '@/api/popupstore/type';
import { useCreatePopupStore } from '@/hooks/use-popupstore';
import ImageUploader from '../image/image-uploader';

type PopUpStoreFormInputs = {
  name: string;
  description: string;
  sales_description: string;
  image_url: string;
  starts_at: Date;
  ends_at: Date;
};

export default function PopUpStoreCreateButton() {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, setValue, watch } =
    useForm<PopUpStoreFormInputs>();

  const startsAt = watch("starts_at");
  const endsAt = watch("ends_at");

  const { mutate, isPending } = useCreatePopupStore();

  const onSubmit: SubmitHandler<PopUpStoreFormInputs> = (data) => {
    const popupStoreData: PopupStore = {
      name: data.name,
      description: data.description,
      sales_description: data.sales_description,
      image_url: data.image_url,
      starts_at: data.starts_at ? data.starts_at.toISOString() : "",
      ends_at: data.ends_at ? data.ends_at.toISOString() : "",
    };

    mutate(popupStoreData, {
      onSuccess: () => handleOpenChange(false),
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>팝업스토어 등록</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>팝업스토어 등록</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">팝업스토어명</Label>
              <Input
                id="name"
                {...register("name", { required: true })}
                placeholder="팝업스토어명을 입력하세요"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image_url">이미지 업로드</Label>
              <ImageUploader
                entity="store"
                onUploadSuccess={(url) => setValue("image_url", url)}
                onRemove={() => setValue("image_url", "")}
                existingImageUrl={watch("image_url")}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="상세 설명을 입력하세요"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sales_description">판매 조건</Label>
              <Textarea
                id="sales_description"
                {...register("sales_description")}
                placeholder="한정 수량 판매, 주말 특가 등 판매 조건을 입력하세요"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="starts_at">시작일</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startsAt && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startsAt ? (
                      format(startsAt, "yyyy-MM-dd", { locale: ko })
                    ) : (
                      <span>날짜 선택</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startsAt}
                    onSelect={(date) => setValue("starts_at", date as Date)}
                    locale={ko}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ends_at">종료일</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endsAt && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endsAt ? (
                      format(endsAt, "yyyy-MM-dd", { locale: ko })
                    ) : (
                      <span>날짜 선택</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endsAt}
                    onSelect={(date) => setValue("ends_at", date as Date)}
                    locale={ko}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  등록 중...
                </span>
              ) : (
                "등록"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              취소
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}