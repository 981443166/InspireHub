import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getData, postData, putData, deleteData, hasToken } from "@/api/client";
import type { Inspiration, InspirationCreate, InspirationUpdate, PageResult, TagCount } from "@/types/index";
import { useFilterStore } from "@/stores/filter";

/** 分页列表（带筛选条件，未登录时不请求） */
export function useInspirations() {
  const { types, domains, tags } = useFilterStore();
  const params: Record<string, string> = {};
  if (types.length > 0) params.type = types.join(",");
  if (domains.length > 0) params.domain = domains.join(",");
  if (tags.length > 0) params.tags = tags.join(",");

  return useInfiniteQuery({
    queryKey: ["inspirations", params],
    queryFn: async ({ pageParam = 1 }) => {
      return getData<PageResult<Inspiration>>("/inspirations", {
        page: pageParam,
        size: 20,
        ...params,
      });
    },
    getNextPageParam: (last) =>
      last && last.current < last.pages ? last.current + 1 : undefined,
    initialPageParam: 1,
    enabled: hasToken(),
  });
}

/** 灵感详情 */
export function useInspiration(id: number) {
  return useQuery({
    queryKey: ["inspiration", id],
    queryFn: () => getData<Inspiration>(`/inspirations/${id}`),
    enabled: !!id && hasToken(),
  });
}

/** 创建灵感 */
export function useCreateInspiration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: InspirationCreate) =>
      postData<Inspiration>("/inspirations", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inspirations"] }),
  });
}

/** 更新灵感 */
export function useUpdateInspiration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: InspirationUpdate }) =>
      putData<Inspiration>(`/inspirations/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inspirations"] }),
  });
}

/** 删除灵感 */
export function useDeleteInspiration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteData(`/inspirations/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inspirations"] }),
  });
}

/** 标签云 */
export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => getData<TagCount[]>("/tags"),
    enabled: hasToken(),
  });
}

/** 全文搜索 */
export function useSearch(keyword: string) {
  return useQuery({
    queryKey: ["search", keyword],
    queryFn: () => getData<Inspiration[]>(`/inspirations/search?q=${keyword}`),
    enabled: keyword.length > 0,
  });
}
