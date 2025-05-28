"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';
import html2canvas from 'html2canvas';
import Link from 'next/link';

type Data = { diameter: string; average: number };

const INITIAL_MIN = 80;
const INITIAL_MAX = 100;

const ParticleGraphPage: React.FC = () => {
  const { data: session } = useSession();
  const role = session?.user?.role;

  const [data, setData] = useState<Data[]>([]);
  const [minThreshold, setMinThreshold] = useState<number>(INITIAL_MIN);
  const [maxThreshold, setMaxThreshold] = useState<number>(INITIAL_MAX);
  const [editTarget, setEditTarget] = useState<'min' | 'max' | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [notified, setNotified] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const metaRes = await fetch('/api/latest-csv');
      const metaJson = await metaRes.json();
      if (!metaJson.filename) return;
      setFileName(metaJson.filename);

      const res = await fetch(`/${metaJson.filename}`);
      const text = await res.text();
      const rows = text.trim().split('\n');
      const headers = rows[0].split(',').slice(1);

      const counts: Record<string, number[]> = {};
      headers.forEach((h) => (counts[h] = []));

      rows.slice(1).forEach((row) => {
        row.split(',').slice(1).forEach((v, i) => {
          counts[headers[i]].push(parseInt(v, 10));
        });
      });

      const averaged = headers
        .map((key) => {
          const arr = counts[key];
          const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
          return { diameter: key.replace('?', 'μ'), average: parseFloat(avg.toFixed(2)) };
        })
        .filter((e) => {
          const n = parseInt(e.diameter, 10);
          return n >= 5 && n <= 150;
        });

      setData(averaged);
    })();
  }, []);

  // 異常時に一度だけメール通知
  useEffect(() => {
    if (!isNormal() && !notified) {
      fetch("/api/notify/alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: "【異常通知】粒子判定で異常が検出されました",
          message: `ファイル「${fileName}」で異常が検出されました。至急確認してください。`,
        }),
      })
        .then(() => {
          console.log("📧 異常通知メール送信完了");
          setNotified(true);
        })
        .catch((err) => {
          console.error("❌ メール送信エラー:", err);
        });
    }
  }, [data]);

  const isNormal = () =>
    !data.some((e) => {
      const d = parseInt(e.diameter, 10);
      return d >= minThreshold && d <= maxThreshold && e.average > 0;
    });

  const downloadCSV = () => {
    const header = 'diameter,average\n';
    const rows = data.map((d) => `${d.diameter},${d.average}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'averaged_particle_data.csv';
    a.click();
  };

  const downloadGraph = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'particle_chart.png';
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#eaecef] py-10 px-4 flex justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-6xl w-full">
        <div className="text-sm text-gray-700 mb-4">
          {role === "editor" ? (
            <p className="text-green-600">✅ あなたは編集者です（しきい値の編集が可能）</p>
          ) : (
            <p className="text-gray-500">👤 一般ユーザーとして閲覧中です（しきい値の変更不可）</p>
          )}
        </div>

        <h2 className="text-3xl font-bold text-center mb-10">
          粒子分布グラフ＋状態判定
        </h2>

        <div className="flex flex-col lg:flex-row gap-8">
          <div ref={chartRef} className="w-full lg:w-3/4 h-96">
            <ResponsiveContainer width="95%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="diameter" label={{ value: '粒子径 (μm)', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: '平均個数', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(v: any) => `${v} 個`} />
                <Bar dataKey="average" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="text-left text-sm text-gray-500 mt-2">
              表示中のデータファイル: {fileName || '読み込み中...'}
            </div>
          </div>

          <div className="w-full lg:w-1/4 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">しきい値設定（μm）</h3>
            <div className="mb-2 flex items-center">
              <span className="w-16">最小:</span>
              {role === 'editor' && editTarget === 'min' ? (
                <div className="flex items-center gap-2">
                  <input type="number" value={minThreshold} onChange={(e) => setMinThreshold(Number(e.target.value))} className="border px-2 py-1 rounded w-24" />
                  <button className="text-green-600 font-bold" onClick={() => setEditTarget(null)}>✓</button>
                  <button className="text-red-600 font-bold" onClick={() => { setMinThreshold(INITIAL_MIN); setEditTarget(null); }}>×</button>
                </div>
              ) : (
                <>
                  <span>{minThreshold} μm</span>
                  {role === 'editor' && (
                    <button className="ml-2 text-blue-600" onClick={() => setEditTarget('min')}>✏️</button>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center">
              <span className="w-16">最大:</span>
              {role === 'editor' && editTarget === 'max' ? (
                <div className="flex items-center gap-2">
                  <input type="number" value={maxThreshold} onChange={(e) => setMaxThreshold(Number(e.target.value))} className="border px-2 py-1 rounded w-24" />
                  <button className="text-green-600 font-bold" onClick={() => setEditTarget(null)}>✓</button>
                  <button className="text-red-600 font-bold" onClick={() => { setMaxThreshold(INITIAL_MAX); setEditTarget(null); }}>×</button>
                </div>
              ) : (
                <>
                  <span>{maxThreshold} μm</span>
                  {role === 'editor' && (
                    <button className="ml-2 text-blue-600" onClick={() => setEditTarget('max')}>✏️</button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-10 mb-6">
          <span className="text-2xl font-bold">
            判定結果：
            <span className={isNormal() ? 'text-green-600' : 'text-red-600'}>
              {isNormal() ? '正常' : '異常'}
            </span>
          </span>
          <span className="inline-block ml-3 align-middle" style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: isNormal() ? 'green' : 'red' }} />
        </div>

        <div className="flex justify-center gap-6 mt-8 mb-12">
          <button onClick={downloadCSV} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded">CSVをダウンロード</button>
          <button onClick={downloadGraph} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded">グラフをダウンロード</button>
        </div>

        <div className="text-center">
          <Link href="/dashboard" className="inline-block bg-[#003366] text-white px-6 py-1 rounded hover:bg-[#005599]">戻る</Link>
        </div>
      </div>
    </div>
  );
};

export default ParticleGraphPage;
