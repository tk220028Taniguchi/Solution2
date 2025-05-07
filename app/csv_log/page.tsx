// app/csv_log/page.tsx

"use client";
import React from "react";
import Link from "next/link";

const CsvDownloadPage = () => {
  return (
    <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center">
      {/* メインコンテンツ */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#003366] mb-8">
          CSVダウンロード履歴
        </h1>
        <table className="csv-table mx-auto w-full max-w-[900px] border-collapse bg-white shadow-md">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-center bg-[#007bff] text-white">
                アップロード日時
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center bg-[#007bff] text-white">
                ファイル名
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center bg-[#007bff] text-white">
                判定結果
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-center">2025-04-25 09:30</td>
              <td className="border border-gray-300 px-4 py-2 text-center">data_0425.csv</td>
              <td className="border border-gray-300 px-4 py-2 text-center">異常（5120個）</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-center">2025-04-24 18:10</td>
              <td className="border border-gray-300 px-4 py-2 text-center">normal_0424.csv</td>
              <td className="border border-gray-300 px-4 py-2 text-center">正常（1820個）</td>
            </tr>
          </tbody>
        </table>

        {/* ダッシュボードに戻るリンク */}
        <div className="mt-6">
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

export default CsvDownloadPage;
