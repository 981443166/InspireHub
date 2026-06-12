import { create } from "zustand";

type Theme = "dark" | "light";

interface ThemeState {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const stored = (localStorage.getItem("inspirehub-theme") || "dark") as Theme;

export const useThemeStore = create<ThemeState>((set) => ({
  theme: stored,

  toggle: () =>
    set((s) => {
      const next = s.theme === "dark" ? "light" : "dark";
      localStorage.setItem("inspirehub-theme", next);
      return { theme: next };
    }),

  setTheme: (theme) => {
    localStorage.setItem("inspirehub-theme", theme);
    set({ theme });
  },
}));
