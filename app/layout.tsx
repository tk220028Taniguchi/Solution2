// app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; // ← クライアント側で分離したProvider

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Your App",
  description: "Your description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers> {/* ✅ SessionProviderはここ */}
      </body>
    </html>
  );
}
