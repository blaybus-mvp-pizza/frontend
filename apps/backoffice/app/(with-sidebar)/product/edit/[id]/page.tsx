import { ProductForm } from "@/components/product/product-form";

type PageParams = Promise<{ id: string }>;

export default async function ProductEditPage({
  params,
}: {
  params: PageParams;
}) {
  const { id } = await params;

  return (
    <div className='flex flex-col px-4'>
      <h1 className='text-2xl font-bold my-4'>상품 수정</h1>
      <div className='text-sm text-gray-500'>
        <p>
          상품 ID:{" "}
          <span className='font-mono text-gray-700'>{id}</span>
        </p>
      </div>
      <ProductForm productId={Number(id)} />
    </div>
  );
}
