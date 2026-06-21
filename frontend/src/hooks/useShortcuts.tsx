import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "@/stores/theme";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface Shortcut {
  key: string;
  desc: string;
  action: () => void;
  enabled: boolean;
}

export function useShortcuts(
  onCreate?: () => void,
  onExport?: () => void,
) {
  const navigate = useNavigate();
  const themeStore = useThemeStore();
  const [showHelp, setShowHelp] = useState(false);

  const toggleTheme = useCallback(() => themeStore.toggle(), [themeStore]);

  const shortcuts: Shortcut[] = [
    { key: "Ctrl + N", desc: "添加灵感", action: () => onCreate?.(), enabled: !!onCreate },
    { key: "Ctrl + K", desc: "聚焦搜索框", action: () => document.querySelector<HTMLInputElement>('[placeholder*="搜索"]')?.focus(), enabled: true },
    { key: "Ctrl + E", desc: "导出 JSON", action: () => onExport?.(), enabled: !!onExport },
    { key: "Ctrl + Shift + D", desc: "切换深色/浅色", action: toggleTheme, enabled: true },
    { key: "Ctrl + H", desc: "回到首页", action: () => navigate("/"), enabled: true },
    { key: "?", desc: "快捷键帮助", action: () => setShowHelp(true), enabled: true },
    { key: "Esc", desc: "关闭弹窗/帮助", action: () => setShowHelp(false), enabled: true },
  ];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const ctrl = e.ctrlKey || e.metaKey;

      if (ctrl && e.key === "n") { e.preventDefault(); onCreate?.(); }
      else if (ctrl && e.key === "k") { e.preventDefault(); document.querySelector<HTMLInputElement>('[placeholder*="搜索"]')?.focus(); }
      else if (ctrl && e.key === "e") { e.preventDefault(); onExport?.(); }
      else if (ctrl && e.shiftKey && e.key === "D") { e.preventDefault(); toggleTheme(); }
      else if (ctrl && e.key === "h") { e.preventDefault(); navigate("/"); }
      else if (e.key === "?") { e.preventDefault(); setShowHelp(true); }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCreate, onExport, toggleTheme, navigate]);

  const HelpDialog = (
    <Dialog open={showHelp} onOpenChange={setShowHelp}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>⌨️ 快捷键</DialogTitle></DialogHeader>
        <div className="space-y-1.5">
          {shortcuts.map((s) => (
            <div key={s.key} className="flex justify-between text-sm items-center py-1">
              <kbd className="px-2 py-0.5 text-[11px] font-mono rounded-md bg-surface-hover border border-surface-hover">{s.key}</kbd>
              <span className="text-xs text-muted-foreground">{s.desc}</span>
            </div>
          ))}
          <Separator className="mt-2 mb-1" />
          <p className="text-[11px] text-muted-foreground/60 italic text-center">在输入框中自动禁用快捷键</p>
        </div>
      </DialogContent>
    </Dialog>
  );

  return { showHelp, setShowHelp, HelpDialog };
}
