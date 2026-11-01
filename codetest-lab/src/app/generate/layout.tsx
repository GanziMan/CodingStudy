import type { Metadata } from "next";
import { isOwner } from "@/lib/owner";

export const metadata: Metadata = {
  title: "AI로 코딩테스트 문제 만들기",
  robots: { index: false, follow: false },
};

export default async function Layout({ children }: LayoutProps<"/generate">) {
  if (!(await isOwner())) {
    return (
      <main className="mx-auto w-full max-w-md px-4 py-20">
        <h1 className="text-2xl font-semibold tracking-tight">문제 만들기</h1>
        <p className="mt-3 leading-relaxed text-fg-muted">지금은 이용할 수 없는 기능이에요.</p>
      </main>
    );
  }
  return children;
}
