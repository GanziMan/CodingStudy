import Link from "next/link";

// 없는 주소는 홈으로 보낸다 (JS 없이도 바로 이동하도록 meta refresh 사용)
export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-20">
      <meta httpEquiv="refresh" content="0;url=/" />
      <p className="text-fg-muted">
        없는 주소예요. 홈으로 이동합니다.{" "}
        <Link href="/" className="text-fg underline underline-offset-4">
          바로 가기
        </Link>
      </p>
    </main>
  );
}
