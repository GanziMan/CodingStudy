import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s | ${SITE.name}` },
  description: SITE.description,
  keywords: SITE.keywords,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: "/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NAVER_SITE_VERIFICATION
      ? { "naver-site-verification": process.env.NAVER_SITE_VERIFICATION }
      : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: "#0c151c",
  width: "device-width",
  initialScale: 1,
};

const NAV = [
  { href: "/problems", label: "문제" },
  { href: "/guide", label: "이용 가이드" },
  { href: "/generate", label: "AI 문제 만들기" },
  { href: "/history", label: "내 기록" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <header className="bg-navy text-white">
          <nav aria-label="주요 메뉴" className="mx-auto flex h-14 max-w-6xl items-center gap-5 overflow-x-auto px-4">
            <Link href="/" className="shrink-0 text-lg font-bold tracking-tight">
              코테<span className="text-accent">랩</span>
            </Link>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="shrink-0 text-sm text-white/70 hover:text-white">
                {n.label}
              </Link>
            ))}
          </nav>
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
        <footer className="border-t border-line bg-surface text-sm text-muted">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-6">
            <span className="font-semibold text-ink">코테랩</span>
            <span>AI 튜터와 함께하는 무료 자바스크립트 코딩테스트 연습</span>
            <span className="flex gap-4 sm:ml-auto">
              {NAV.slice(0, 2).map((n) => (
                <Link key={n.href} href={n.href} className="hover:text-ink">
                  {n.label}
                </Link>
              ))}
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
