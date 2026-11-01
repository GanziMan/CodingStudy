import Link from "next/link";
import { authEnabled, getSession, signOut } from "@/auth";

export async function AuthButton() {
  if (!authEnabled) return null;
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex h-8 items-center rounded-md border border-line-strong px-3 text-[13px] font-medium hover:bg-surface-hover"
      >
        로그인
      </Link>
    );
  }

  const name = user.name ?? "내 계정";
  return (
    <div className="flex items-center gap-2">
      {user.image ? (
        // 카카오·구글 프로필 이미지 (외부 도메인이라 next/image 대신 img 사용)
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.image} alt="" width={26} height={26} className="h-[26px] w-[26px] rounded-full border border-line" />
      ) : (
        <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-surface-hover text-[12px] font-medium">
          {name.slice(0, 1)}
        </span>
      )}
      <span className="hidden max-w-[8rem] truncate text-[13px] sm:inline">{name}</span>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button className="text-[13px] text-fg-subtle hover:text-fg">로그아웃</button>
      </form>
    </div>
  );
}
