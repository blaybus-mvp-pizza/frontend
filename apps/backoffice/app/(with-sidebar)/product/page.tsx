import ProductTable from "@/components/product/product-table";

export default function ProductPage() {
  return (
    <div>
      <h2 className='text-2xl font-bold mb-2'>전체 상품 목록</h2>
      <ProductTable />
    </div>
  );
}
