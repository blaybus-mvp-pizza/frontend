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
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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

type PopUpStoreFormInputs = {
  name: string;
  description: string;
  sales_description: string;
  image_file: FileList;
  starts_at: Date;
  ends_at: Date;
};

export default function PopUpStoreCreateButton() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<PopUpStoreFormInputs>();

  const startsAt = watch("starts_at");
  const endsAt = watch("ends_at");

  const createPopUpStoreMutation = useMutation({
    mutationFn: async (data: PopUpStoreFormInputs) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("sales_description", data.sales_description);
      formData.append(
        "starts_at",
        data.starts_at ? new Date(data.starts_at).toISOString() : ""
      );
      formData.append(
        "ends_at",
        data.ends_at ? new Date(data.ends_at).toISOString() : ""
      );

      if (data.image_file && data.image_file[0]) {
        formData.append("image_file", data.image_file[0]);
      }

      const response = await axios.post("/api/popupstore", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["popup_stores"] });
      toast.success("팝업스토어가 성공적으로 등록되었습니다.");
      setOpen(false);
    },
    onError: (error) => {
      console.error("팝업스토어 등록 실패:", error);
      toast.error("팝업스토어 등록에 실패했습니다.");
    },
  });

  const onSubmit: SubmitHandler<PopUpStoreFormInputs> = (data) => {
    createPopUpStoreMutation.mutate(data);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      reset();
      setPreviewUrl(null);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>팝업스토어 등록</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>팝업스토어 등록</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>팝업스토어명</Label>
              <Input
                id='name'
                {...register("name", { required: true })}
                placeholder='팝업스토어명을 입력하세요'
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='image_file'>이미지 업로드</Label>
              <div className='flex flex-col gap-2'>
                <Input
                  id='image_file'
                  type='file'
                  accept='image/*'
                  {...register("image_file", { onChange: handleImageChange })}
                  className='p-2'
                />
                {previewUrl && (
                  <div className='w-full h-40 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden'>
                    <img
                      src={previewUrl}
                      alt='Image Preview'
                      className='w-full h-full object-contain'
                    />
                  </div>
                )}
              </div>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='description'>설명</Label>
              <Textarea
                id='description'
                {...register("description")}
                placeholder='상세 설명을 입력하세요'
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='sales_description'>판매 조건</Label>
              <Textarea
                id='sales_description'
                {...register("sales_description")}
                placeholder='한정 수량 판매, 주말 특가 등 판매 조건을 입력하세요'
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='starts_at'>시작일</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startsAt && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {startsAt ? (
                      format(startsAt, "yyyy-MM-dd", { locale: ko })
                    ) : (
                      <span>날짜 선택</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={startsAt}
                    onSelect={(date) => setValue("starts_at", date as Date)}
                    locale={ko}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='ends_at'>종료일</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endsAt && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {endsAt ? (
                      format(endsAt, "yyyy-MM-dd", { locale: ko })
                    ) : (
                      <span>날짜 선택</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={endsAt}
                    onSelect={(date) => setValue("ends_at", date as Date)}
                    locale={ko}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type='submit' disabled={createPopUpStoreMutation.isPending}>
              {createPopUpStoreMutation.isPending ? (
                <span className='flex items-center'>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  등록 중...
                </span>
              ) : (
                "등록"
              )}
            </Button>
            <Button
              type='button'
              variant='outline'
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
