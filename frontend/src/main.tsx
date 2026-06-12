import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { useThemeStore } from "@/stores/theme";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
});

if (localStorage.getItem("token") && !localStorage.getItem("user")) {
  localStorage.removeItem("token");
}

// 清理旧的 PWA Service Worker（如果存在）
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((reg) => reg.unregister());
  });
}

function ThemeSync() {
  const theme = useThemeStore((s) => s.theme);
  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);
  // 初始加载时立即设置
  useEffect(() => {
    const t = localStorage.getItem("inspirehub-theme") || "dark";
    document.documentElement.classList.toggle("light", t === "light");
  }, []);
  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeSync />
        <App />
        <Toaster richColors />
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>
);
