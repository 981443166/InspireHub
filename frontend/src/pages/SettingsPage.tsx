import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/stores/auth";
import { getData, putData, hasToken } from "@/api/client";
import client from "@/api/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@/types/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ArrowLeft, Loader2, Trash2, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";

// ---- Schemas ----
const nameSchema = z.object({
  username: z.string().min(2, "用户名至少 2 个字符").max(50, "最多 50 个字符"),
});

const passwordSchema = z.object({
  oldPassword: z.string().min(1, "请输入当前密码"),
  newPassword: z.string().min(6, "新密码至少 6 位").max(20, "最多 20 位"),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "两次密码不一致",
  path: ["confirmPassword"],
});

// ---- Hooks ----
function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => getData<User>("/user/profile"),
    enabled: hasToken(),
  });
}

function useUpdateUsername() {
  const qc = useQueryClient();
  const auth = useAuthStore();
  return useMutation({
    mutationFn: (username: string) => putData<User>("/user/profile", { username }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["profile"] });
      auth.login(auth.token!, data);
      toast.success("昵称已更新");
    },
    onError: () => toast.error("昵称更新失败，可能已被占用"),
  });
}

function useUpdatePassword() {
  return useMutation({
    mutationFn: (password: string) => putData("/user/profile", { password }),
    onSuccess: () => toast.success("密码已更新"),
    onError: () => toast.error("密码更新失败"),
  });
}

function useDeleteAccount() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  return useMutation({
    mutationFn: async (password: string) => {
      await client.delete("/user/account", { data: { password } });
    },
    onSuccess: () => {
      toast.success("账号已删除");
      logout();
      navigate("/login");
    },
    onError: () => toast.error("密码错误，无法删除账号"),
  });
}

// ---- Page ----
export default function SettingsPage() {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useProfile();
  const updateName = useUpdateUsername();
  const updatePwd = useUpdatePassword();
  const deleteAccount = useDeleteAccount();
  const [showDelete, setShowDelete] = useState(false);
  const [activeTab, setActiveTab] = useState<"name" | "password">("name");

  const nameForm = useForm({ resolver: zodResolver(nameSchema), defaultValues: { username: "" } });
  const pwdForm = useForm({ resolver: zodResolver(passwordSchema), defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" } });

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <Loader2 className="size-5 animate-spin mr-2" /> 加载中…
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-2">
        <ArrowLeft className="size-4" /> 返回
      </button>

      <div className="flex items-center gap-3 mb-1">
        <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10">
          <SettingsIcon />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">个人设置</h1>
      </div>

      {/* 基本信息 */}
      <Card className="border-surface-hover/50 bg-surface-card shadow-sm">
        <CardHeader className="pb-3"><CardTitle>基本信息</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between py-1.5"><span className="text-muted-foreground">邮箱</span><span className="font-medium">{profile.email}</span></div>
          <div className="flex justify-between py-1.5 border-t border-surface-hover/30"><span className="text-muted-foreground">用户名</span><span className="font-medium">{profile.username}</span></div>
          <div className="flex justify-between py-1.5 border-t border-surface-hover/30"><span className="text-muted-foreground">注册时间</span><span className="font-medium">{new Date(profile.createdAt).toLocaleDateString("zh-CN")}</span></div>
        </CardContent>
      </Card>

      {/* 修改信息 */}
      <Card className="border-surface-hover/50 bg-surface-card shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>修改信息</CardTitle>
          <CardDescription>修改你的用户名或密码</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tab toggle */}
          <div className="flex rounded-lg border border-surface-hover p-0.5">
            <button onClick={() => setActiveTab("name")} className={`flex-1 py-1.5 text-xs rounded-md transition ${activeTab === "name" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-white"}`}>昵称</button>
            <button onClick={() => setActiveTab("password")} className={`flex-1 py-1.5 text-xs rounded-md transition ${activeTab === "password" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-white"}`}>密码</button>
          </div>

          {activeTab === "name" && (
            <form onSubmit={nameForm.handleSubmit((d) => updateName.mutate(d.username))} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="username">新昵称</Label>
                <Input id="username" {...nameForm.register("username")} placeholder={profile.username} />
                {nameForm.formState.errors.username && <p className="text-xs text-destructive">{nameForm.formState.errors.username.message}</p>}
              </div>
              <Button type="submit" disabled={updateName.isPending} size="sm">
                {updateName.isPending && <Loader2 className="size-3 animate-spin mr-1" />}
                保存昵称
              </Button>
            </form>
          )}

          {activeTab === "password" && (
            <form onSubmit={pwdForm.handleSubmit((d) => updatePwd.mutate(d.newPassword))} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="oldPassword">当前密码</Label>
                <Input id="oldPassword" type="password" {...pwdForm.register("oldPassword")} placeholder="输入当前密码" />
                {pwdForm.formState.errors.oldPassword && <p className="text-xs text-destructive">{pwdForm.formState.errors.oldPassword.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newPassword">新密码</Label>
                <Input id="newPassword" type="password" {...pwdForm.register("newPassword")} placeholder="6-20 位" />
                {pwdForm.formState.errors.newPassword && <p className="text-xs text-destructive">{pwdForm.formState.errors.newPassword.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">确认新密码</Label>
                <Input id="confirmPassword" type="password" {...pwdForm.register("confirmPassword")} placeholder="再次输入" />
                {pwdForm.formState.errors.confirmPassword && <p className="text-xs text-destructive">{pwdForm.formState.errors.confirmPassword.message}</p>}
              </div>
              <Button type="submit" disabled={updatePwd.isPending} size="sm">
                {updatePwd.isPending && <Loader2 className="size-3 animate-spin mr-1" />}
                更新密码
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* 危险区域 */}
      <Card className="border-destructive/20 bg-surface-card shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-destructive text-base">危险区域</CardTitle>
          <CardDescription>删除账号后所有灵感数据永久清除，不可恢复</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" size="sm" onClick={() => setShowDelete(true)}>
            <Trash2 className="size-4 mr-1" /> 删除账号
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* 删除确认 */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除账号</DialogTitle>
            <DialogDescription>
              此操作不可恢复。输入密码确认删除账号和所有关联灵感。
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); const pwd = (e.target as HTMLFormElement).password.value; deleteAccount.mutate(pwd); }} className="space-y-4">
            <Input name="password" type="password" placeholder="输入密码确认" required />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowDelete(false)} disabled={deleteAccount.isPending}>取消</Button>
              <Button type="submit" variant="destructive" disabled={deleteAccount.isPending}>
                {deleteAccount.isPending && <Loader2 className="size-3 animate-spin mr-1" />}
                确认删除
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
