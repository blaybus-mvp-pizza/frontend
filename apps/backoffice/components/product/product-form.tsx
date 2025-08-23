"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ProductRequest } from "@/apis/product/type";
import { useProduct, useCreateOrEditProduct } from "@/hooks/use-products";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import ImageUploader from "../image/image-uploader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { categoryMap } from '@/constants/proudct.constant';

const productSpecsSchema = z.object({
  material: z.string().min(1, { message: "재료를 입력해야 합니다." }),
  place_of_use: z.string().min(1, { message: "사용 장소를 입력해야 합니다." }),
  width_cm: z.preprocess(
    (a) => Number(a),
    z.number().positive({ message: "너비는 0보다 큰 값이어야 합니다." })
  ),
  height_cm: z.preprocess(
    (a) => Number(a),
    z.number().positive({ message: "높이는 0보다 큰 값이어야 합니다." })
  ),
  tolerance_cm: z.preprocess(
    (a) => Number(a),
    z.number().min(0, { message: "오차는 0 이상이어야 합니다." })
  ),
  edition_info: z
    .string()
    .min(1, { message: "에디션 정보를 입력해야 합니다." }),
  condition_note: z
    .string()
    .min(10, { message: "상태 설명은 10자 이상이어야 합니다." }),
});

const formSchema = z.object({
  name: z.string().min(2, { message: "상품명은 2자 이상이어야 합니다." }),
  summary: z.string().min(5, { message: "요약은 5자 이상이어야 합니다." }),
  description: z
    .string()
    .min(10, { message: "설명은 10자 이상이어야 합니다." }),
  price: z.preprocess(
    (a) => Number(a),
    z.number().positive({ message: "가격은 0보다 큰 값이어야 합니다." })
  ),
  // 재고 스키마를 z.preprocess를 사용해 수정
  stock: z.preprocess(
    (val) => (val === 1 ? 1 : undefined),
    z.number().int().min(1, { message: "재고는 1개만 가능합니다." })
  ),
  images: z
    .array(z.string().url({ message: "유효한 이미지 URL이어야 합니다." }))
    .min(1, { message: "최소 하나 이상의 이미지가 필요합니다." }),
  category: z.string().min(1, { message: "카테고리를 선택해야 합니다." }),
  tags: z.array(z.string()),
  specs: productSpecsSchema,
  store_id: z.preprocess((a) => Number(a), z.number().int().positive()),
  shipping_base_fee: z.preprocess((a) => Number(a), z.number().min(0)),
  shipping_free_threshold: z.preprocess((a) => Number(a), z.number().min(0)),
  shipping_extra_note: z.string().optional().or(z.literal("")),
  courier_name: z.string().optional().or(z.literal("")),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  productId?: number;
  storeId?: number;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  productId,
  storeId,
}) => {
  const isEditMode = !!productId;

  const { data: productData, isLoading: isProductLoading } = useProduct(
    isEditMode ? (productId as number) : undefined
  );

  const { mutate, isPending } = useCreateOrEditProduct();

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  const [inputValue, setInputValue] = useState('');

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      summary: "",
      description: "",
      price: 1000,
      stock: 1, 
      images: [],
      category: "",
      tags: [],
      specs: {
        material: "",
        place_of_use: "",
        width_cm: 10,
        height_cm: 10,
        tolerance_cm: 1,
        edition_info: "",
        condition_note: "",
      },
      store_id: storeId,
      shipping_base_fee: 0,
      shipping_free_threshold: 0,
      shipping_extra_note: "",
      courier_name: "",
    },
  });

  useEffect(() => {
    if (isEditMode && productData && !isFormInitialized) {
      const resetValues = {
        name: productData.name,
        summary: productData.summary,
        description: productData.description,
        price: productData.price,
        stock: 1, // 수정 모드에서도 재고를 1로 고정
        images: productData.images || [],
        category: productData.category,
        tags: productData.tags || [],
        specs: {
          material: productData.specs?.material || "",
          place_of_use: productData.specs?.place_of_use || "",
          width_cm: productData.specs?.width_cm ?? 10,
          height_cm: productData.specs?.height_cm ?? 10,
          tolerance_cm: productData.specs?.tolerance_cm ?? 1,
          edition_info: productData.specs?.edition_info || "",
          condition_note: productData.specs?.condition_note || "",
        },
        store_id: productData.store_id || storeId,
        shipping_base_fee: productData.shipping_base_fee || 0,
        shipping_free_threshold: productData.shipping_free_threshold || 0,
        shipping_extra_note: productData.shipping_extra_note || "",
        courier_name: productData.courier_name || "",
      };
      
      form.reset(resetValues);
      setImageUrls(productData.images || []);
      setIsFormInitialized(true);
    } else if (!isEditMode && !isFormInitialized) {
      setIsFormInitialized(true);
    }
  }, [isEditMode, productData, form, storeId, isFormInitialized]);

  const onSubmit = (values: ProductFormValues) => {
    const productToSubmit: ProductRequest = {
      ...values,
      images: imageUrls,
      shipping_extra_note: values.shipping_extra_note || "",
      courier_name: values.courier_name || "",
      id: isEditMode ? productId : undefined,
    };
    mutate(productToSubmit);
  };

  const handleImageUploadSuccess = useCallback(
    (url: string) => {
      setImageUrls((prevImages) => {
        const newImages = [...prevImages, url];
        form.setValue("images", newImages, { shouldValidate: true });
        return newImages;
      });
    },
    [form]
  );

  const handleRemoveImage = useCallback(
    (urlToRemove: string) => {
      setImageUrls((prevImages) => {
        const newImages = prevImages.filter((url) => url !== urlToRemove);
        form.setValue("images", newImages, { shouldValidate: true });
        return newImages;
      });
    },
    [form]
  );

  if (isEditMode && isProductLoading) {
    return <div>상품 정보를 불러오는 중...</div>;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-full space-y-8 rounded-lg bg-white py-6'
      >
        <div className='grid lg:grid-cols-2 gap-8'>
          <div className='space-y-8'>
            <section className='space-y-6'>
              <h3 className='text-xl font-semibold text-gray-800 border-b pb-2'>
                기본 정보
              </h3>
              <div className='grid gap-6 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        상품명 <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='상품명을 입력하세요' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='category'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        카테고리 <span className='text-red-500'>*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder="카테고리를 선택하세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(categoryMap).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='price'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        가격 (₩) <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='10000'
                          {...field}
                          value={Number(field.value)}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='stock'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        재고 <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        {/* 읽기 전용으로 표시 */}
                        <p className="text-gray-800 font-medium">1개</p>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='summary'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      상품 요약 <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='상품을 한 문장으로 요약하세요'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      상세 설명 <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='상품의 특징, 사용법 등을 자세히 입력하세요.'
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='tags'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>태그</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='태그를 입력하고 Enter를 누르세요'
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const newTag = inputValue.trim();
                            if (newTag && !field.value.includes(newTag)) {
                              field.onChange([...field.value, newTag]);
                              setInputValue('');
                            }
                          }
                        }}
                      />
                    </FormControl>
                    <div className='mt-2 flex flex-wrap gap-2'>
                      {field.value.map((tag, index) => (
                        <span
                          key={index}
                          className='flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700'
                        >
                          {tag}
                          <button
                            type='button'
                            onClick={() => {
                              const newTags = field.value.filter((t) => t !== tag);
                              field.onChange(newTags);
                            }}
                            className='text-gray-500 hover:text-red-500'
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
            <section className='space-y-6'>
              <h3 className='text-xl font-semibold text-gray-800 border-b pb-2'>
                상세 정보
              </h3>
              <div className='grid gap-6 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='specs.material'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>재료</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='예: 천연가죽, 알루미늄'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='specs.place_of_use'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>사용 장소</FormLabel>
                      <FormControl>
                        <Input placeholder='예: 실내 전용, 야외용' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid gap-6 sm:grid-cols-3'>
                <FormField
                  control={form.control}
                  name='specs.width_cm'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>너비 (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='50'
                          {...field}
                          value={Number(field.value)}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value)
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='specs.height_cm'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>높이 (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='70'
                          {...field}
                          value={Number(field.value)}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value)
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='specs.tolerance_cm'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>오차 (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='1'
                          {...field}
                          value={Number(field.value)}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value)
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid gap-6 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='specs.edition_info'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>에디션 정보</FormLabel>
                      <FormControl>
                        <Input placeholder='예: 2024 한정판' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='specs.condition_note'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>상태 설명</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='예: 미개봉 새상품, 약간의 흠집'
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
          </div>

          <div className='space-y-8'>
            <section className='space-y-6'>
              <h3 className='text-xl font-semibold text-gray-800 border-b pb-2'>
                상품 이미지
              </h3>
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {imageUrls.map((imageUrl, index) => (
                  <div key={`existing-${index}`} className='relative w-full h-48'>
                    <ImageUploader
                      entity='product'
                      existingImageUrl={imageUrl}
                      onRemove={() => handleRemoveImage(imageUrl)}
                      onUploadSuccess={() => {}}
                    />
                  </div>
                ))}
                {imageUrls.length < 6 && (
                  <div key="new-upload" className='relative w-full h-48'>
                    <ImageUploader
                      entity='product'
                      onUploadSuccess={handleImageUploadSuccess}
                    />
                  </div>
                )}
              </div>
              {form.formState.errors.images && (
                <div className="text-sm text-red-500 mt-2 text-center">
                  {form.formState.errors.images.message}
                </div>
              )}
            </section>

            <section className='space-y-6'>
              <h3 className='text-xl font-semibold text-gray-800 border-b pb-2'>
                배송 정보
              </h3>
              <div className='grid gap-6 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='courier_name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>택배사</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='예: 우체국택배, CJ대한통운'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='shipping_base_fee'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>기본 배송비 (₩)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='3000'
                          {...field}
                          value={Number(field.value)}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='shipping_free_threshold'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>무료 배송 기준액 (₩)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='50000'
                        {...field}
                        value={Number(field.value)}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='shipping_extra_note'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>배송 추가 정보</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='예: 제주도/도서산간 지역 추가 비용 발생'
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
          </div>
        </div>
        <div className='pt-6 flex justify-end'>
          <Button type='submit' disabled={isPending}>
            {isPending ? "처리 중..." : isEditMode ? "수정" : "저장"}
          </Button>
        </div>
      </form>
    </Form>
  );
};