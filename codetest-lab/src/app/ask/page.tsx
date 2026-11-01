import type { Metadata } from "next";
import { AskChat } from "@/components/ask/AskChat";
import { AskLogin } from "@/components/ask/AskLogin";
import { getMessages, listConversations } from "@/lib/ask";
import { isOwner, ownerConfigured } from "@/lib/owner";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "질문하기",
  robots: { index: false, follow: false },
};

export default async function AskPage({ searchParams }: PageProps<"/ask">) {
  if (!ownerConfigured()) {
    return (
      <main className="mx-auto w-full max-w-md px-4 py-20">
        <h1 className="text-2xl font-semibold tracking-tight">질문하기</h1>
        <p className="mt-3 leading-relaxed text-fg-muted">
          아직 잠금 비밀번호가 없어요. Vercel 환경변수에 <code className="font-mono">OWNER_PASSWORD</code>를 넣고
          다시 배포하면 열려요.
        </p>
      </main>
    );
  }
  if (!(await isOwner())) return <AskLogin />;

  const sp = await searchParams;
  const conversations = await listConversations();
  const selected = Number(sp.c);
  const current = conversations.find((c) => c.id === selected) ?? null;
  const initialMessages = current ? await getMessages(current.id) : [];

  return (
    <AskChat
      key={current?.id ?? "new"}
      conversations={conversations.map((c) => ({ id: c.id, title: c.title, updatedAt: c.updatedAt.toISOString() }))}
      currentId={current?.id ?? null}
      initialMessages={initialMessages}
    />
  );
}
