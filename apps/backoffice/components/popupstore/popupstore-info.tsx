"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Image as ImageIcon, Store, Calendar, Info, Tags } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TPOPUPSTORE } from "@/types";

const InfoRow = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) => (
  <div className='flex items-start gap-4 py-3 border-b border-gray-200'>
    <div className='flex-shrink-0 text-gray-500 mt-1'>{icon}</div>
    <div className='flex-1'>
      <span className='text-sm font-medium text-gray-600'>{label}</span>
      <p className='mt-1 text-base text-gray-800 break-words leading-relaxed'>
        {children}
      </p>
    </div>
  </div>
);

type PopUpStoreDetailSectionProps = {
  id: string;
};

export default function PopUpStoreInfo({ id }: PopUpStoreDetailSectionProps) {
  const { data: popupstore } = useQuery<TPOPUPSTORE>({
    queryKey: ["popupstore", id],
    queryFn: async () => {
      const response = await axios.get(`/api/popupstore/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  if (!popupstore) return null;

  const startsAt = popupstore.starts_at ? new Date(popupstore.starts_at) : null;
  const endsAt = popupstore.ends_at ? new Date(popupstore.ends_at) : null;
  const formattedDate =
    startsAt && endsAt && !isNaN(startsAt.getTime()) && !isNaN(endsAt.getTime())
      ? `${format(startsAt, "yyyy년 MM월 dd일", { locale: ko })} ~ ${format(endsAt, "yyyy년 MM월 dd일", { locale: ko })}`
      : "기간 정보 없음";

  return (
    <>
      <h2 className='text-2xl font-bold mb-4'>팝업스토어 정보</h2>
      <div className='flex flex-col md:flex-row gap-8'>
        <div className='flex-shrink-0 mx-auto md:mx-0 w-full md:w-64 h-48 relative rounded-md overflow-hidden bg-gray-50 border border-gray-200'>
          {popupstore.image_url ? (
            <Image
              src={popupstore.image_url}
              alt={popupstore.name}
              fill
              style={{ objectFit: "contain" }}
              sizes='(max-width: 768px) 100vw, 33vw'
              unoptimized={true}
              className='transition-opacity duration-200'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center bg-gray-100 text-gray-400'>
              <ImageIcon className='h-12 w-12' />
            </div>
          )}
        </div>
        <div className='flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <InfoRow icon={<Store size={18} />} label='팝업스토어명'>
            {popupstore.name}
          </InfoRow>
          <InfoRow icon={<Info size={18} />} label='상세 설명'>
            {popupstore.description || "설명 없음"}
          </InfoRow>
          <InfoRow icon={<Tags size={18} />} label='판매 조건'>
            {popupstore.sales_description || "판매 조건 없음"}
          </InfoRow>
          <InfoRow icon={<Calendar size={18} />} label='운영 기간'>
            {formattedDate}
          </InfoRow>
        </div>
      </div>
    </>
  );
}
