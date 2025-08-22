import { ProductFormWrapper } from "@/components/product/product-form-wrapper";
import { Suspense } from "react";

export default function ProductCreatePage() {
  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>상품 등록</h1>
      <Suspense fallback={<div>로딩 중...</div>}>
        <ProductFormWrapper />
      </Suspense>
    </div>
  );
}
