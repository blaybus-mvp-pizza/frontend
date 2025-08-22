import axios, { AxiosResponse } from "axios";
import {
  ProductDetailResponse,
  ProductListParams,
  ProductListResponse,
  ProductRequest,
} from "./type";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 1. 상품 목록 조회
export const getProductList = async ({
  ...params
}: ProductListParams): Promise<ProductListResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/v1/products`, {
      params: params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 2. 상품 생성/수정
export const createOrEditProduct = async ({
  productData,
}: {
  productData: ProductRequest;
}): Promise<ProductDetailResponse> => {
  try {
    let response: AxiosResponse<ProductDetailResponse>;

    response = await axios.post(
      `${API_BASE_URL}/admin/v1/products`,
      productData
    );

    return response.data;
  } catch (error) {
    console.error(
      "상품 생성/수정 실패:",
      (error as any).response?.data || (error as any).message
    );
    throw error;
  }
};

// 3. 상품 상세 조회
export const getProduct = async ({
  product_id,
}: {
  product_id: number;
}): Promise<ProductDetailResponse> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/admin/v1/products/${product_id}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "상품 상세 조회 실패:",
      (error as any).response?.data || (error as any).message
    );
    throw error;
  }
};
