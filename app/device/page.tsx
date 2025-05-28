//機器情報ページ

"use client";
import React from "react";
import Link from "next/link";

const DevicePage = () => {
  return (
    <div className="min-h-screen bg-[#f5f7fa] py-12 px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-[#003366] mb-6">🔧 機器情報</h1>
        <table className="table-auto border-collapse border border-gray-300 w-full text-left">
          <tbody>
            <tr>
              <th className="border border-gray-300 px-4 py-2 bg-gray-100">装置名</th>
              <td className="border border-gray-300 px-4 py-2">PI-1000</td>
            </tr>
            <tr>
              <th className="border border-gray-300 px-4 py-2 bg-gray-100">設置場所</th>
              <td className="border border-gray-300 px-4 py-2">風力発電設備 A3</td>
            </tr>
            <tr>
              <th className="border border-gray-300 px-4 py-2 bg-gray-100">測定日時</th>
              <td className="border border-gray-300 px-4 py-2">2024/10/31 20:57:56</td>
            </tr>
            <tr>
              <th className="border border-gray-300 px-4 py-2 bg-gray-100">流量</th>
              <td className="border border-gray-300 px-4 py-2">18.08 mL/min</td>
            </tr>
            <tr>
              <th className="border border-gray-300 px-4 py-2 bg-gray-100">測定時間</th>
              <td className="border border-gray-300 px-4 py-2">124 s</td>
            </tr>
          </tbody>
        </table>
        <div className="mt-6 text-right">
          <Link
            href="/dashboard"
            className="inline-block bg-[#003366] text-white px-4 py-1 rounded hover:bg-[#005599]"
          >
            戻る
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DevicePage;
