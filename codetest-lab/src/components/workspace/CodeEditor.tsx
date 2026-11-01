"use client";

import Editor from "@monaco-editor/react";
import { useEffect, useRef } from "react";

export function CodeEditor({
  value,
  onChange,
  onRun,
}: {
  value: string;
  onChange: (v: string) => void;
  onRun: () => void;
}) {
  // onMount는 한 번만 호출되므로 최신 onRun을 ref로 참조
  const runRef = useRef(onRun);
  useEffect(() => {
    runRef.current = onRun;
  }, [onRun]);

  return (
    <Editor
      height="100%"
      language="javascript"
      theme="vs-dark"
      value={value}
      onChange={(v) => onChange(v ?? "")}
      loading={<div className="p-4 text-sm text-white/50">에디터 불러오는 중…</div>}
      options={{
        fontSize: 14,
        fontFamily: "'JetBrains Mono', D2Coding, Menlo, monospace",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        tabSize: 2,
        automaticLayout: true,
        padding: { top: 12 },
      }}
      onMount={(editor, monaco) => {
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => runRef.current());
      }}
    />
  );
}
