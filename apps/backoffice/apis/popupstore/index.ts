import axios, { AxiosResponse } from "axios";
import { PopupStore, PopupStoreListParams, PopupStoreListResponse } from "./type";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getPopupStoreList = async ({
  ...params
}: PopupStoreListParams): Promise<PopupStoreListResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/v1/stores`, {
      params: params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createOrEditPopUpStore = async({
  popupStoreData,
}: {popupStoreData: PopupStore}) : Promise<PopupStore> => {
  try {
    const { id, ...createData } =  popupStoreData;
    const response: AxiosResponse<PopupStore> = await axios.post(
      `${API_BASE_URL}/admin/v1/stores`,
      createData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}