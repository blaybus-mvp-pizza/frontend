import ProductContent from "@/components/products/product-content";
import { ProductListSkeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

// Main component with Suspense boundary
export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <ProductListSkeleton />
          </div>
        </div>
      }
    >
      <ProductContent />
    </Suspense>
  );
}
