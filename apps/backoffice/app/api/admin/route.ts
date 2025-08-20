import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin
export async function GET() {
  try {
    const admins = await prisma.admin.findMany();
    return NextResponse.json(admins);
  } catch (error) {
    return NextResponse.json(
      { error: "관리자 목록을 불러오는 데 실패했습니다." },
      { status: 500 }
    );
  }
}

// POST /api/admin
export async function POST(req: NextRequest) {
  try {
    const { nickname, password } = await req.json();

    if (!nickname || !password) {
      return NextResponse.json(
        { error: "아이디 또는 비밀번호를 입력해주세요." },
        { status: 400 }
      );
    }

    const newAdmin = await prisma.admin.create({
      data: {
        nickname,
        password,
        role: "ADMIN",
      },
    });
    return NextResponse.json(newAdmin, { status: 201 });
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json(
        { error: "이미 존재하는 아이디입니다." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "관리자 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}
