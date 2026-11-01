"use client";

import Editor, { type BeforeMount } from "@monaco-editor/react";
import { useEffect, useRef } from "react";
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
