import { createOrEditPopUpStore, getPopupStoreList } from '@/api/popupstore';
import { PopupStore, PopupStoreListParams, PopupStoreListResponse } from '@/api/popupstore/type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const usePopupStoreList = (
  params: PopupStoreListParams
) => {
  return useQuery<PopupStoreListResponse, Error>({
    queryKey: ["popupStores", params],
    queryFn: () => {
      return getPopupStoreList({ ...params });
    },
  });
};

export const useCreatePopupStore = () => {
  const queryClient = useQueryClient();
  return useMutation<PopupStore, Error, PopupStore>({
    mutationFn: (popupStoreData) => {
      return createOrEditPopUpStore({ popupStoreData });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["popupStores"] });
      toast.success("팝업스토어가 성공적으로 등록되었습니다.");
    },
    onError: (error) => {
      const apiError = error as any;
      const errorMessage = apiError.response?.data?.message || apiError.message;
      toast.error(`${errorMessage}`);
    },
  });
};