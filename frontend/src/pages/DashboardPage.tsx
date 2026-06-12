import { useInspirations, useCreateInspiration } from "@/hooks/useInspirations";
import InspirationCard from "@/components/inspiration/InspirationCard";
import QuickPreview from "@/components/inspiration/QuickPreview";
import InspirationForm from "@/components/forms/InspirationForm";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Columns, List, Sparkles } from "lucide-react";
import type { InspirationCreate } from "@/types/index";
import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";

export default function DashboardPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInspirations();
  const createMutation = useCreateInspiration();
  const [showCreate, setShowCreate] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);

  // 无限滚动加载更多
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">
            {inspirations.length > 0 ? `共 ${data?.pages[0]?.total || 0} 条灵感` : "我的灵感"}
          </h2>
          <div className="flex gap-1 ml-4">
            <button onClick={() => setViewMode("card")} className={`p-1.5 rounded ${viewMode === "card" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-white"}`}><Columns className="size-4" /></button>
            <button onClick={() => setViewMode("list")} className={`p-1.5 rounded ${viewMode === "list" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-white"}`}><List className="size-4" /></button>
          </div>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-glow">
          <span><Plus className="size-4" /> 添加灵感</span>
        </button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map((i) => <Skeleton key={i} className="h-40 rounded-lg bg-surface-card" />)}
        </div>
      )}

      {!isLoading && inspirations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <div className="size-20 rounded-3xl bg-primary/5 flex items-center justify-center mb-5">
            <Sparkles className="size-8 text-primary/40" />
          </div>
          <p className="text-xl font-semibold mb-2">✨ 还没有灵感</p>
          <p className="text-sm text-muted-foreground/60 mb-6">点击右上角按钮开始收集你的第一条灵感</p>
          <button onClick={() => setShowCreate(true)} className="btn-glow text-base">
            <span><Plus className="size-5" /> 添加第一条灵感</span>
          </button>
        </div>
      )}

      <div className={viewMode === "card" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-2"}>
        {inspirations.map((insp, i) =>
          viewMode === "list" ? (
            <div key={insp.id} className="flex items-center gap-3 p-3 rounded-lg border border-surface-hover bg-surface-card cursor-pointer hover:border-primary/30 transition" onClick={() => openPreview(i)}>
              <span className="text-primary text-xs w-8">{insp.type}</span>
              <span className="flex-1 truncate">{insp.title}</span>
              <span className="text-xs text-muted-foreground">{new Date(insp.createdAt).toLocaleDateString("zh-CN")}</span>
            </div>
          ) : (
            <InspirationCard key={insp.id} insp={insp} onClick={() => openPreview(i)} />
          )
        )}
      </div>

      {/* 2 秒后自动加载 */}
      <div ref={lastElRef} className="h-8" />
      {isFetchingNextPage && <div className="text-center text-sm text-muted-foreground py-2">加载更多…</div>}

      {previewOpen && <QuickPreview index={previewIndex} items={inspirations} onClose={() => setPreviewOpen(false)} onIndexChange={setPreviewIndex} />}

      <Drawer open={showCreate} onOpenChange={setShowCreate} direction="right">
        <DrawerContent className="h-full max-w-lg ml-auto border-l border-surface-hover/50 shadow-2xl">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-r-full" />
          <DrawerHeader className="pb-2">
            <DrawerTitle className="flex items-center gap-2 text-lg">
              <span className="flex items-center justify-center size-7 rounded-lg bg-primary/10">
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
