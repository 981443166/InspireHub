import { useShortcuts } from "@/hooks/useShortcuts";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";
import { useFilterStore } from "@/stores/filter";
import { useTags } from "@/hooks/useInspirations";
import { useExport, useImport } from "@/hooks/useActions";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuGroup, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import {
  Plus, LogOut, Settings, Download, Upload, Search, Menu, X, Sun, Moon,
  Palette, Monitor, Briefcase, Link, Image, Code, FileText, Braces, PaintBucket,
  Hash, FilterX, Sparkles,
} from "lucide-react";
import type { InspirationType, Domain } from "@/types/index";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

const domainOptions: { value: Domain; label: string; icon: React.ReactNode; color: string }[] = [
  { value: "design", label: "设计", icon: <Palette className="size-3" />, color: "#8FB4FF" },
  { value: "dev",    label: "开发", icon: <Monitor className="size-3" />, color: "#86EFAC" },
  { value: "product",label: "产品", icon: <Briefcase className="size-3" />, color: "#FFA4B6" },
];

const typeOptions: { value: InspirationType; label: string; icon: React.ReactNode }[] = [
  { value: "link",  label: "链接", icon: <Link className="size-3" /> },
  { value: "image", label: "图片", icon: <Image className="size-3" /> },
  { value: "code",  label: "代码", icon: <Code className="size-3" /> },
  { value: "note",  label: "笔记", icon: <FileText className="size-3" /> },
  { value: "html",  label: "HTML", icon: <Braces className="size-3" /> },
  { value: "css",   label: "CSS",  icon: <PaintBucket className="size-3" /> },
];

function tagColor(name: string): string {
  const colors = ["#8FB4FF", "#86EFAC", "#FFA4B6", "#FBBF77", "#C4A4F7", "#7DD3FC", "#FDE68A", "#86E0D8"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = ((h << 5) - h) + name.charCodeAt(i);
  return colors[Math.abs(h) % colors.length];
}

function SidebarContent() {
  const { data: tags } = useTags();
  const filter = useFilterStore();
  const hasAny = filter.types.length > 0 || filter.domains.length > 0 || filter.tags.length > 0;

  return (
    <div className="space-y-5 p-1">
      {/* 领域 */}
      <section className="rounded-xl border border-border/40 bg-card/40 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">领域</h4>
          {filter.domains.length > 0 && <button onClick={() => filter.clearDomains()} className="text-[10px] text-muted-foreground hover:text-destructive transition"><FilterX className="size-3 inline mr-0.5" /></button>}
        </div>
        <div className="space-y-1">
          {domainOptions.map((d) => {
            const active = filter.domains.includes(d.value);
            return (
              <button
                key={d.value}
                onClick={() => filter.toggleDomain(d.value)}
                className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-all duration-200 ${
                  active
                    ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                    : "bg-transparent text-muted-foreground hover:bg-surface-hover/50 hover:text-foreground"
                }`}
              >
                <span className="flex items-center justify-center size-6 rounded-md shrink-0" style={{ backgroundColor: active ? d.color + "20" : "transparent" }}>
                  <span style={{ color: d.color }}>{d.icon}</span>
                </span>
                <span className="flex-1 text-left">{d.label}</span>
                {active && (
                  <span className="size-1.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 类型 */}
      <section className="rounded-xl border border-border/40 bg-card/40 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">类型</h4>
          {filter.types.length > 0 && <button onClick={() => filter.clearTypes()} className="text-[10px] text-muted-foreground hover:text-destructive transition"><FilterX className="size-3 inline mr-0.5" /></button>}
        </div>
        <div className="grid grid-cols-2 gap-1">
          {typeOptions.map((t) => {
            const active = filter.types.includes(t.value);
            return (
              <button
                key={t.value}
                onClick={() => filter.toggleType(t.value)}
                className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] transition-all duration-200 ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-surface-hover/50 hover:text-foreground"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 标签云 */}
      <section className="rounded-xl border border-border/40 bg-card/40 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5"><Hash className="size-3" />标签</h4>
          {filter.tags.length > 0 && <button onClick={() => filter.clearTags()} className="text-[10px] text-muted-foreground hover:text-destructive transition"><FilterX className="size-3 inline mr-0.5" /></button>}
        </div>
        {!tags || tags.length === 0 ? (
          <p className="text-[11px] text-muted-foreground/40 italic">添加灵感后生成</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => {
              const active = filter.tags.includes(t.name);
              return (
                <button key={t.name} onClick={() => filter.toggleTag(t.name)}
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] transition-all duration-200 ${
                    active ? "bg-primary/10 text-primary ring-1 ring-primary/20" : "bg-surface-hover/50 text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                  }`}
                >
                  <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: tagColor(t.name) }} />
                  {t.name}
                  <span className="tabular-nums text-[10px] opacity-40 ml-0.5">{t.count}</span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {hasAny && (
        <button onClick={filter.clearAll} className="w-full flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition">
          <FilterX className="size-3.5" />清除所有筛选
        </button>
      )}
    </div>
  );
}

export default function AppLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const filter = useFilterStore();
  const themeStore = useThemeStore();
  const exportMutation = useExport();
  const importMutation = useImport();
  const [searchInput, setSearchInput] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const debouncedSearch = useDebounce(searchInput, 300);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { HelpDialog } = useShortcuts(
    () => window.dispatchEvent(new CustomEvent("inspirehub:create")),
    () => handleExport(),
  );

  useEffect(() => { filter.setSearch(debouncedSearch); }, [debouncedSearch]);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try { const text = await file.text(); const count = await importMutation.mutateAsync(text); toast.success(`成功导入 ${count} 条灵感`); } catch { toast.error("导入失败，请检查 JSON 格式"); }
    e.target.value = "";
  };

  const handleExport = () => { exportMutation.mutate(undefined, { onError: () => toast.error("导出失败") }); };

  return (
    <div className="flex h-screen flex-col bg-surface">
      {/* ===== 装饰渐变线 ===== */}
      <div className="h-px shrink-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* ===== 顶部栏 ===== */}
      <header className="flex h-14 items-center justify-between px-5 shrink-0">
        <div className="flex items-center gap-4">
          <Sheet open={mobileMenu} onOpenChange={setMobileMenu}>
            <SheetTrigger>
              <div className="md:hidden cursor-pointer size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-hover hover:text-foreground transition">
                <Menu className="size-4" />
              </div>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-surface border-r border-border/40">
              <SheetHeader><SheetTitle className="text-lg font-bold tracking-tight">筛选器</SheetTitle></SheetHeader>
              <SidebarContent />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none" onClick={() => navigate("/")}>
            <div className="flex items-center justify-center size-8 rounded-xl bg-primary/10 ring-1 ring-primary/10">
              <Sparkles className="size-4 text-primary" />
            </div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">InspireHub</h1>
          </div>

          <div className="hidden md:flex items-center relative max-w-sm flex-1">
            <Search className="absolute left-3 size-4 text-muted-foreground/50" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="搜索灵感… (Ctrl+K)"
              className="pl-9 h-8 text-sm rounded-xl border-border/30 bg-surface-hover/40 focus:bg-card focus:border-primary/30 transition-all duration-200"
            />
            {searchInput && <button onClick={() => setSearchInput("")} className="absolute right-2.5 text-muted-foreground hover:text-foreground transition"><X className="size-3.5" /></button>}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={themeStore.toggle} className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-hover hover:text-foreground transition" title={themeStore.theme === "dark" ? "浅色模式" : "深色模式"}>{themeStore.theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}</button>
          <button onClick={handleExport} className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-hover hover:text-foreground transition" title="导出 JSON"><Download className="size-4" /></button>
          <button onClick={() => fileInputRef.current?.click()} className="size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-hover hover:text-foreground transition" title="导入 JSON"><Upload className="size-4" /></button>
          <span className="w-px h-5 bg-border/40 mx-1" />
          <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all duration-200">
              <div>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-xs font-bold text-primary-foreground">
                    {user?.username?.slice(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 rounded-2xl border-border/40 shadow-xl shadow-black/10">
              <DropdownMenuGroup>
                <div className="px-3 py-2"><p className="text-sm font-medium">{user?.username || "用户"}</p><p className="text-[11px] text-muted-foreground/60 truncate">{user?.email}</p></div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")} className="gap-2.5 cursor-pointer rounded-lg mx-1"><Settings className="size-4" /> 个人设置</DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="gap-2.5 cursor-pointer rounded-lg mx-1 text-destructive"><LogOut className="size-4" /> 退出登录</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* 移动端搜索 */}
      <div className="md:hidden px-4 pb-2"><div className="relative"><Search className="absolute left-3 top-2 size-4 text-muted-foreground/50" /><Input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="搜索灵感…" className="pl-9 h-8 text-sm rounded-xl" /></div></div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:flex w-56 shrink-0 border-r border-border/40 flex-col">
          <ScrollArea className="flex-1 p-3"><SidebarContent /></ScrollArea>
        </aside>
        <main className="flex-1 overflow-y-auto p-4 md:p-6"><Outlet /></main>
      </div>

      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button onClick={() => navigate("/")} className="btn-glow-fab"><Plus className="size-6" /></button>
      </div>
      {HelpDialog}

      {/* 版本号 */}
      <div className="hidden md:block fixed bottom-3 right-4 z-40">
        <span className="text-[10px] font-mono text-muted-foreground/25 select-none">v1.0.0</span>
      </div>
    </div>
  );
}
