// ログイン時のAPI
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../utils/database';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    console.log("Received login attempt:", username, password); // ログインの情報を出力

    const client = await clientPromise;
    const db = client.db("Solution2Database"); // DB名が変更されたので確認
    const users = db.collection("users");

    const user = await users.findOne({ username, password });

    if (user) {
      console.log("Login successful for user:", username); // ログイン成功の確認
      return NextResponse.json({ success: true, redirectTo: "/dashboard" }); // ログイン成功後、リダイレクト先を返す
    } else {
      console.log("Login failed for user:", username); // ログイン失敗の確認
      return NextResponse.json({ success: false, message: "認証失敗" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error during login:", error); // エラー内容を出力
    return NextResponse.json({ success: false, message: "サーバーエラー" }, { status: 500 });
  }
}
