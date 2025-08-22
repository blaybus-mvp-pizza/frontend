import PopUpStoreDetailSection from "@/components/popupstore/popupstore-detail-section";

type PageParams = Promise<{ id: string }>;

export default async function PopUpStoreDetailPage({
  params,
}: {
  params: PageParams;
}) {
  const { id } = await params;
  return (
    <div>
      <PopUpStoreDetailSection id={id} />
    </div>
  );
}
