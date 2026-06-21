import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Inspiration, Domain } from "@/types/index";
import client from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Link, Image, Code, FileText, Import, Braces, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().min(1, "标题不能为空").max(200),
  type: z.enum(["link", "image", "code", "note", "html"]),
  content: z.string().min(1, "内容不能为空"),
  domain: z.array(z.enum(["design", "dev", "product"])),
  tags: z.array(z.string()),
  notes: z.string(),
  language: z.string(),
  sourceUrl: z.string(),
});

const domainOpts: { value: Domain; label: string }[] = [
  { value: "design", label: "设计" },
  { value: "dev", label: "开发" },
  { value: "product", label: "产品" },
];

const typeOpts = [
  { value: "link" as const, icon: <Link className="size-3.5" />, label: "链接" },
  { value: "image" as const, icon: <Image className="size-3.5" />, label: "图片" },
  { value: "code" as const, icon: <Code className="size-3.5" />, label: "代码" },
  { value: "note" as const, icon: <FileText className="size-3.5" />, label: "笔记" },
  { value: "html" as const, icon: <Braces className="size-3.5" />, label: "HTML" },
];

interface Props {
  onSubmit: (data: z.infer<typeof schema>) => void;
  initial?: Inspiration;
  loading?: boolean;
}

export default function InspirationForm({ onSubmit, initial, loading }: Props) {
  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          title: initial.title,
          type: initial.type as "link" | "image" | "code" | "note",
          content: initial.content,
          domain: (initial.domain || []) as Domain[],
          tags: initial.tags || [],
          notes: initial.notes || "",
          language: initial.language || "",
          sourceUrl: initial.sourceUrl || "",
        }
      : {
          type: "link" as const,
          title: "",
          content: "",
          domain: [] as Domain[],
          tags: [] as string[],
          notes: "",
          language: "",
          sourceUrl: "",
        },
  });

  const type = watch("type");
  const domains = watch("domain");
  const tags = watch("tags");

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setValue("tags", [...tags, t]);
      setTagInput("");
    }
  };

  const removeTag = (t: string) => setValue("tags", tags.filter((x) => x !== t));
  const toggleDomain = (d: Domain) => {
    setValue("domain", domains.includes(d) ? domains.filter((x) => x !== d) : [...domains, d]);
  };

  // 图片拖拽上传
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 1,
    disabled: uploading,
    onDrop: async ([file]) => {
      if (!file) return;
      setUploading(true);
      try {
        const form = new FormData();
        form.append("file", file);
        const res = await client.post("/upload/image", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const url = res.data.data.url as string;
        setValue("content", url);
        toast.success("图片上传成功");
      } catch {
        toast.error("上传失败");
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-1">
      {/* 类型选择 */}
      <div className="space-y-2">
        <Label>类型</Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-3 gap-2">
              {typeOpts.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => field.onChange(opt.value)}
                  className={`flex flex-col items-center gap-1 rounded-lg border p-2 text-xs transition ${
                    field.value === opt.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-surface-hover text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        />
        {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
      </div>

      {/* 标题 */}
      <div className="space-y-2">
        <Label htmlFor="title">标题 *</Label>
        <Input id="title" {...register("title")} placeholder="灵感标题" />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      {/* 内容 */}
      <div className="space-y-2">
        <Label htmlFor="content">
          {type === "link" ? "URL *" : type === "code" ? "代码 *" : type === "html" ? "HTML *" : "内容 *"}
        </Label>
        {(type === "code" || type === "html") ? (
          <Textarea id="content" {...register("content")} className="font-mono text-sm min-h-[120px]" placeholder={type === "html" ? "<div class=\"box\">Hello</div>" : "输入代码…"} />
        ) : (
          <Textarea id="content" {...register("content")} className="min-h-[100px]" placeholder={type === "link" ? "https://…" : "输入内容…"} />
        )}
        {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
      </div>

      {/* 语言 */}
      {(type === "code" || type === "html") && (
        <div className="space-y-2">
          <Label htmlFor="language">语言</Label>
          <Input id="language" {...register("language")} placeholder={type === "html" ? "html" : "javascript / python / bash …"} />
        </div>
      )}

      {type === "image" && (
        <div
          {...getRootProps()}
          className={`rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition ${
            isDragActive ? "border-primary bg-primary/10" : "border-surface-hover hover:border-primary/50"
          }`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <p className="text-sm text-muted-foreground">上传中…</p>
          ) : isDragActive ? (
            <p className="text-sm text-primary">松开以上传</p>
          ) : (
            <div className="space-y-2">
              <Import className="size-6 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">拖拽图片到这里，或点击选择</p>
              <p className="text-xs text-muted-foreground/60">支持 JPG/PNG/WebP/GIF，最大 10MB</p>
            </div>
          )}
        </div>
      )}

      {/* 来源 URL */}
      <div className="space-y-2">
        <Label htmlFor="sourceUrl">来源 URL（可选）</Label>
        <Input id="sourceUrl" {...register("sourceUrl")} placeholder="https://…" />
      </div>

      {/* 领域 */}
      <div className="space-y-2">
        <Label>领域</Label>
        <div className="flex gap-2">
          {domainOpts.map((d) => (
            <Badge
              key={d.value}
              variant={domains.includes(d.value) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleDomain(d.value)}
            >
              {d.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* 标签 */}
      <div className="space-y-2">
        <Label>标签</Label>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
            placeholder="输入标签后按回车"
            className="h-8 text-sm"
          />
          <Button type="button" variant="outline" size="sm" onClick={addTag}>添加</Button>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {tags.map((t) => (
            <Badge key={t} variant="secondary" className="cursor-pointer text-xs" onClick={() => removeTag(t)}>
              {t} ✕
            </Badge>
          ))}
        </div>
      </div>

      {/* CSS 字段 (HTML 类型时展示) */}
      {type === "html" && (
        <div className="space-y-2">
          <Label htmlFor="notes">CSS 样式 <span className="text-muted-foreground">(写入备注)</span></Label>
          <Textarea id="notes" {...register("notes")} className="font-mono text-sm min-h-[100px]" placeholder={`.box {\n  background: linear-gradient(135deg, #667eea, #764ba2);\n  padding: 24px;\n  border-radius: 12px;\n  color: white;\n}`} />
        </div>
      )}

      {/* 备注 */}
      {type !== "html" && (
        <div className="space-y-2">
          <Label htmlFor="notes">备注（Markdown）</Label>
          <Textarea id="notes" {...register("notes")} className="min-h-[80px] text-sm" placeholder="补充说明…" />
        </div>
      )}

      <Button type="submit" className="w-full h-10 rounded-xl font-semibold tracking-wide shadow-lg shadow-black/5 transition-all duration-300" disabled={loading}>
        {loading ? (
          <><Loader2 className="size-4 animate-spin mr-2" /> 保存中…</>
        ) : initial ? "💾 保存修改" : "✨ 添加灵感"}
      </Button>
    </form>
  );
}
