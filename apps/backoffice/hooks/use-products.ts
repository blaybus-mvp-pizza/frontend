import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getProductList, getProduct, createOrEditProduct } from "@/api/product";
import {
  ProductListParams,
  ProductListResponse,
  ProductDetailResponse,
  ProductResponse,
  TProductStatus,
  ProductRequest,
} from "@/api/product/type";
import { useRouter } from "next/navigation";

export const useProductList = (
  params: Omit<ProductListParams, "status" | "category"> & {
    status?: string;
    category?: string;
  }
) => {
  const apiParams: ProductListParams = {
    page: params.page,
    size: params.size,
    status: (params.status || "ALL") as TProductStatus,
    category: params.category || "ALL",
    q: params.q,
    store_id: params.store_id,
  };
  return useQuery<ProductListResponse, Error>({
    queryKey: ["productList", apiParams],
    queryFn: () => getProductList(apiParams),
  });
};

export const useProduct = (productId: number | undefined) => {
  return useQuery<ProductDetailResponse, Error>({
    queryKey: ["product", productId],
    queryFn: () => getProduct({ product_id: productId as number }),
    enabled: !!productId, // productId가 있을 때만 쿼리 실행
  });
};

export const useCreateOrEditProduct = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<ProductResponse, Error, ProductRequest>({
    mutationFn: (productData) => createOrEditProduct({ productData }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["productList"] });
      queryClient.invalidateQueries({ queryKey: ["product", data.id] });
      toast.success(
        `상품이 성공적으로 ${data.id ? "수정" : "등록"}되었습니다.`
      );
      router.back();
    },
    onError: (error) => {
      const apiError = error as any;
      const errorMessage = apiError.response?.data?.message || apiError.message;
      toast.error(
        `상품 ${apiError.response?.data?.message ? "수정" : "등록"} 실패: ${errorMessage}`
      );
    },
  });
};
