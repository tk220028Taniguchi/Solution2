// app/api/threshold/route.ts
export const runtime = "nodejs";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: "未認証" }, { status: 401 });
  }

  if (token.role !== "editor") {
    return NextResponse.json({ error: "編集権限がありません" }, { status: 403 });
  }

  return NextResponse.json({ value: 100 }); // 仮のしきい値
}
