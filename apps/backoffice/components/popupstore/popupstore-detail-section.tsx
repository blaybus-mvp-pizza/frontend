"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PopUpStoreInfo from "./popupstore-info";
import PopUpStoreProductsSection from "./popupstore-products-section";
import { TPOPUPSTORE } from "@/types";

type PopUpStoreDetailSectionProps = {
  id: string;
};

export default function PopUpStoreDetailSection({
  id,
}: PopUpStoreDetailSectionProps) {
  const { data: popupstore } = useQuery<TPOPUPSTORE>({
    queryKey: ["popupstore", id],
    queryFn: async () => {
      const response = await axios.get(`/api/popupstore/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  if (!popupstore) return null;

  return (
    <div>
      <PopUpStoreInfo id={id} />
      <PopUpStoreProductsSection popupstore={popupstore} />
    </div>
  );
}
