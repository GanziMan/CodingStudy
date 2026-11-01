import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SiteNav } from "@/components/SiteNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { THEME_SCRIPT } from "@/components/theme-script";
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${GeistSans.variable} ${GeistMono.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-fg focus:px-3 focus:py-2 focus:text-bg"
        >
          본문으로 건너뛰기
        </a>
        <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur supports-[backdrop-filter]:bg-bg/75">
          <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
            <Link href="/" aria-label="코테랩 홈" className="shrink-0 text-fg">
              <Logo />
            </Link>
            <SiteNav />
            <div className="ml-auto shrink-0">
              <ThemeToggle />
            </div>
          </div>
        </header>
        <div id="main" className="flex flex-1 flex-col">
          {children}
        </div>
        <footer className="border-t border-line">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-8 text-sm text-fg-subtle sm:px-6">
            <span className="text-fg">
              <Logo />
            </span>
            <span>무료 자바스크립트 코딩테스트 연습</span>
            <span className="flex gap-5 sm:ml-auto">
              <Link href="/problems" className="hover:text-fg">
                문제
              </Link>
              <Link href="/guide" className="hover:text-fg">
                이용 가이드
              </Link>
              <a href="https://github.com/GanziMan/codingstudy" className="hover:text-fg">
                GitHub
              </a>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
