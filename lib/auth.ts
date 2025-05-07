// セッション管理用(今のところ主に「アカウント情報表示用」)
// lib/auth.ts

// import bcrypt from "bcryptjs"; // 本番ではこれを使う
// lib/auth.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/utils/database";

export const authOptions : NextAuthOptions= {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db("Solution2Database");
        
        // ユーザーをusernameで検索
        const user = await db.collection("users").findOne({ username: credentials?.username });

        // ユーザーが見つかり、パスワードが一致すれば認証
        if (user && user.password === credentials?.password) {
          return {
            id: user._id.toString(), // ObjectIdを文字列に変換
            name: user.username,     // ユーザー名を名前として使用
            email: user.email || null, // メールが未設定の場合も考慮
          };
        }
        return null; // ユーザーが見つからないか、パスワードが一致しない場合
      },
    }),
  ],
  session: {
    strategy: "jwt", // JWTセッション
  },
  pages: {
    signIn: "/", // ログインページ
  },
};
