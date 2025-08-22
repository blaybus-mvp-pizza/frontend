import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/popupstore/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const popUpStoreId = Number(id);
    if (isNaN(popUpStoreId)) {
      return NextResponse.json(
        { error: "유효하지 않은 상품 ID입니다." },
        { status: 400 }
      );
    }

    const popupstore = await prisma.popup_store.findUnique({
      where: { id: popUpStoreId },
      include: {
        product: {
          include: {
            product_image: true,
          },
        },
      },
    });

    if (!popupstore) {
      return NextResponse.json(
        { error: "팝업스토어 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const convertData = (obj: any): any => {
      if (typeof obj !== "object" || obj === null) {
        return obj;
      }

      if (obj instanceof Date) {
        return obj.toISOString();
      }

      if (Array.isArray(obj)) {
        return obj.map((item) => convertData(item));
      }

      const newObj: Record<string, any> = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (typeof value === "bigint") {
            newObj[key] = value.toString();
          } else {
            newObj[key] = convertData(value);
          }
        }
      }
      return newObj;
    };

    const serializedData = convertData(popupstore);

    return NextResponse.json(serializedData);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "팝업스토어 정보를 불러오는 데 실패했습니다." },
      { status: 500 }
    );
  }
}
