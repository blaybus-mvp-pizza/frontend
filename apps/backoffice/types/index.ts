import { product, product_image } from "@/generated/prisma";

export interface TPRODUCTWITHIMAGES extends product {
  product_image: product_image[];
}

export interface TPOPUPSTORE {
  id: string;
  name: string;
  description: string;
  sales_description: string;
  image_url: string;
  starts_at: string;
  ends_at: string;
  product: TPRODUCTWITHIMAGES[];
}
