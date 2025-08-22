"use client";

import { useSearchParams } from "next/navigation";
import { ProductForm } from "./product-form";

export function ProductFormWrapper() {
  const searchParams = useSearchParams();
  const storeId = searchParams.get("storeId");

  if (!storeId) return null;

  return <ProductForm storeId={Number(storeId)} />;
}
