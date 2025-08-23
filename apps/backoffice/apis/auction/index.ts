import axios, { AxiosResponse } from "axios";
import {
  AuctionListParams,
  AuctionListResponse,
  AuctionParams,
  AuctionResponse,
  ShippingStatusResponse,
  AuctionFinalizeResponse,
  AuctionStatusRequest,
  AuctionFormRequest,
} from "./type";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 1. 경매 목록 조회
export const getAuctionList = async ({
  authorization,
  ...params
}: AuctionListParams): Promise<AuctionListResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/v1/auctions`, {
      headers: {
        Authorization: authorization,
      },
      params: params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 2. 경매 등록
export const createAuction = async ({
  authorization,
  auctionData,
}: {
  authorization: string;
  auctionData: AuctionFormRequest;
}): Promise<AuctionResponse> => {
  try {
    const { id, ...createData } = auctionData;
    const response: AxiosResponse<AuctionResponse> = await axios.post(
      `${API_BASE_URL}/admin/v1/auctions`,
      createData,
      {
        headers: {
          Authorization: authorization,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 3. 경매 상세 조회
export const getAuction = async ({
  authorization,
  auction_id,
}: AuctionParams): Promise<AuctionResponse> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/admin/v1/auctions/${auction_id}`,
      {
        headers: {
          Authorization: authorization,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 4. 경매 수정
export const editAuction = async ({
  authorization,
  auctionData,
}: {
  authorization: string;
  auctionData: AuctionFormRequest;
}): Promise<AuctionResponse> => {
  try {
    const { id, ...updateData } = auctionData;
    const response: AxiosResponse<AuctionResponse> = await axios.patch(
      `${API_BASE_URL}/admin/v1/auctions/${id}`,
      auctionData,
      {
        headers: {
          Authorization: authorization,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 5. 경매 상태 변경
export const editAuctionStatus = async ({
  authorization,
  auction_id,
  status,
}: AuctionParams & AuctionStatusRequest): Promise<AuctionResponse> => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/admin/v1/auctions/${auction_id}/status`,
      { status },
      {
        headers: {
          Authorization: authorization,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 6. 배송 상태 조회
export const getShippingStatus = async ({
  authorization,
  auction_id,
}: AuctionParams): Promise<ShippingStatusResponse> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/admin/v1/auctions/${auction_id}/shipping`,
      {
        headers: {
          Authorization: authorization,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 7. 낙찰 처리
export const AuctionFinalize = async ({
  authorization,
  auction_id,
}: AuctionParams): Promise<AuctionFinalizeResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/admin/v1/auctions/${auction_id}/finalize`,
      null,
      {
        headers: {
          Authorization: authorization,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
