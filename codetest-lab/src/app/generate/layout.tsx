import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI로 코딩테스트 문제 만들기",
  robots: { index: false, follow: true },
};

export default function Layout({ children }: LayoutProps<"/generate">) {
  return children;
}
