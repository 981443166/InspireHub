import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Inspiration } from "@/types/index";
import { useDeleteInspiration } from "@/hooks/useInspirations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Pencil, Trash2, Copy, Check, ExternalLink, ChevronLeft, ChevronRight, X } from "lucide-react";
import CodeBlock from "@/components/inspiration/CodeBlock";
import ReactMarkdown from "react-markdown";

interface Props { index: number; items: Inspiration[]; onClose: () => void; onIndexChange: (i: number) => void; }

const IFRAME_CSS = `html,body{width:100%;height:100%;margin:0;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center}`;

function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 2000); };
  return <button onClick={copy} className="hover:text-white">{ok ? <Check className="size-3 text-green-400" /> : <Copy className="size-3" />}</button>;
}

export default function QuickPreview({ index, items, onClose, onIndexChange }: Props) {
  const [showDelete, setShowDelete] = useState(false);
  const [sourceTab, setSourceTab] = useState<"html" | "css">("html");
  const navigate = useNavigate();
  const insp = items[index]!;
  const isFirst = index === 0;
  const isLast = index === items.length - 1;
  const isHtml = insp.type === "html";

  const goPrev = () => { if (!isFirst) onIndexChange(index - 1); };
  const goNext = () => { if (!isLast) onIndexChange(index + 1); };

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowLeft") goPrev(); if (e.key === "ArrowRight") goNext(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [index]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white z-10"><X className="size-6" /></button>
      {!isFirst && <button onClick={(e) => { e.stopPropagation(); goPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white z-10 p-2 hover:bg-white/10 rounded-full"><ChevronLeft className="size-8" /></button>}
      {!isLast && <button onClick={(e) => { e.stopPropagation(); goNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white z-10 p-2 hover:bg-white/10 rounded-full"><ChevronRight className="size-8" /></button>}

      <div onClick={(e) => e.stopPropagation()} className={`relative mx-4 max-h-[90vh] overflow-y-auto rounded-2xl bg-surface-card border border-surface-hover shadow-2xl ${isHtml ? "w-full max-w-5xl" : "w-full max-w-2xl"}`}>
        <div className="p-6 space-y-5">
          {/* 标题 */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">{insp.title}</h1>
              <div className="flex gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                <Badge variant="outline" className="text-[10px] h-5">{insp.type}</Badge>
                {insp.language && <Badge variant="outline" className="text-[10px] h-5">{insp.language}</Badge>}
                <span>{new Date(insp.createdAt).toLocaleDateString("zh-CN")}</span>
                <span className="text-white/30">{index + 1}/{items.length}</span>
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { onClose(); navigate(`/inspirations/${insp.id}`); }}><Pencil className="size-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => setShowDelete(true)}><Trash2 className="size-4" /></Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {insp.domain?.map((d) => <Badge key={d} variant="secondary" className="text-xs">{d === "design" ? "设计" : d === "dev" ? "开发" : d === "product" ? "产品" : d}</Badge>)}
            {insp.tags?.map((t) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
          </div>

          <Separator />

          {/* ===== HTML 分屏布局 ===== */}
          {isHtml && (
            <div className="flex flex-col lg:flex-row gap-4 min-h-[420px]">
              {/* 左：实时预览 */}
              <div className="flex-1 flex flex-col rounded-lg border border-surface-hover overflow-hidden">
                <div className="px-3 py-1.5 bg-surface-hover/50 text-xs text-muted-foreground">实时预览 {insp.notes ? "(HTML + CSS)" : ""}</div>
                <div className="flex-1 bg-white">
                  <iframe
                    srcDoc={`<style>${IFRAME_CSS}${insp.notes||""}</style>${insp.content}`}
                    sandbox="allow-scripts"
                    className="w-full h-full border-0"
                    title={insp.title}
                  />
                </div>
              </div>
              {/* 右：源码面板 (Tab 切换) */}
              <div className="flex-1 flex flex-col rounded-lg border border-surface-hover overflow-hidden">
                {/* Tab 栏 */}
                <div className="flex border-b border-surface-hover">
                  <button
                    onClick={() => setSourceTab("html")}
                    className={`flex-1 py-1.5 text-xs font-medium transition ${sourceTab === "html" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-white"}`}
                  >HTML</button>
                  <button
                    onClick={() => setSourceTab("css")}
                    className={`flex-1 py-1.5 text-xs font-medium transition ${sourceTab === "css" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-white"}`}
                  >CSS</button>
                </div>
                {/* 源码内容 */}
                <div className="flex-1 flex flex-col overflow-hidden max-h-[50vh]">
                  <div className="px-3 py-1.5 bg-surface-hover/30 text-xs text-muted-foreground flex justify-between">
                    <span>{sourceTab === "html" ? "HTML 源码" : "CSS 源码"}</span>
                    <CopyBtn text={sourceTab === "html" ? insp.content : (insp.notes || "")} />
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <CodeBlock code={sourceTab === "html" ? insp.content : (insp.notes || "（无 CSS）")} language={sourceTab === "html" ? "html" : "css"} maxHeight="none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== 其他类型 ===== */}
          {insp.type === "link" && (
            <div className="space-y-3">
              {insp.imageThumbnail && <img src={insp.imageThumbnail} alt={insp.title} className="w-full max-h-48 object-cover rounded-lg" />}
              <a href={insp.content} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline break-all text-sm">{insp.content} <ExternalLink className="size-4 shrink-0" /></a>
            </div>
          )}
          {insp.type === "image" && <img src={insp.content} alt={insp.title} className="max-w-full max-h-[50vh] rounded-lg object-contain mx-auto" />}
          {insp.type === "code" && <CodeBlock code={insp.content} language={insp.language} />}
          {insp.type === "note" && <div className="text-sm leading-relaxed prose prose-invert max-w-none"><ReactMarkdown>{insp.content}</ReactMarkdown></div>}

          {insp.sourceUrl && <div className="text-xs text-muted-foreground">来源: <a href={insp.sourceUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">{insp.sourceUrl}</a></div>}
          {insp.notes && insp.type !== "html" && <><Separator /><div className="text-sm leading-relaxed prose prose-invert max-w-none"><ReactMarkdown>{insp.notes}</ReactMarkdown></div></>}
        </div>
      </div>

      <DeleteDialog insp={insp} open={showDelete} onClose={() => setShowDelete(false)} onDeleted={() => { setShowDelete(false); onClose(); }} />
    </div>
  );
}

function DeleteDialog({ insp, open, onClose, onDeleted }: { insp: Inspiration; open: boolean; onClose: () => void; onDeleted: () => void }) {
  const m = useDeleteInspiration();
  return <Dialog open={open} onOpenChange={onClose}><DialogContent><DialogHeader><DialogTitle>确认删除</DialogTitle></DialogHeader><p className="text-sm text-muted-foreground">确定删除「{insp.title}」？</p><DialogFooter><Button variant="outline" onClick={onClose}>取消</Button><Button variant="destructive" onClick={() => m.mutate(insp.id, { onSuccess: onDeleted })}>删除</Button></DialogFooter></DialogContent></Dialog>;
}
