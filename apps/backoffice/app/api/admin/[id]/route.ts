import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// DELETE /api/admin/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const adminId = Number(id);
    if (isNaN(adminId)) {
      return NextResponse.json(
        { error: "유효하지 않은 관리자 ID입니다." },
        { status: 400 }
      );
    }
    await prisma.admin.delete({
      where: { id: adminId },
    });
    return NextResponse.json(
      { message: "관리자 계정이 삭제되었습니다." },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    if (error.code === "P2025") {
      // P2025: 삭제할 레코드를 찾을 수 없을 때 발생하는 Prisma 오류
      return NextResponse.json(
        { error: "해당 관리자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "관리자 삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}
