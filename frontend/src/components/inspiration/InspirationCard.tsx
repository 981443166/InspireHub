import type { Inspiration } from "@/types/index";
import { Image, Code, FileText, ExternalLink, Braces, Copy, Check, PaintBucket } from "lucide-react";
import { useState, useCallback } from "react";

const typeIcon: Record<string, React.ReactNode> = {
  link: <ExternalLink className="size-4" />,
  image: <Image className="size-4" />,
  code: <Code className="size-4" />,
  note: <FileText className="size-4" />,
  html: <Braces className="size-4" />,
  css: <PaintBucket className="size-4" />,
};

const typeLabel: Record<string, string> = {
  link: "链接", image: "图片", code: "代码", note: "笔记", html: "HTML", css: "CSS",
};

const typeColor: Record<string, string> = {
  link: "#8FB4FF", image: "#86EFAC", code: "#FBBF77", note: "#C4A4F7", html: "#FFA4B6", css: "#7DD3FC",
};

const IFRAME_CSS = `html,body{width:100%;height:100%;margin:0;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center}`;

function Placeholder({ insp }: { insp: Inspiration }) {
  return (
    <div className="w-full h-24 flex items-center justify-center bg-gradient-to-br from-surface-hover/60 to-surface-hover/20">
      <span style={{ color: typeColor[insp.type] }} className="opacity-30">{typeIcon[insp.type]}</span>
    </div>
  );
}

export default function InspirationCard({ insp, onClick }: { insp: Inspiration; onClick?: () => void }) {
  const [copied, setCopied] = useState(false);

  const copySource = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(insp.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [insp]);

  const hasPreview = insp.type === "html";

  return (
    <div
      className="group relative cursor-pointer rounded-2xl border border-border/30 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/5 hover:border-primary/20 overflow-hidden"
      onClick={onClick}
    >
      {/* 类型色条 */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, ${typeColor[insp.type] || "#8FB4FF"}, transparent)` }}
      />

      {/* HTML 预览 */}
      {hasPreview && (
        <div className="w-full h-32 overflow-hidden bg-white border-b border-border/20">
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
        <div className="w-full h-32 overflow-hidden">
          {insp.content ? (
            <img src={insp.content} alt={insp.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
          ) : <Placeholder insp={insp} />}
        </div>
      )}

      {/* 链接缩略图 */}
      {insp.type === "link" && insp.imageThumbnail && (
        <div className="w-full h-32 overflow-hidden">
          <img src={insp.imageThumbnail} alt={insp.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        </div>
      )}

      {/* 其他类型占位 */}
      {!hasPreview && insp.type !== "image" && !(insp.type === "link" && insp.imageThumbnail) && (
        <Placeholder insp={insp} />
      )}

      {/* 底部信息 */}
      <div className="p-2.5 space-y-1.5">
        <div className="flex items-start justify-between gap-1">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-xs text-foreground truncate leading-snug">{insp.title}</h3>
          </div>
          {hasPreview && (
            <button onClick={copySource} className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 hover:bg-surface-hover rounded-md shrink-0" title="复制源码">
              {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3 text-muted-foreground/50" />}
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground/50">
            <span className="size-1.5 rounded-full shrink-0" style={{ backgroundColor: typeColor[insp.type] }} />
            {typeLabel[insp.type]}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {insp.domain?.slice(0, 2).map((d) => (
            <span key={d} className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-surface-hover/60 text-muted-foreground">
              {d === "design" ? "设计" : d === "dev" ? "开发" : d === "product" ? "产品" : d}
            </span>
          ))}
          {insp.tags?.slice(0, 2).map((t) => (
            <span key={t} className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] text-muted-foreground/40 bg-surface-hover/30">
              {t}
            </span>
          ))}
          {(insp.tags?.length || 0) > 2 && (
            <span className="text-[9px] text-muted-foreground/30">+{insp.tags!.length - 2}</span>
          )}
        </div>
      </div>
    </div>
  );
}
