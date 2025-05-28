// app/account_edit/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const AccountEditPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/account/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ ユーザー情報を変更しました。再ログインしてください。");

        // 2秒後にサインアウトしてログイン画面へ
        setTimeout(() => {
          signOut({ callbackUrl: "/login" });
        }, 2000);
      } else {
        setMessage(`❌ エラー: ${data.error}`);
      }
    } catch (err) {
      console.error("エラー:", err);
      setMessage("❌ 通信エラーが発生しました。");
    }
  };
    const goBack = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg w-80">
        <h1 className="text-xl font-bold text-center mb-6">👤 アカウント情報の編集</h1>
        <form onSubmit={handleSubmit}>
          <label className="block mb-4 text-sm font-medium">
            新しいユーザー名:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </label>
          <label className="block mb-4 text-sm font-medium">
            メールアドレス:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </label>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700"
          >
            保存
          </button>
        </form>
        {message && <p className="mt6 text-center text-sm">{message}</p>}

         <button
          onClick={goBack}
          className="mt-2 w-full bg-gray-400 text-white py-1 rounded-md hover:bg-gray-500"
        >
          戻る
        </button>

      </div>
    </div>
  );
};

export default AccountEditPage;
