"use client";

import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";

export default function ProductCreateButton({ storeId }: { storeId: string }) {
  const router = useRouter();
  return (
    <Button
      onClick={() => {
        router.push(`/product/create?storeId=${storeId}`);
      }}
    >
      상품 등록
    </Button>
  );
}
