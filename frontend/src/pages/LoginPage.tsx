import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/stores/auth";
import { postData } from "@/api/client";
import type { LoginResponse, LoginRequest } from "@/types/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail, Lock, Sparkles, Loader2 } from "lucide-react";

const schema = z.object({
  email: z.string().email("请输入有效邮箱"),
  password: z.string().min(6, "密码至少 6 位").max(20, "密码最多 20 位"),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const loginStore = useAuthStore((s) => s.login);
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginRequest>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: LoginRequest) => {
    try { setError(""); const res = await postData<LoginResponse>("/auth/login", data); loginStore(res.token, res.user); navigate("/"); }
    catch { setError("邮箱或密码错误"); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1A1B26 0%, #2A1B3D 50%, #1A1B26 100%)" }}>
      {/* 装饰光斑 */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, #7AA2F7, transparent)" }} />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle, #F38BA8, transparent)" }} />

      <Card className="w-full max-w-sm border-surface-hover/50 bg-surface-card/80 backdrop-blur-sm shadow-2xl shadow-primary/5">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3 flex items-center justify-center size-12 rounded-2xl bg-primary/10">
            <Sparkles className="size-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">InspireHub</h1>
          <p className="text-sm text-muted-foreground/70 mt-1">欢迎回来，登录你的灵感中心</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">邮箱</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                <Input id="email" {...register("email")} placeholder="name@example.com" className="pl-9" />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs">密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                <Input id="password" type="password" {...register("password")} placeholder="••••••" className="pl-9" />
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            {error && <p className="text-sm text-destructive text-center bg-destructive/10 rounded-lg py-2">{error}</p>}
            <Button type="submit" className="w-full h-10 rounded-xl font-semibold tracking-wide" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="size-4 animate-spin mr-2" /> 登录中…</> : "登 录"}
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-muted-foreground/70">
            还没有账号？<Link to="/register" className="text-primary hover:underline font-medium">立即注册</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
