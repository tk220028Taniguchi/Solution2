// app/dashboard/page.tsx
"use client";
import React from "react";
import Link from "next/link";

const Dashboard = () => {
  const [showAccountMenu, setShowAccountMenu] = React.useState(false);

  const exportReport = () => {
    alert("📄 定期レポート出力（仮処理）");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ナビゲーションバー */}
      <div className="navbar fixed top-0 left-0 right-0 h-16 bg-[#003366] text-white flex items-center justify-between px-4 z-10">
        <div>
          <strong>粒子判定ダッシュボード</strong>
        </div>
        <input
          type="text"
          placeholder="検索..."
          className="p-2 text-lg rounded border-none"
        />
        <div className="relative">
          <button
            className="bg-blue-700 text-white p-2 rounded"
            onClick={() => setShowAccountMenu(!showAccountMenu)}
          >
            アカウント管理 ▾
          </button>
          {showAccountMenu && (
            <div className="absolute right-0 mt-1 bg-blue-800 text-white rounded shadow-lg z-50">
              <Link href="/account_edit" className="block px-4 py-2 hover:bg-blue-600">個人情報修正</Link>
              <Link href="/password_change" className="block px-4 py-2 hover:bg-blue-600">パスワード変更</Link>
              <Link href="/mail" className="block px-4 py-2 hover:bg-blue-600">メール機能</Link>
              <Link href="/logout" className="block px-4 py-2 hover:bg-blue-600">ログアウト</Link>
            </div>
          )}
        </div>
      </div>

      {/* サイドバー */}
      <div className="sidebar fixed top-16 left-0 w-48 h-full bg-[#e3eaf0] pt-4 shadow-md">
        <Link href="/graph" className="block p-3 text-[#003366] font-bold hover:bg-[#d4e0eb]">
          📊 グラフ表示
        </Link>
        <Link href="/device" className="block p-3 text-[#003366] font-bold hover:bg-[#d4e0eb]">
          🔧 機器情報
        </Link>
        <Link href="/account" className="block p-3 text-[#003366] font-bold hover:bg-[#d4e0eb]">
          👤 アカウント
        </Link>
        <Link href="/csv_log" className="block p-3 text-[#003366] font-bold hover:bg-[#d4e0eb]">
          📁 CSVダウンロード履歴
        </Link>
      </div>

      {/* メインコンテンツ */}
      <div className="main flex-1 pt-24 px-8 pr-8 w-full">
        <div className="notification-area bg-[#fff3cd] border-l-4 border-[#ffeeba] p-4 rounded-md mb-4 w-full">
          🆕 更新情報：2025年版UIリニューアルが完了しました。デザインと機能性が向上しました！
        </div>

        {/* KPIカード */}
        <div className="kpi-grid flex flex-wrap gap-4 mb-8">
          <div className="kpi-card flex-1 min-w-[200px] bg-white rounded-lg shadow-lg p-4 text-center text-lg">
            📈 異常判定件数：<strong>0</strong>
          </div>
          <div className="kpi-card flex-1 min-w-[200px] bg-white rounded-lg shadow-lg p-4 text-center text-lg">
            📤 CSVダウンロード数：<strong>18</strong>
          </div>
          <div className="kpi-card flex-1 min-w-[200px] bg-white rounded-lg shadow-lg p-4 text-center text-lg">
            👥 アクティブユーザー数：<strong>3</strong>
          </div>
        </div>

        {/* 摩耗スコア画像挿入 */}
        <div className="wear-graph bg-white p-4 rounded-lg shadow-lg mb-8">
          <h1 className="text-xl font-bold mt-5 mb-5">🛠 摩耗スコア推移グラフ</h1>
          <img src="/particle_score2.png" alt="摩耗スコアグラフ" className="w-full h-auto rounded mx-auto" />
        </div>

        {/* ✅ 定期レポート出力ボタン */}
        <div className="text-right mb-4">
          <button
            onClick={exportReport}
            className="bg-gray-200 text-black px-4 py-2 rounded shadow hover:bg-gray-300"
          >
            📄 定期レポート出力
          </button>
        </div>

        {/*<p>💡 将来的には、検索結果、アップロード履歴、PWAガイドなどもこのエリアに表示予定です。</p>*/}
      </div>
    </div>
  );
};

export default Dashboard;
