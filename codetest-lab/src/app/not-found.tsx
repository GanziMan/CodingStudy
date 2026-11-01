import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-20">
      <p className="font-mono text-sm text-fg-subtle">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">페이지를 찾을 수 없어요</h1>
      <p className="mt-3 leading-relaxed text-fg-muted">주소가 바뀌었거나 삭제된 문제일 수 있어요.</p>
      <Link
        href="/problems"
        className="mt-8 inline-flex h-10 w-fit items-center rounded-md bg-fg px-4 text-sm font-medium text-bg hover:opacity-85"
      >
        문제 목록으로
      </Link>
    </main>
  );
}
