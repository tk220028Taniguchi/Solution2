'use client';
import React, { useEffect, useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import html2canvas from 'html2canvas';
import Link from 'next/link';

type Data = {
  diameter: string;
  average: number;
};

const ParticleGraphPage: React.FC = () => {
  const [data, setData] = useState<Data[]>([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/particle_data.csv');
      const text = await response.text();
      const rows = text.trim().split('\n');
      const headers = rows[0].split(',').slice(1);

      const counts: { [key: string]: number[] } = {};
      headers.forEach((h) => (counts[h] = []));

      rows.slice(1).forEach((row) => {
        const values = row.split(',').slice(1);
        values.forEach((val, i) => {
          const key = headers[i];
          counts[key].push(parseInt(val, 10));
        });
      });

      const averaged: Data[] = headers.map((key) => {
        const sum = counts[key].reduce((a, b) => a + b, 0);
        const avg = sum / counts[key].length;
        // `?m`を`μm`に置き換える
        const correctedKey = key.replace('?', 'μ');
        return { diameter: correctedKey, average: parseFloat(avg.toFixed(2)) };
      }).filter((entry) => {
        const num = parseInt(entry.diameter, 10);
        return num >= 5 && num <= 100;
      });

      setData(averaged);
    };

    fetchData();
  }, []);

  const isNormal = () => {
    return !data.some((entry) => parseInt(entry.diameter) >= 80 && entry.average > 0);
  };

  const downloadCSV = () => {
    const header = 'diameter,average\n';
    const rows = data.map((d) => `${d.diameter},${d.average}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'averaged_particle_data.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const downloadGraph = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = 'particle_chart.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  return (
    <div className="min-h-screen bg-[#eaecef] py-10 px-4 flex justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-5xl w-full">
        {/* タイトル */}
        <h2 className="text-3xl font-bold text-center mb-10">粒子分布グラフ＋状態判定</h2>

        {/* グラフ */}
        <div ref={chartRef} className="w-full h-96">
          <ResponsiveContainer width="95%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="diameter" 
                label={{ value: '粒子径 (μm)', position: 'insideBottom', offset: -5 }}
                tickFormatter={(value) => `${value}`} 
              />
              <YAxis label={{ value: '平均個数', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value: any) => `${value} 個`} labelFormatter={(label) => `${label}`} />
              <Bar dataKey="average" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 判定結果 */}
        <div className="text-center mt-10 mb-4">
          <div className="text-2xl font-bold inline-block">
            判定結果：{" "}
            <span className={isNormal() ? 'text-green-600' : 'text-red-600'}>
              {isNormal() ? '正常' : '異常'}
            </span>
          </div>
          <span
            className="inline-block ml-3 align-middle"
            style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              backgroundColor: isNormal() ? 'green' : 'red',
              display: 'inline-block',
            }}
          />
        </div>

        {/* ダウンロードボタン */}
        <div className="flex justify-center gap-6 mt-10 mb-12">
          <button
            onClick={downloadCSV}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded"
          >
            CSVをダウンロード
          </button>
          <button
            onClick={downloadGraph}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded"
          >
            グラフをダウンロード
          </button>
        </div>

        {/* ダッシュボードへ戻る */}
        <div className="text-center mt-16 mb-6">
          <Link
            href="/dashboard"
            className="inline-block bg-[#003366] text-white px-6 py-3 rounded hover:bg-[#005599]"
          >
            ← ダッシュボードへ戻る
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ParticleGraphPage;
