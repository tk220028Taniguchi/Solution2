// lib/auth.ts
// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/utils/database";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("✅ authorize called with:", credentials);

        if (!credentials?.username || !credentials?.password) {
          console.log("❌ ユーザー名またはパスワードが未入力");
          return null;
        }

        try {
          const client = await clientPromise;
          const db = client.db("Solution2Database");
          console.log("✅ MongoDB接続成功");

          const user = await db
            .collection("users")
            .findOne({ username: credentials.username });

          console.log("🔍 ユーザー検索結果:", user);

          if (!user) {
            console.log("❌ ユーザーが見つかりません");
            return null;
          }

          if (user.password !== credentials.password) {
            console.log("❌ パスワードが一致しません");
            return null;
          }

          console.log("✅ 認証成功");
          return {
            id: user._id.toString(),
            name: user.username,
            email: user.email || null,
            role: user.role || "user",
          };
        } catch (err) {
          console.error("❌ authorize エラー:", err);
          throw new Error("認証エラーが発生しました");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET, // ✅ 本番でも必要
};
