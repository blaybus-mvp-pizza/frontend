import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { auctionApi } from '@/api/endpoints/auction.api';
import { useUIStore } from '@/store/ui.store';
import { queryKeys } from '@/api/queryKeys';
import { BidRequest, BidResult } from '@/api/types';
import { AxiosError } from 'axios';

export const useBidMutation = (
  options?: UseMutationOptions<BidResult, AxiosError, BidRequest, { previousData: unknown }>
) => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useUIStore();

  return useMutation<BidResult, AxiosError, BidRequest, { previousData: unknown }>({
    mutationFn: auctionApi.placeBid,
    
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: queryKeys.auctions.detail(variables.auction_id) 
      });
      
      // Snapshot the previous value
      const previousData = queryClient.getQueryData(
        queryKeys.auctions.detail(variables.auction_id)
      );
      
      // Optimistically update the auction detail
      queryClient.setQueryData(
        queryKeys.auctions.detail(variables.auction_id),
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            current_highest_bid: variables.amount,
            is_user_highest_bidder: true,
            total_bids: (old.total_bids || 0) + 1,
          };
        }
      );
      
      // Return context with snapshot
      return { previousData };
    },
    
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(
          queryKeys.auctions.detail(variables.auction_id),
          context.previousData
        );
      }
      
      // Handle specific error codes
      const errorCode = (error.response?.data as any)?.code;
      const errorMessage = (error.response?.data as any)?.message;
      
      switch (errorCode) {
        case 'BID_NOT_ALLOWED':
          showError('입찰이 허용되지 않습니다.');
          break;
        case 'AUCTION_NOT_RUNNING':
          showError('경매가 종료되었습니다.');
          break;
        case 'BID_TOO_LOW':
          showError('입찰 금액이 너무 낮습니다.');
          break;
        case 'BID_ALREADY_EXISTS':
          showError('이미 같은 금액으로 입찰하셨습니다.');
          break;
        case 'AUCTION_NOT_FOUND':
          showError('경매를 찾을 수 없습니다.');
          break;
        default:
          showError(errorMessage || '입찰에 실패했습니다. 다시 시도해주세요.');
      }
    },
    
    onSuccess: (data, variables) => {
      showSuccess('입찰이 성공적으로 완료되었습니다!');
      
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.auctions.detail(variables.auction_id) 
      });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.auctions.bids(variables.auction_id) 
      });
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.auctions.all, 'my-bids']
      });
    },
    
    ...options,
  });
};