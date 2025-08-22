import { NextResponse } from "next/server";

const mockStatsData = [
  {
    title: "현재 진행 중인 경매 수",
    value: "120건",
    description: "오늘 시작된 경매 15건",
  },
  {
    title: "총 상품 수",
    value: "5,321개",
    description: "신규 등록 상품 120개",
  },
  {
    title: "오늘 결제 건수",
    value: "1,245건",
    description: "총 결제 금액 ￦15,000,000",
  },
  {
    title: "배송 준비 건수",
    value: "210건",
    description: "배송 중 550건, 배송 완료 980건",
  },
  {
    title: "미답변 고객 문의",
    value: "7건",
    description: "오늘 등록된 신규 문의 3건",
  },
  {
    title: "판매 완료된 상품",
    value: "3,450개",
    description: "어제보다 10개 증가",
  },
];

// GET /api/dashboard/stats
export async function GET() {
  try {
    return NextResponse.json({ stats: mockStatsData });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
