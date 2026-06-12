import { create } from "zustand";
import type { InspirationType, Domain, FilterState } from "@/types/index";

export const useFilterStore = create<FilterState & {
  toggleType: (t: InspirationType) => void;
  toggleDomain: (d: Domain) => void;
  toggleTag: (tag: string) => void;
  clearTypes: () => void;
  clearDomains: () => void;
  clearTags: () => void;
  setSearch: (s: string) => void;
  clearAll: () => void;
}>((set) => ({
  types: [],
  domains: [],
  tags: [],
  search: "",

  toggleType: (t) =>
    set((s) => ({
      types: s.types.includes(t) ? s.types.filter((x) => x !== t) : [...s.types, t],
    })),

  toggleDomain: (d) =>
    set((s) => ({
      domains: s.domains.includes(d) ? s.domains.filter((x) => x !== d) : [...s.domains, d],
    })),

  toggleTag: (tag) =>
    set((s) => ({
      tags: s.tags.includes(tag) ? s.tags.filter((x) => x !== tag) : [...s.tags, tag],
    })),

  clearTypes: () => set({ types: [] }),
  clearDomains: () => set({ domains: [] }),
  clearTags: () => set({ tags: [] }),

  setSearch: (search) => set({ search }),

  clearAll: () => set({ types: [], domains: [], tags: [], search: "" }),
}));

export function hasActiveFilter(s: FilterState): boolean {
  return s.types.length > 0 || s.domains.length > 0 || s.tags.length > 0 || s.search.length > 0;
}
