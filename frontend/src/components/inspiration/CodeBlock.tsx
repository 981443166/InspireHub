import { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface Props {
  code: string;
  language?: string;
  maxHeight?: string;
}

/** 将语言名映射到 Prism 支持的标识 */
function mapLanguage(lang?: string): string {
  if (!lang) return "text";
  const m: Record<string, string> = {
    js: "javascript", jsx: "jsx", ts: "typescript", tsx: "tsx",
    py: "python", rb: "ruby", go: "go", rs: "rust",
    sh: "bash", shell: "bash", zsh: "bash", yml: "yaml",
    md: "markdown", html: "markup", css: "css", sql: "sql",
    dockerfile: "docker", docker: "docker", json: "json",
    java: "java", kt: "kotlin", swift: "swift", c: "c", cpp: "cpp",
  };
  return m[lang.toLowerCase()] || lang;
}

export default function CodeBlock({ code, language, maxHeight = "50vh" }: Props) {
  const [copied, setCopied] = useState(false);
  const prismLang = mapLanguage(language);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg border border-surface-hover overflow-hidden">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-surface-hover/50 text-xs text-muted-foreground">
        <span>{language || "text"}</span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
          {copied ? <Check className="size-3.5 text-green-400" /> : <Copy className="size-3.5" />}
        </Button>
      </div>

      {/* 代码区域 */}
      <div className="overflow-auto" style={maxHeight === "none" ? undefined : { maxHeight }}>
        <Highlight theme={themes.oneDark} code={code.trimEnd()} language={prismLang}>
          {({ tokens, getLineProps, getTokenProps }) => (
            <pre className="m-0 p-4 text-sm leading-relaxed bg-surface font-mono overflow-x-auto">
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })} className="table-row">
                  {/* 行号 */}
                  <span className="table-cell text-right pr-4 select-none text-white/20 text-xs w-8">
                    {i + 1}
                  </span>
                  {/* 代码 */}
                  <span className="table-cell">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}
