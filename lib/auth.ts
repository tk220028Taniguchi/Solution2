// セッション管理用(今のところ主に「アカウント情報表示用」)
// lib/auth.ts

// import bcrypt from "bcryptjs"; // 本番ではこれを使う
// lib/auth.ts

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
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
        //  ここが重要：undefinedチェック
        if (!credentials || !credentials.username || !credentials.password) {
          throw new Error("Missing credentials");
        }

        const client = await clientPromise;
        const db = client.db("Solution2Database");

        const user = await db.collection("users").findOne({ username: credentials.username });

        if (user && user.password === credentials.password) {
          return {
            id: user._id.toString(),
            name: user.username,
            email: user.email || null,
          };
        }

        return null;
      },
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
};
