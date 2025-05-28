// app/api/email_setting/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/utils/database";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || !token.name) {
    return NextResponse.json({ error: "未認証です" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db("Solution2Database");
  const user = await db.collection("users").findOne({ username: token.name });

  if (!user) {
    return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
  }

  return NextResponse.json({
    email: user.email || "",
    enabled: user.emailEnabled ?? true, // デフォルトはtrue
  });
}
