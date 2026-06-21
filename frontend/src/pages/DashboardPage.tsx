import { useInspirations, useCreateInspiration } from "@/hooks/useInspirations";
import InspirationCard from "@/components/inspiration/InspirationCard";
import QuickPreview from "@/components/inspiration/QuickPreview";
import InspirationForm from "@/components/forms/InspirationForm";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Columns, List, Sparkles, ArrowUpRight, Clock } from "lucide-react";
import type { InspirationCreate } from "@/types/index";
import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";

export default function DashboardPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInspirations();
  const createMutation = useCreateInspiration();
  const [showCreate, setShowCreate] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    const handler = () => setShowCreate(true);
    window.addEventListener("inspirehub:create", handler);
    return () => window.removeEventListener("inspirehub:create", handler);
  }, []);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElRef = useCallback((node: HTMLDivElement | null) => {
    if (isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
    });
    if (node) observer.current.observe(node);
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  const inspirations = data?.pages.flatMap((p) => p.records) || [];

  const handleCreate = (formData: { title: string; type: string; content: string; domain: string[]; tags: string[] }) => {
    createMutation.mutate(formData as unknown as InspirationCreate, {
      onSuccess: () => { toast.success("灵感已添加"); setShowCreate(false); },
      onError: () => toast.error("添加失败"),
    });
  };

  const openPreview = (idx: number) => { setPreviewIndex(idx); setPreviewOpen(true); };

  return (
    <div className="space-y-6">
      {/* ===== 顶部栏 ===== */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-9 rounded-xl bg-primary/10 ring-1 ring-primary/10">
              <Clock className="size-4 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                {inspirations.length > 0 ? `共 ${data?.pages[0]?.total || 0} 条灵感` : "我的灵感"}
              </h2>
              {inspirations.length > 0 && (
                <p className="text-xs text-muted-foreground/50">
                  最近更新 {new Date(inspirations[0]?.updatedAt || Date.now()).toLocaleDateString("zh-CN")}
                </p>
              )}
            </div>
          </div>
          {/* 视图切换 */}
          <div className="flex gap-0.5 bg-surface-hover/30 rounded-lg p-0.5 ml-4">
            <button onClick={() => setViewMode("card")} className={`p-1.5 rounded-md text-xs transition-all duration-200 ${viewMode === "card" ? "bg-card text-primary shadow-sm ring-1 ring-border/30" : "text-muted-foreground hover:text-foreground"}`}>
              <Columns className="size-3.5" />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md text-xs transition-all duration-200 ${viewMode === "list" ? "bg-card text-primary shadow-sm ring-1 ring-border/30" : "text-muted-foreground hover:text-foreground"}`}>
              <List className="size-3.5" />
            </button>
          </div>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-glow">
          <Plus className="size-4" /> 添加灵感
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[1,2,3,4,5,6,7,8].map((i) => (
            <div key={i} className="rounded-2xl border border-border/30 bg-card animate-pulse">
              <Skeleton className="h-32 w-full rounded-t-2xl bg-surface-hover/30" />
              <div className="p-2.5 space-y-1.5">
                <Skeleton className="h-3 w-3/4 bg-surface-hover/30 rounded-full" />
                <Skeleton className="h-2 w-1/2 bg-surface-hover/30 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 空态 */}
      {!isLoading && inspirations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="relative mb-8">
            <div className="size-24 rounded-3xl bg-primary/5 ring-1 ring-primary/10 flex items-center justify-center">
              <Sparkles className="size-10 text-primary/30" />
            </div>
            <div className="absolute -top-2 -right-2 size-8 rounded-full bg-card ring-1 ring-border/40 flex items-center justify-center">
              <ArrowUpRight className="size-4 text-primary/50" />
            </div>
          </div>
          <h2 className="text-xl font-bold mb-2">还没有灵感</h2>
          <p className="text-sm text-muted-foreground/50 mb-8">按下 <kbd className="px-1.5 py-0.5 text-[11px] font-mono rounded-md bg-surface-hover border border-border/30">Ctrl+N</kbd> 或点击下方按钮创建</p>
          <button onClick={() => setShowCreate(true)} className="btn-glow text-base">
            <Plus className="size-5" /> 添加第一条灵感
          </button>
        </div>
      )}

      {/* 卡片网格 */}
      {!isLoading && inspirations.length > 0 && (
        <div className={viewMode === "card" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3" : "space-y-1"}>
          {inspirations.map((insp, i) =>
            viewMode === "list" ? (
              <div
                key={insp.id}
                className="group flex items-center gap-4 px-4 py-3 rounded-xl border border-transparent hover:border-border/40 hover:bg-card cursor-pointer transition-all duration-200"
                onClick={() => openPreview(i)}
              >
                <div className="flex items-center justify-center size-8 rounded-lg bg-primary/5 shrink-0">
                  <span className="text-[10px] font-mono text-primary/70 uppercase">{insp.type}</span>
                </div>
                <span className="flex-1 font-medium truncate">{insp.title}</span>
                <span className="text-xs text-muted-foreground/40 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {new Date(insp.createdAt).toLocaleDateString("zh-CN")}
                </span>
              </div>
            ) : (
              <div key={insp.id} className="card-enter">
                <InspirationCard insp={insp} onClick={() => openPreview(i)} />
              </div>
            )
          )}
        </div>
      )}

      <div ref={lastElRef} className="h-8" />
      {isFetchingNextPage && (
        <div className="flex items-center justify-center py-4 gap-2 text-sm text-muted-foreground/40">
          <span className="size-2 rounded-full bg-primary/40 animate-bounce" />
          <span className="size-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0.15s]" />
          <span className="size-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0.3s]" />
        </div>
      )}

      {previewOpen && <QuickPreview index={previewIndex} items={inspirations} onClose={() => setPreviewOpen(false)} onIndexChange={setPreviewIndex} />}

      <Drawer open={showCreate} onOpenChange={setShowCreate} direction="right">
        <DrawerContent className="h-full max-w-lg ml-auto border-l border-border/30 shadow-2xl">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/40 to-transparent rounded-r-full" />
          <DrawerHeader className="pb-2">
            <DrawerTitle className="flex items-center gap-2 text-lg">
              <span className="flex items-center justify-center size-7 rounded-lg bg-primary/10 ring-1 ring-primary/10">
                <Sparkles className="size-3.5 text-primary" />
              </span>
              添加灵感
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-5 overflow-y-auto pb-8"><InspirationForm loading={createMutation.isPending} onSubmit={handleCreate} /></div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
