import ProductDetailSection from "@/components/product/product-detail-section";

type PageParams = Promise<{ id: string }>;

export default async function ProductDetailPage({
  params,
}: {
  params: PageParams;
}) {
  const { id } = await params;

  return <ProductDetailSection id={id} />;
}
