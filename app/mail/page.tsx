// app/email_setting/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const EmailSettingPage = () => {
  const [email, setEmail] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    // 初期状態を取得（メールアドレスと通知設定）
    (async () => {
      const res = await fetch("/api/email_setting");
      const data = await res.json();
      if (res.ok) {
        setEmail(data.email);
        setEnabled(data.enabled);
      } else {
        setMessage("❌ ユーザー情報の取得に失敗しました");
      }
    })();
  }, []);

  const handleSave = async () => {
    const res = await fetch("/api/email_setting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("✅ 通知設定を保存しました");
    } else {
      setMessage("❌ 保存に失敗しました: " + data.error);
    }
  };

  const goBack = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h1 className="text-xl font-bold mb-4">📧 メール通知設定</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">現在のメールアドレス:</label>
          <p className="mt-1 text-gray-800">{email || "読み込み中..."}</p>
        </div>

        <div className="mb-6">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-gray-700">通知を受け取る</span>
          </label>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          保存
        </button>

        {message && <p className="mt-4 text-center text-sm">{message}</p>}

        <div className="text-center mt-1">
          <button
          onClick={goBack}
          className="mt-2 w-full bg-gray-400 text-white py-1 rounded-md hover:bg-gray-500"
        >
        戻る
        </button>
        </div>
      </div>
    </div>
  );
};

export default EmailSettingPage;