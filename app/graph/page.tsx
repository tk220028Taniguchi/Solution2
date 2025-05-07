// app/graph/page.tsx
// グラフページ　＊後で変更の必要有
"use client";
import React, { useState } from "react";
import Chart from "chart.js/auto";

const GraphPage = () => {
  const [status, setStatus] = useState("未判定");
  const [colorClass, setColorClass] = useState("");
  const [historyLog, setHistoryLog] = useState<{ 時刻: string; 状態: string; 合計: number }[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const lines = (event.target?.result as string).trim().split("\n");
      const labels = lines[0].split(",");
      const values = lines[1].split(",").map(Number);

      const ctx = (document.getElementById("particleChart") as HTMLCanvasElement).getContext("2d");
      new Chart(ctx!, {
        type: "bar",
        data: {
          labels,
          datasets: [{
            label: "粒子数",
            data: values,
            backgroundColor: "rgba(0,123,255,0.5)",
            borderColor: "#007bff",
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "粒子サイズ (μm)" } },
            y: { title: { display: true, text: "個数" } },
          },
        },
      });

      const total = values.reduce((a, b) => a + b, 0);
      const gearIndices = labels.map((x, i) => (parseFloat(x) >= 80 && parseFloat(x) <= 150 ? i : -1)).filter(i => i >= 0);
      const gearFlag = gearIndices.some(i => values[i] > 0);

      let result = "正常";
      let color = "green";
      if (gearFlag) {
        result = "異常（ギア粒子）";
        color = "red";
      } else if (total >= 5000) {
        result = `異常（${total}個）`;
        color = "red";
      } else if (total >= 3000) {
        result = `注意（${total}個）`;
        color = "yellow";
      } else {
        result = `正常（${total}個）`;
      }

      setStatus(result);
      setColorClass(color);
      setHistoryLog(prev => [...prev, { 時刻: new Date().toLocaleString(), 状態: result, 合計: total }]);
    };

    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (historyLog.length === 0) return;
    const csv = "時刻,状態,合計粒子数\n" + historyLog.map(h => `${h.時刻},${h.状態},${h.合計}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "判定履歴.csv";
    link.click();
  };

  // 再描画対策(Tabとか心配)
  const existingChart = Chart.getChart("particleChart");
    if (existingChart) {
        existingChart.destroy();
    }

  return (
    <div className="min-h-screen flex justify-center items-center p-8 bg-gradient-to-r from-[#eef2f3] to-[#8e9eab]">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-3xl text-center">
        <h1 className="text-2xl font-bold mb-4">粒子分布グラフ＋状態判定</h1>
        <input type="file" onChange={handleFileUpload} accept=".csv" className="mb-4" />
        <canvas id="particleChart" width={600} height={300} className="mx-auto mb-4"></canvas>
        <h2 className="text-xl">
          判定結果：<span>{status}</span>
          <div className={`inline-block ml-2 w-6 h-6 rounded-full bg-${colorClass}-500`} />
        </h2>
        <button onClick={handleDownload} className="button mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800">
          📥 判定履歴CSV保存
        </button>
      </div>
    </div>
  );
};

export default GraphPage;
