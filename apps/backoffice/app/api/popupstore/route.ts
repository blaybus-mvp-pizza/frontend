import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { popup_store } from "@/generated/prisma";

// GET /api/popupstore
export async function GET() {
  try {
    const popupstores: popup_store[] = await prisma.popup_store.findMany();
    const serializedPopUpStores = popupstores.map((popupstore) => {
      const newProduct: Record<string, any> = {};
      for (const key in popupstore) {
        if (Object.prototype.hasOwnProperty.call(popupstore, key)) {
          const value = (popupstore as Record<string, any>)[key];
          newProduct[key] =
            typeof value === "bigint" ? value.toString() : value;
        }
      }
      return newProduct;
    });
    return NextResponse.json(serializedPopUpStores);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "팝업스토어 목록을 불러오는 데 실패했습니다." },
      { status: 500 }
    );
  }
}

// POST /api/popupstore
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      description,
      sales_description,
      starts_at,
      ends_at,
      image_url,
    } = body;

    const newPopupStore = await prisma.popup_store.create({
      data: {
        name,
        description,
        sales_description,
        image_url,
        starts_at: starts_at ? new Date(starts_at) : null,
        ends_at: ends_at ? new Date(ends_at) : null,
      },
    });

    const serializedData = JSON.stringify(newPopupStore, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );

    return new NextResponse(serializedData, {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("팝업스토어 생성 실패:", error);
    return NextResponse.json(
      { error: "팝업스토어를 생성하는 데 실패했습니다." },
      { status: 500 }
    );
  }
}
