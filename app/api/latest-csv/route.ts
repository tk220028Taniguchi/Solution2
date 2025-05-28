// app/api/latest-csv/route.ts
export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const dirPath = path.join(process.cwd(), 'public');
  const files = fs.readdirSync(dirPath).filter(f => /^DT_\d{10}\.csv$/.test(f));

  if (files.length === 0) {
    return NextResponse.json({ filename: null });
  }

  const latest = files.sort().reverse()[0]; // 日付＋時刻でソート
  return NextResponse.json({ filename: latest });
}
