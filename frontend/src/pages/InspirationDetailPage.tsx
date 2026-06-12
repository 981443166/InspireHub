import { useParams, useNavigate } from "react-router-dom";
import { useInspiration, useDeleteInspiration } from "@/hooks/useInspirations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import InspirationForm from "@/components/forms/InspirationForm";
import type { InspirationUpdate } from "@/types/index";
import { useUpdateInspiration } from "@/hooks/useInspirations";
import { ArrowLeft, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import CodeBlock from "@/components/inspiration/CodeBlock";
import ReactMarkdown from "react-markdown";

export default function InspirationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: insp, isLoading } = useInspiration(Number(id));
  const deleteMutation = useDeleteInspiration();
  const updateMutation = useUpdateInspiration();
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [sourceTab, setSourceTab] = useState<"html" | "css">("html");

  if (isLoading || !insp) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">加载中…</div>;
  }

  const handleDelete = () => {
    deleteMutation.mutate(Number(id), {
      onSuccess: () => {
        toast.success("灵感已删除");
        navigate("/");
      },
    });
  };

  const handleUpdate = (data: { title: string; type: string; content: string; domain: string[]; tags: string[] }) => {
    updateMutation.mutate({ id: Number(id), data: data as unknown as InspirationUpdate }, {
      onSuccess: () => {
        toast.success("灵感已更新");
        setShowEdit(false);
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 返回 */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-white transition">
        <ArrowLeft className="size-4" /> 返回
      </button>

      {/* 标题行 */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">{insp.title}</h1>
          <div className="flex gap-2 text-sm text-muted-foreground">
            <span>创建于 {new Date(insp.createdAt).toLocaleDateString("zh-CN")}</span>
            <span>·</span>
            <span>更新于 {new Date(insp.updatedAt).toLocaleDateString("zh-CN")}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowEdit(true)}>
            <Pencil className="size-4" /> 编辑
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setShowDelete(true)}>
            <Trash2 className="size-4" /> 删除
          </Button>
        </div>
      </div>

      <Separator />

      {/* 类型 + 领域 + 标签 */}
      <div className="flex flex-wrap gap-2">
        <Badge>{insp.type}</Badge>
        {insp.domain?.map((d) => (
          <Badge key={d} variant="secondary">
            {d === "design" ? "设计" : d === "dev" ? "开发" : d === "product" ? "产品" : d}
          </Badge>
        ))}
        {insp.tags?.map((t) => (
          <Badge key={t} variant="outline">{t}</Badge>
        ))}
      </div>

      {/* 内容区（按类型不同渲染） */}
      <div className="rounded-lg border border-surface-hover bg-surface-card p-4">
        {insp.type === "link" && (
          <div className="space-y-3">
            {insp.imageThumbnail && (
              <img src={insp.imageThumbnail} alt={insp.title} className="w-full max-h-64 object-cover rounded-lg" />
            )}
            <a href={insp.content} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline break-all">
              {insp.content} <ExternalLink className="size-4 shrink-0" />
            </a>
          </div>
        )}
        {insp.type === "image" && (
          <img src={insp.content} alt={insp.title} className="max-w-full rounded" />
        )}
        {insp.type === "code" && (
          <CodeBlock code={insp.content} language={insp.language} />
        )}
        {insp.type === "html" && (
          <div className="flex flex-col md:flex-row gap-4 min-h-[350px]">
            <div className="flex-1 flex flex-col rounded border border-surface-hover overflow-hidden">
              <div className="px-3 py-1.5 bg-surface-hover/50 text-xs text-muted-foreground">实时预览 {insp.notes ? "(HTML + CSS)" : ""}</div>
              <div className="flex-1 bg-white">
                <iframe srcDoc={`<style>html,body{width:100%;height:100%;margin:0;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center}${insp.notes||""}</style>${insp.content}`} sandbox="allow-scripts" className="w-full h-full border-0" title={insp.title} />
              </div>
            </div>
            <div className="flex-1 flex flex-col rounded border border-surface-hover overflow-hidden">
              <div className="flex border-b border-surface-hover">
                <button onClick={() => setSourceTab("html")} className={`flex-1 py-1.5 text-xs font-medium ${sourceTab==="html"?"text-primary border-b-2 border-primary":"text-muted-foreground"}`}>HTML</button>
                <button onClick={() => setSourceTab("css")} className={`flex-1 py-1.5 text-xs font-medium ${sourceTab==="css"?"text-primary border-b-2 border-primary":"text-muted-foreground"}`}>CSS</button>
              </div>
              <div className="flex-1 flex flex-col overflow-hidden max-h-[60vh]">
                <div className="px-3 py-1.5 bg-surface-hover/30 text-xs text-muted-foreground">{sourceTab==="html"?"HTML 源码":"CSS 源码"}</div>
                <div className="flex-1 overflow-y-auto">
                  <CodeBlock code={sourceTab==="html"?insp.content:(insp.notes||"（无 CSS）")} language={sourceTab==="html"?"html":"css"} maxHeight="none" />
                </div>
              </div>
            </div>
          </div>
        )}
        {insp.type === "note" && (
          <div className="text-sm leading-relaxed prose prose-invert max-w-none">
            <ReactMarkdown>{insp.content}</ReactMarkdown>
          </div>
        )}
      </div>

      {/* 备注 */}
      {insp.notes && insp.type !== "html" && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">备注</h3>
          <div className="rounded-lg border border-surface-hover bg-surface-card p-4 text-sm leading-relaxed prose prose-invert max-w-none">
            <ReactMarkdown>{insp.notes}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* 删除确认 */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <DialogHeader><DialogTitle>确认删除</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">确定要删除「{insp.title}」吗？此操作不可恢复。</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDelete(false)}>取消</Button>
            <Button variant="destructive" onClick={handleDelete}>删除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑抽屉 */}
      <Drawer open={showEdit} onOpenChange={setShowEdit} direction="right">
        <DrawerContent className="h-full max-w-lg ml-auto border-l border-surface-hover/50 shadow-2xl">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-r-full" />
          <DrawerHeader className="pb-2">
            <DrawerTitle className="flex items-center gap-2 text-lg">
              <span className="flex items-center justify-center size-7 rounded-lg bg-primary/10">
                <Pencil className="size-3.5 text-primary" />
              </span>
              编辑灵感
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 overflow-y-auto pb-8">
            <InspirationForm
              initial={insp}
              loading={updateMutation.isPending}
              onSubmit={handleUpdate}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
