import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "코테랩",
  description: "AI 튜터와 함께하는 JavaScript 코딩테스트 연습",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <header className="bg-navy text-white">
          <nav className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
            <Link href="/" className="text-lg font-bold tracking-tight">
              코테<span className="text-accent">랩</span>
            </Link>
            <Link href="/" className="text-sm text-white/70 hover:text-white">문제</Link>
            <Link href="/generate" className="text-sm text-white/70 hover:text-white">AI 문제 만들기</Link>
            <Link href="/history" className="text-sm text-white/70 hover:text-white">풀이 기록</Link>
          </nav>
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
