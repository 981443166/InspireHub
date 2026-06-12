import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/api/client";

export function useUploadImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("file", file);
      const res = await client.post("/upload/image", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data.url as string;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inspirations"] }),
  });
}

export function useExport() {
  return useMutation({
    mutationFn: async () => {
      const res = await client.get("/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "inspirehub-export.json";
      a.click();
      window.URL.revokeObjectURL(url);
    },
  });
}

export function useImport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (json: string) => {
      const res = await client.post("/import", json, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data.data.imported as number;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inspirations"] }),
  });
}
