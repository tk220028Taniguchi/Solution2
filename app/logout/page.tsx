// app/logout/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LogoutPage = () => {
  const router = useRouter();

  const confirmLogout = () => {
    // localStorageのクリア（必要に応じて）
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    // NextAuthを使ってる場合は下記でログアウト処理を追加も可能：
    // signOut();

    // ログインページにリダイレクト
    router.push("/login");
  };

  const cancelLogout = () => {
    router.push("/dashboard");
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center w-80">
        <h2 className="text-xl font-semibold mb-6">本当にログアウトしますか？</h2>
        <div className="flex justify-center gap-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md"
            onClick={confirmLogout}
          >
            はい
          </button>
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded-md"
            onClick={cancelLogout}
          >
            いいえ
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;
