export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/utils/database";
import { getToken } from "next-auth/jwt";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token || !token.name) {
      return NextResponse.json({ error: "未認証です" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("Solution2Database");
    const users = db.collection("users");

    // トークンからユーザー情報取得
    const user = await users.findOne({ username: token.name });
    if (!user || !user.email) {
      return NextResponse.json({ error: "ユーザーのメールアドレスが見つかりません" }, { status: 404 });
    }

    const { subject, message } = await req.json();
    if (!subject || !message) {
      return NextResponse.json({ error: "件名と本文が必要です" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"粒子判定システム" <${process.env.SMTP_USER}>`,
      to: user.email, // ✅ 自分だけに送信
      subject,
      text: message,
    });

    return NextResponse.json({ success: true, to: user.email });
  } catch (err) {
    console.error("メール送信エラー:", err);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
