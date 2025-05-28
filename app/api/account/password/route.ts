// app/api/account/password/route.ts
export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import clientPromise from "@/utils/database";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req }); // ← ここで認証トークン取得
    if (!token || !token.name) {
      return NextResponse.json({ error: "未認証のリクエストです" }, { status: 401 });
    }

    const { current, newPass } = await req.json();
    if (!current || !newPass) {
      return NextResponse.json({ error: "すべての項目を入力してください" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("Solution2Database");
    const users = db.collection("users");

    const user = await users.findOne({ username: token.name });
    if (!user || user.password !== current) {
      return NextResponse.json({ error: "現在のパスワードが正しくありません。" }, { status: 401 });
    }

    await users.updateOne(
      { username: token.name },
      { $set: { password: newPass, passwordChangedAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ パスワード変更エラー:", err);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
