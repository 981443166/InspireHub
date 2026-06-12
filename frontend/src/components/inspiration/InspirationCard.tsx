import type { Inspiration } from "@/types/index";
import { Badge } from "@/components/ui/badge";
import { Image, Code, FileText, ExternalLink, Braces, Copy, Check } from "lucide-react";
import { useState, useCallback } from "react";

const typeIcon: Record<string, React.ReactNode> = {
  link: <ExternalLink className="size-3.5" />,
  image: <Image className="size-3.5" />,
  code: <Code className="size-3.5" />,
  note: <FileText className="size-3.5" />,
  html: <Braces className="size-3.5" />,
};

const typeLabel: Record<string, string> = {
  link: "链接", image: "图片", code: "代码", note: "笔记", html: "HTML",
};

const IFRAME_CSS = `html,body{width:100%;height:100%;margin:0;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center}`;

export default function InspirationCard({ insp, onClick }: { insp: Inspiration; onClick?: () => void }) {
  const [copied, setCopied] = useState(false);

  const copySource = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(insp.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [insp]);

  return (
    <div
      className="group relative cursor-pointer rounded-xl border border-surface-hover bg-surface-card transition-all hover:-translate-y-1 hover:shadow-xl hover:border-primary/40 overflow-hidden"
      onClick={onClick}
    >
      {/* HTML 实时预览 */}
      {insp.type === "html" && (
        <div className="relative w-full h-44 rounded-md border border-surface-hover overflow-hidden bg-white">
          <iframe
            srcDoc={`<style>${IFRAME_CSS}${insp.notes||""}</style>${insp.content}`}
            sandbox="allow-scripts"
            className="w-full h-full"
            title={insp.title}
          />
        </div>
      )}

      {/* 图片预览 */}
      {insp.type === "image" && (
        <div className="w-full h-44 bg-surface-hover flex items-center justify-center overflow-hidden">
          {insp.content ? <img src={insp.content} alt={insp.title} className="w-full h-full object-cover" loading="lazy" /> : <Image className="size-10 text-muted-foreground" />}
        </div>
      )}

      {/* 链接/代码/笔记占位 */}
      {insp.type !== "html" && insp.type !== "image" && (
        <div className="px-4 pt-4">
          {insp.type === "link" && insp.imageThumbnail ? (
            <img src={insp.imageThumbnail} alt={insp.title} className="w-full h-36 object-cover rounded-md mb-3" loading="lazy" />
          ) : (
            <div className="w-full h-36 rounded-md bg-surface-hover flex items-center justify-center mb-3">
              <span className="text-3xl opacity-30">{typeIcon[insp.type]}</span>
            </div>
          )}
        </div>
      )}

      {/* 底部信息 */}
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-sm text-white truncate">{insp.title}</h3>
            <span className="text-[11px] text-muted-foreground">{typeLabel[insp.type]}</span>
          </div>
          {insp.type === "html" && (
            <button onClick={copySource} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-surface-hover rounded" title="复制源码">
              {copied ? <Check className="size-3.5 text-green-400" /> : <Copy className="size-3.5 text-muted-foreground" />}
            </button>
          )}
        </div>
        {insp.type !== "html" && insp.type !== "image" && (
          <p className="text-xs text-muted-foreground line-clamp-2 font-mono">
            {insp.type === "code" ? insp.content.split("\n").slice(0, 2).join(" ") : insp.type === "link" ? insp.content : insp.content.slice(0, 80)}
          </p>
        )}
        <div className="flex flex-wrap gap-1">
          {insp.domain?.map((d) => (
            <Badge key={d} variant="secondary" className="text-[10px] h-5 px-1.5">{d === "design" ? "设计" : d === "dev" ? "开发" : d === "product" ? "产品" : d}</Badge>
          ))}
          {insp.tags?.slice(0, 3).map((t) => (
            <Badge key={t} variant="outline" className="text-[10px] h-5 px-1.5 border-surface-hover">{t}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
