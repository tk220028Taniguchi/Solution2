'use client'

import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as htmlToImage from 'html-to-image';

export default function GraphPage() {
  const [data, setData] = useState<any[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const chartRef = useRef(null);

  useEffect(() => {
    fetch('/DataA.csv') // CSVのURL（publicフォルダなどに配置）
      .then(res => res.text())
      .then(csvText => {
        const parsed = Papa.parse(csvText, { header: true });
        const rawData = parsed.data as any[];

        const xLabels = Object.keys(rawData[0]).slice(5, 101); // 5μm〜100μm（5〜101列目）
        setLabels(xLabels);

        const formattedData = xLabels.map((label, i) => {
          const point: any = { 粒子径: label };
          rawData.forEach((row: any, idx: number) => {
            point[`T${idx}`] = Number(row[label] || 0);
          });
          return point;
        });

        setData(formattedData);
      });
  }, []);

  const handleDownloadCSV = async () => {
    const response = await fetch('/DataA.csv');
    const blob = await response.blob();
  
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'graph_data.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };
  
  const handleDownloadImage = () => {
    if (chartRef.current === null) return;
    htmlToImage.toPng(chartRef.current)
      .then((dataUrl: string) => {
        const link = document.createElement('a');
        link.download = 'graph.png';
        link.href = dataUrl;
        link.click();
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">粒子径の分布グラフ（時間別）</h1>

      <div ref={chartRef} style={{ background: '#fff', padding: '10px' }}>
        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={data}>
            <XAxis dataKey="粒子径" />
            <YAxis />
            <Tooltip />
            <Legend />
            {data.length > 0 &&
              Object.keys(data[0])
                .filter(key => key !== '粒子径')
                .map((key, idx) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={`hsl(${(idx * 45) % 360}, 70%, 50%)`}
                    dot={false}
                  />
                ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 space-x-4">
        <button
          onClick={handleDownloadCSV}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          CSVをダウンロード
        </button>
        <button
          onClick={handleDownloadImage}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          グラフを画像でダウンロード
        </button>
      </div>
    </div>
  );
}
