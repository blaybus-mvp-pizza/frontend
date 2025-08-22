import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as xlsx from "xlsx";
import { product as PrismaProduct } from "@/generated/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export async function GET() {
  try {
    const products: PrismaProduct[] = await prisma.product.findMany();

    const productsForExcel = products.map((product) => {
      const formattedProduct: Record<string, any> = {};
      for (const key in product) {
        if (Object.prototype.hasOwnProperty.call(product, key)) {
          const value = (product as Record<string, any>)[key];
          if (typeof value === "bigint" || value instanceof Decimal) {
            formattedProduct[key] = value.toString();
          } else {
            formattedProduct[key] = value;
          }
        }
      }
      return formattedProduct;
    });

    const worksheet = xlsx.utils.json_to_sheet(productsForExcel);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Products");

    const excelBuffer = xlsx.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Disposition": 'attachment; filename="products.xlsx"',
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("Error generating Excel file:", error);
    return NextResponse.json(
      { error: "엑셀 파일 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}
