"use client"; // クライアントサイドコンポーネントとして扱う

import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from "next-auth/react"; // 必要なインポート

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <html lang="ja">
        <head>
          <link rel="stylesheet" href="/style.css" /> 
        </head>
        <body className={inter.className}> 
          {children} 
        </body>
      </html>
    </SessionProvider>
  );
}
