// app/dashboard/page.tsx
// 実質のメインページ
"use client";
import React from "react";
import Link from "next/link";

// ダッシュボードコンポーネント
const Dashboard = () => {
  const targetValue = 7200;
  const threshold = 8000;
  const [current, setCurrent] = React.useState(0);
  const [gaugeWidth, setGaugeWidth] = React.useState(0);
  const [wearLevelText, setWearLevelText] = React.useState("判定中...");

  React.useEffect(() => {
    const step = Math.ceil(targetValue / 100);
    const interval = setInterval(() => {
      if (current < targetValue) {
        setCurrent((prev) => Math.min(prev + step, targetValue));
      } else {
        clearInterval(interval);
      }
    }, 20);

    setTimeout(() => {
      const percentage = Math.min((targetValue / threshold) * 100, 100);
      setGaugeWidth(percentage);

      if (percentage >= 100) {
        setWearLevelText("要交換");
      } else if (percentage >= 90) {
        setWearLevelText("交換目安時期");
      } else if (percentage >= 75) {
        setWearLevelText("注意");
      } else {
        setWearLevelText("正常");
      }
    }, 300);
  }, [current]);

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
        <button
          className="lang-toggle bg-blue-500 text-white p-2 rounded"
          onClick={() => alert("🌐 言語切り替え機能は現在準備中です。")}
        >
          🌐 言語
        </button>
      </div>

      {/* サイドバー */}
      <div className="sidebar fixed top-16 left-0 w-48 h-full bg-[#e3eaf0] pt-4 shadow-md">
        <Link
          href="/graph"
          className="block p-3 text-[#003366] font-bold hover:bg-[#d4e0eb]"
        >
          📊 グラフ表示
        </Link>
        <Link
          href="/device"
          className="block p-3 text-[#003366] font-bold hover:bg-[#d4e0eb]"
        >
          🔧 機器情報
        </Link>
        <Link
          href="/account"
          className="block p-3 text-[#003366] font-bold hover:bg-[#d4e0eb]"
        >
          👤 アカウント
        </Link>
        <Link
          href="/csv_log"
          className="block p-3 text-[#003366] font-bold hover:bg-[#d4e0eb]"
        >
          📁 CSVダウンロード履歴
        </Link>
      </div>

      {/* メインコンテンツ */}
      <div className="main flex-1 pt-24 px-8 pr-8 w-full">
        {/* 更新情報 */}
        <div className="notification-area bg-[#fff3cd] border-l-4 border-[#ffeeba] p-4 rounded-md mb-4 w-full">
          🆕 更新情報：2025年版UIリニューアルが完了しました。デザインと機能性が向上しました！
        </div>

        {/* KPIカード */}
        <div className="kpi-grid flex flex-wrap gap-4 mb-8">
          <div className="kpi-card flex-1 min-w-[200px] bg-white rounded-lg shadow-lg p-4 text-center text-lg">
            📈 異常判定件数：<strong>5</strong>
          </div>
          <div className="kpi-card flex-1 min-w-[200px] bg-white rounded-lg shadow-lg p-4 text-center text-lg">
            📤 CSVダウンロード数：<strong>18</strong>
          </div>
          <div className="kpi-card flex-1 min-w-[200px] bg-white rounded-lg shadow-lg p-4 text-center text-lg">
            👥 アクティブユーザー数：<strong>3</strong>
          </div>
        </div>

        {/* 摩耗状態カード */}
        <div className="wear-level bg-white p-4 rounded-lg shadow-lg mb-8">
          <h1 className="text-xl font-bold mt-5 mb-5">
            🛠 摩耗状態：<span id="wear-level-text">{wearLevelText}</span>
          </h1>
          <p>
            現在の摩耗粒子数は <strong>{current.toLocaleString()}</strong> 個です。交換タイミングの目安は{" "}
            <strong>8,000</strong> 個です。
          </p>
          <div className="gauge bg-[#eee] rounded-full overflow-hidden mt-2">
            <div
              className="gauge-bar bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
              style={{ width: `${gaugeWidth}%`, height: "30px" }}
            />
          </div>
        </div>

        {/* タイムライン */}
        <div className="wear-level bg-white p-4 rounded-lg shadow-lg mb-8">
          <h1 className="text-xl font-bold mt-5 mb-5">📅 摩耗履歴タイムライン</h1>
          <div className="timeline border-l-4 border-[#003366] pl-4">
            <div className="timeline-entry mb-4">
              <time>2025/05/01</time>
              粒子数：6,500 → 異常なし
            </div>
            <div className="timeline-entry mb-4">
              <time>2025/05/03</time>
              粒子数：7,200 → 注意（交換目安時期）
            </div>
            <div className="timeline-entry mb-4">
              <time>2025/05/06</time>
              粒子数：7,900 → 要交換推奨
            </div>
          </div>
        </div>

        <p>💡 将来的には、検索結果、アップロード履歴、PWAガイドなどもこのエリアに表示予定です。</p>
      </div>
    </div>
  );
};

export default Dashboard;
