import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/stores/auth";
import { useRegister } from "@/hooks/useAuth";
import type { RegisterRequest } from "@/types/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail, Lock, User, Sparkles, Loader2 } from "lucide-react";

const schema = z.object({
  username: z.string().min(2, "至少 2 个字符").max(50),
  email: z.string().email("请输入有效邮箱"),
  password: z.string().min(6, "至少 6 位").max(20, "最多 20 位"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: "两次密码不一致", path: ["confirmPassword"] });

export default function RegisterPage() {
  const navigate = useNavigate();
  const loginStore = useAuthStore((s) => s.login);
  const register = useRegister();
  const [error, setError] = useState("");
  const { register: reg, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterRequest & { confirmPassword: string }>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: RegisterRequest) => {
    try { setError(""); const res = await register.mutateAsync(data); loginStore(res.token, res.user); navigate("/"); }
    catch (err: unknown) { const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message; setError(msg || "注册失败"); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1A1B26 0%, #1D2A3A 50%, #1A1B26 100%)" }}>
      <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle, #A6E3A1, transparent)" }} />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle, #CBA6F7, transparent)" }} />

      <Card className="w-full max-w-sm border-surface-hover/50 bg-surface-card/80 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3 flex items-center justify-center size-12 rounded-2xl bg-primary/10">
            <Sparkles className="size-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">InspireHub</h1>
          <p className="text-sm text-muted-foreground/70 mt-1">创建你的灵感中心</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 mt-4">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-xs">用户名</Label>
              <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" /><Input id="username" {...reg("username")} placeholder="你的昵称" className="pl-9" /></div>
              {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">邮箱</Label>
              <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" /><Input id="email" {...reg("email")} placeholder="name@example.com" className="pl-9" /></div>
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs">密码</Label>
              <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" /><Input id="password" type="password" {...reg("password")} placeholder="6-20 位" className="pl-9" /></div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs">确认密码</Label>
              <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" /><Input id="confirmPassword" type="password" {...reg("confirmPassword")} placeholder="再次输入" className="pl-9" /></div>
              {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
            </div>
            {error && <p className="text-sm text-destructive text-center bg-destructive/10 rounded-lg py-2">{error}</p>}
            <Button type="submit" className="w-full h-10 rounded-xl font-semibold tracking-wide" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="size-4 animate-spin mr-2" /> 注册中…</> : "注 册"}
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-muted-foreground/70">
            已有账号？<Link to="/login" className="text-primary hover:underline font-medium">立即登录</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
