"use client";
import { useSession } from "next-auth/react";
import React from "react";
import Link from "next/link";

type User = {
  id: string;
  username: string;
  password: string;
  name?: string | null;
  company?: string | null;
  email?: string | null;
};

const AccountPage = () => {
  const { data: session, status } = useSession(); // セッション情報の取得
  const loading = status === "loading";

  if (loading) {
    console.log("読み込み中: セッション情報がまだです");
    return <div>読み込み中...</div>;
  }

  console.log("セッション情報:", session); // セッションが読み込まれた後でログ

  // ユーザー情報
  const user = session?.user as User;

  return (
    <div className="min-h-screen bg-[#f5f7fa] py-12 px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-[#003366] mb-6">アカウント情報</h1>
        <table className="table-auto border-collapse border border-gray-300 w-full text-left">
          <tbody>
            <tr>
              <th className="border border-gray-300 px-4 py-2 bg-gray-100">会社名</th>
              <td className="border border-gray-300 px-4 py-2">{user?.company || "未設定"}</td>
            </tr>
            <tr>
              <th className="border border-gray-300 px-4 py-2 bg-gray-100">ユーザーID</th>
              <td className="border border-gray-300 px-4 py-2">{user?.username || "未設定"}</td>
            </tr>
            <tr>
              <th className="border border-gray-300 px-4 py-2 bg-gray-100">名前</th>
              <td className="border border-gray-300 px-4 py-2">{user?.name || "未設定"}</td>
            </tr>
            <tr>
              <th className="border border-gray-300 px-4 py-2 bg-gray-100">メールアドレス</th>
              <td className="border border-gray-300 px-4 py-2">{user?.email || "未設定"}</td>
            </tr>
            <tr>
              <th className="border border-gray-300 px-4 py-2 bg-gray-100">パスワード</th>
              <td className="border border-gray-300 px-4 py-2">********</td>
            </tr>
          </tbody>
        </table>
        <div className="mt-6 flex justify-between">
          <Link
            href="/dashboard"
            className="inline-block bg-[#003366] text-white px-4 py-1 rounded hover:bg-[#005599]"
          >
            戻る
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
