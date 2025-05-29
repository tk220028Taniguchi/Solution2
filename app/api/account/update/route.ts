// app/api/account/update/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import clientPromise from "@/utils/database";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token || !token.name) {
      return NextResponse.json({ error: "未認証のリクエストです" }, { status: 401 });
    }

    const { username, email } = await req.json();
    if (!username || !email) {
      return NextResponse.json({ error: "必要な情報が不足しています" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("Solution2Database");
    const users = db.collection("users");

    // usernameを含めて更新（旧usernameで検索）
    const result = await users.updateOne(
      { username: token.name },
      { $set: { username, email, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ アカウント更新エラー:", err);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
