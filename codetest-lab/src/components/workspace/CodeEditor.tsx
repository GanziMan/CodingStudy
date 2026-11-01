"use client";

import Editor, { loader, type BeforeMount } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../theme";

// Geist 다크 팔레트에 맞춘 에디터 테마
const defineThemes: BeforeMount = (monaco) => {
  monaco.editor.defineTheme("ctl-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6f6f6f", fontStyle: "italic" },
      { token: "keyword", foreground: "f075c8" },
      { token: "number", foreground: "62b1ff" },
      { token: "string", foreground: "62c073" },
    ],
    colors: {
      "editor.background": "#0a0a0a",
      "editor.lineHighlightBackground": "#151515",
      "editorLineNumber.foreground": "#4a4a4a",
      "editorLineNumber.activeForeground": "#a1a1a1",
      "editor.selectionBackground": "#0b2f55",
      "editorIndentGuide.background1": "#1f1f1f",
    },
  });
  monaco.editor.defineTheme("ctl-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "8f8f8f", fontStyle: "italic" },
      { token: "keyword", foreground: "cf2c9b" },
      { token: "number", foreground: "0068d6" },
      { token: "string", foreground: "107d32" },
    ],
    colors: {
      "editor.background": "#ffffff",
      "editor.lineHighlightBackground": "#f7f7f7",
      "editorLineNumber.foreground": "#c2c2c2",
      "editorLineNumber.activeForeground": "#4d4d4d",
      "editor.selectionBackground": "#d6e8ff",
      "editorIndentGuide.background1": "#f0f0f0",
    },
  });
};

export function CodeEditor({
  value,
  onChange,
  onRun,
}: {
  value: string;
  onChange: (v: string) => void;
  onRun: () => void;
}) {
  const theme = useTheme();
  // onMount는 한 번만 호출되므로 최신 onRun을 ref로 참조
  const runRef = useRef(onRun);
  useEffect(() => {
    runRef.current = onRun;
  }, [onRun]);

  // 에디터는 CDN에서 받아온다. 회사망 등에서 막히면 일반 입력창으로 대체해 문제는 풀 수 있게 한다.
  const [fallback, setFallback] = useState(false);
  useEffect(() => {
    let done = false;
    const timer = setTimeout(() => !done && setFallback(true), 12_000);
    const init = loader.init();
    init.then(
      () => {
        done = true;
        clearTimeout(timer);
      },
      () => {
        done = true;
        clearTimeout(timer);
        setFallback(true);
      },
    );
    return () => {
      done = true;
      clearTimeout(timer);
    };
  }, []);

  if (fallback) {
    return (
      <div className="flex h-full flex-col">
        <p className="border-b border-line bg-warn-soft px-4 py-2 text-[13px] text-warn">
          코드 에디터를 불러오지 못해 기본 입력창으로 보여드려요. 실행과 채점은 똑같이 할 수 있어요.
        </p>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              runRef.current();
            }
            if (e.key === "Tab") {
              e.preventDefault();
              const t = e.currentTarget;
              const { selectionStart: a, selectionEnd: b } = t;
              onChange(value.slice(0, a) + "  " + value.slice(b));
              requestAnimationFrame(() => t.setSelectionRange(a + 2, a + 2));
            }
          }}
          spellCheck={false}
          className="min-h-0 flex-1 resize-none bg-bg p-4 font-mono text-sm leading-[22px] outline-none"
        />
      </div>
    );
  }

  return (
    <Editor
      height="100%"
      language="javascript"
      theme={theme === "dark" ? "ctl-dark" : "ctl-light"}
      value={value}
      onChange={(v) => onChange(v ?? "")}
      beforeMount={defineThemes}
      loading={<div className="p-4 text-sm text-fg-subtle">에디터를 불러오는 중</div>}
      options={{
        fontSize: 14,
        fontFamily: "var(--font-geist-mono), D2Coding, Menlo, monospace",
        fontLigatures: false,
        lineHeight: 22,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        tabSize: 2,
        automaticLayout: true,
        padding: { top: 14 },
        renderLineHighlight: "line",
        overviewRulerBorder: false,
        scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
      }}
      onMount={(editor, monaco) => {
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => runRef.current());
      }}
    />
  );
}
