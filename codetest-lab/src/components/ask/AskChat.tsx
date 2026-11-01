"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Markdown } from "../Markdown";

type Conv = { id: number; title: string; updatedAt: string };
type Msg = { id: number | string; role: "user" | "assistant"; content: string };

const STARTERS = [
  "DP에서 탑다운이랑 바텀업 차이를 예시로 다시 설명해줘",
  "계단 오르기 변형 문제 하나 만들어줘. 아직 정답은 주지 마",
  "이 코드 어디가 틀렸는지 봐줘",
  "프로그래머스 Lv.2에 자주 나오는 유형 정리해줘",
];

export function AskChat({
  conversations,
  currentId,
  initialMessages,
}: {
  conversations: Conv[];
  currentId: number | null;
  initialMessages: Msg[];
}) {
  const router = useRouter();
  const [msgs, setMsgs] = useState<Msg[]>(initialMessages);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [convId, setConvId] = useState<number | null>(currentId);
  const [showList, setShowList] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [msgs]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    setInput("");
    setBusy(true);
    const tempId = `a-${Date.now()}`;
    setMsgs((m) => [...m, { id: `u-${Date.now()}`, role: "user", content: q }, { id: tempId, role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/ask/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: convId, message: q }),
      });
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? `요청 실패 (${res.status})`);
      }
      const newId = Number(res.headers.get("X-Conversation-Id"));
      if (!convId && newId) {
        setConvId(newId);
        window.history.replaceState(null, "", `/ask?c=${newId}`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setMsgs((m) => m.map((x) => (x.id === tempId ? { ...x, content: full } : x)));
      }
      router.refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setMsgs((m) => m.map((x) => (x.id === tempId ? { ...x, content: `> ${msg}` } : x)));
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  };

  const remove = async (id: number) => {
    if (!confirm("이 대화를 삭제할까요?")) return;
    await fetch(`/api/ask/conversations/${id}`, { method: "DELETE" });
    if (id === convId) router.push("/ask");
    router.refresh();
  };

  const logout = async () => {
    await fetch("/api/ask/logout", { method: "POST" });
    router.refresh();
  };

  return (
    <div className="flex lg:h-[calc(100dvh-3.5rem)]">
      <aside
        className={`${showList ? "fixed inset-x-0 bottom-0 top-14 z-20 flex" : "hidden"} w-full flex-col border-r border-line bg-bg-subtle lg:static lg:flex lg:w-72`}
      >
        <div className="flex items-center gap-2 border-b border-line p-3">
          <Link
            href="/ask"
            onClick={() => setShowList(false)}
            className="flex h-9 flex-1 items-center justify-center rounded-md border border-line-strong bg-surface text-sm font-medium hover:bg-surface-hover"
          >
            새 대화
          </Link>
          <button onClick={() => setShowList(false)} className="h-9 px-2 text-sm text-fg-subtle lg:hidden">
            닫기
          </button>
        </div>
        <nav aria-label="대화 목록" className="min-h-0 flex-1 overflow-y-auto p-2">
          {conversations.length === 0 && <p className="px-2 py-3 text-[13px] text-fg-subtle">아직 대화가 없어요.</p>}
          <ul className="space-y-0.5">
            {conversations.map((c) => (
              <li key={c.id} className="group flex items-center">
                <Link
                  href={`/ask?c=${c.id}`}
                  onClick={() => setShowList(false)}
                  aria-current={c.id === convId ? "page" : undefined}
                  className={`min-w-0 flex-1 truncate rounded-md px-2.5 py-2 text-[13px] ${
                    c.id === convId ? "bg-surface-hover text-fg" : "text-fg-muted hover:bg-surface-hover hover:text-fg"
                  }`}
                >
                  {c.title}
                </Link>
                <button
                  onClick={() => remove(c.id)}
                  aria-label={`${c.title} 대화 삭제`}
                  className="ml-1 shrink-0 rounded px-1.5 py-1 text-[12px] text-fg-faint opacity-0 hover:text-bad focus:opacity-100 group-hover:opacity-100"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-line p-3">
          <button onClick={logout} className="text-[13px] text-fg-subtle hover:text-fg">
            이 기기에서 잠그기
          </button>
        </div>
      </aside>

      <section className="flex min-h-[calc(100dvh-3.5rem)] min-w-0 flex-1 flex-col lg:min-h-0">
        <div className="flex h-11 shrink-0 items-center gap-3 border-b border-line px-4 lg:hidden">
          <button onClick={() => setShowList(true)} className="text-sm text-fg-muted">
            대화 목록
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl px-4 py-8">
            {msgs.length === 0 ? (
              <div className="pt-[8vh]">
                <h1 className="text-2xl font-semibold tracking-tight">무엇이든 물어보세요</h1>
                <p className="mt-2 text-fg-muted">개념이 헷갈릴 때, 코드가 안 풀릴 때, 연습 문제가 필요할 때.</p>
                <ul className="mt-8 grid gap-2 sm:grid-cols-2">
                  {STARTERS.map((s) => (
                    <li key={s}>
                      <button
                        onClick={() => send(s)}
                        className="h-full w-full rounded-lg border border-line px-4 py-3 text-left text-sm text-fg-muted hover:bg-surface-hover hover:text-fg"
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <ol className="space-y-8">
                {msgs.map((m) =>
                  m.role === "user" ? (
                    <li key={m.id} className="flex justify-end">
                      <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl bg-surface-hover px-4 py-2.5 text-[15px] leading-relaxed">
                        {m.content}
                      </div>
                    </li>
                  ) : (
                    <li key={m.id}>
                      {m.content ? (
                        <Markdown>{m.content}</Markdown>
                      ) : (
                        <p className="text-sm text-fg-subtle">답변을 쓰는 중</p>
                      )}
                    </li>
                  ),
                )}
              </ol>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        <div className="shrink-0 border-t border-line bg-bg">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="mx-auto flex w-full max-w-3xl items-end gap-2 px-4 py-3"
          >
            <label className="min-w-0 flex-1">
              <span className="sr-only">질문</span>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  // 한글 조합 중 Enter는 무시해야 마지막 글자가 두 번 들어가지 않는다
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={Math.min(8, Math.max(1, input.split("\n").length))}
                placeholder="질문을 입력하세요. Shift+Enter로 줄바꿈"
                className="block max-h-56 w-full resize-none rounded-lg border border-line bg-surface px-3.5 py-2.5 text-[15px] leading-relaxed outline-none placeholder:text-fg-faint focus:border-line-strong"
              />
            </label>
            <button
              disabled={busy || !input.trim()}
              className="h-[46px] shrink-0 rounded-lg bg-fg px-4 text-sm font-medium text-bg hover:opacity-85 disabled:opacity-40"
            >
              {busy ? "답변 중" : "보내기"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
