// app/password_change/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";



const PasswordChangePage = () => {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPass !== confirm) {
      setMessage("❌ 新しいパスワードと確認が一致しません。");
      return;
    }

    try {
      const res = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current, newPass }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ パスワードを変更しました。");
        setCurrent("");
        setNewPass("");
        setConfirm("");
      } else {
        setMessage("❌ エラー: " + data.error);
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("❌ 通信エラーが発生しました。");
    }
  };

  const router = useRouter();

   const goBack = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg w-96">
        <h1 className="text-xl font-bold text-center mb-6">🔐 パスワード変更</h1>
        <form onSubmit={handleSubmit}>
          <label className="block mb-4 text-sm">
            現在のパスワード:
            <input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </label>
          <label className="block mb-4 text-sm">
            新しいパスワード:
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </label>
          <label className="block mb-4 text-sm">
            確認:
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </label>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-md font-semibold hover:bg-green-600"
          >
            変更
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm">{message}</p>}

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

export default PasswordChangePage;
