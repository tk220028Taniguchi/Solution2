"use client";
import { useState } from "react";
import "./globals.css";


export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ログイン処理
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // APIリクエストを送信
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });

    // レスポンスを処理
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        console.log("Redirecting to dashboard...");
        window.location.href = "/dashboard"; // 正しいリダイレクト先
      } else {
        setError(data.message);
      }
    }
    
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh"
    }}>
      <div className="login-container">
        <h1>ログイン🔐</h1>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            name="username"
            placeholder="ユーザー名"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="パスワード"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">ログイン</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
        <p className="login-note">管理者認証が必要です</p>
      </div>
    </div>
  );
  
}
