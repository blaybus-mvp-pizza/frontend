import {
  getAuctionList,
  createAuction,
  getAuction,
  editAuction,
  editAuctionStatus,
  getShippingStatus,
  AuctionFinalize,
} from "@/apis/auction";
import {
  AuctionListParams,
  AuctionListResponse,
  AuctionResponse,
  AuctionFormRequest,
  AuctionStatusRequest,
  ShippingStatusResponse,
  AuctionFinalizeResponse,
} from "@/apis/auction/type";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export const useAuctionList = (
  params: Omit<AuctionListParams, "authorization">
) => {
  const { data: session } = useSession();
  const authorization = session?.accessToken
    ? `Bearer ${session.accessToken}`
    : null;

  return useQuery<AuctionListResponse, Error>({
    queryKey: ["auctionList", params],
    queryFn: () => {
      if (!authorization) {
        throw new Error("인증 토큰이 없습니다.");
      }
      return getAuctionList({ ...params, authorization });
    },
    enabled: !!authorization,
  });
};

export const useCreateAuction = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation<AuctionResponse, Error, AuctionFormRequest>({
    mutationFn: (auctionData) => {
      const authorization = session?.accessToken
        ? `Bearer ${session.accessToken}`
        : null;
      if (!authorization) {
        throw new Error("인증 토큰이 없습니다.");
      }
      return createAuction({ authorization, auctionData });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auctionList"] });
      queryClient.invalidateQueries({ queryKey: ["productionList"] });
      toast.success("경매가 성공적으로 등록되었습니다.");
    },
    onError: (error) => {
      const apiError = error as any;
      const errorMessage = apiError.response?.data?.message || apiError.message;
      toast.error(`${errorMessage}`);
    },
  });
};

export const useAuction = (auctionId: number) => {
  const { data: session } = useSession();
  const authorization = session?.accessToken
    ? `Bearer ${session.accessToken}`
    : null;

  return useQuery<AuctionResponse, Error>({
    queryKey: ["auction", auctionId],
    queryFn: () => {
      if (!authorization) {
        throw new Error("인증 토큰이 없습니다.");
      }
      return getAuction({ authorization, auction_id: auctionId });
    },
    enabled: !!authorization,
  });
};

export const useEditAuction = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation<AuctionResponse, Error, AuctionFormRequest>({
    mutationFn: (auctionData) => {
      const authorization = session?.accessToken
        ? `Bearer ${session.accessToken}`
        : null;
      if (!authorization) {
        throw new Error("인증 토큰이 없습니다.");
      }
      return editAuction({
        authorization,
        auctionData: { ...auctionData },
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["auction", data.auction_id] });
      queryClient.invalidateQueries({ queryKey: ["auctionList"] });
      toast.success("경매 정보가 성공적으로 수정되었습니다.");
    },
    onError: (error) => {
      const apiError = error as any;
      const errorMessage = apiError.response?.data?.message || apiError.message;
      toast.error(`${errorMessage}`);
    },
  });
};

export const useEditAuctionStatus = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation<
    AuctionResponse,
    Error,
    { auction_id: number; status: AuctionStatusRequest["status"] }
  >({
    mutationFn: ({ auction_id, status }) => {
      const authorization = session?.accessToken
        ? `Bearer ${session.accessToken}`
        : null;
      if (!authorization) {
        throw new Error("인증 토큰이 없습니다.");
      }
      return editAuctionStatus({ authorization, auction_id, status });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["auction", data.auction_id] });
      queryClient.invalidateQueries({ queryKey: ["auctionList"] });
      toast.success("경매 상태가 성공적으로 변경되었습니다.");
    },
    onError: (error) => {
      const apiError = error as any;
      const errorMessage = apiError.response?.data?.message || apiError.message;
      toast.error(`${errorMessage}`);
    },
  });
};

export const useShippingStatus = (auctionId: number) => {
  const { data: session } = useSession();
  const authorization = session?.accessToken
    ? `Bearer ${session.accessToken}`
    : null;

  return useQuery<ShippingStatusResponse, Error>({
    queryKey: ["shippingStatus", auctionId],
    queryFn: () => {
      if (!authorization) {
        throw new Error("인증 토큰이 없습니다.");
      }
      return getShippingStatus({ authorization, auction_id: auctionId });
    },
    enabled: !!authorization,
  });
};

export const useAuctionFinalize = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation<AuctionFinalizeResponse, Error, { auction_id: number }>({
    mutationFn: ({ auction_id }) => {
      const authorization = session?.accessToken
        ? `Bearer ${session.accessToken}`
        : null;
      if (!authorization) {
        throw new Error("인증 토큰이 없습니다.");
      }
      return AuctionFinalize({ authorization, auction_id });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["auction", variables.auction_id],
      });
      queryClient.invalidateQueries({ queryKey: ["auctionList"] });
      toast.success("경매가 성공적으로 낙찰 처리되었습니다.");
    },
    onError: (error) => {
      const apiError = error as any;
      const errorMessage = apiError.response?.data?.message || apiError.message;
      toast.error(`${errorMessage}`);
    },
  });
};
