import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ children, dark = false }: { children: string; dark?: boolean }) {
  return (
    <div className={dark ? "md md-dark" : "md"}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
