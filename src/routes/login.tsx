import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "../components/AuthLayout";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "代理商登录 — Agent Portal" },
      { name: "description", content: "登录代理商账号，查看邀请客户、返佣明细与结算进度。" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <AuthLayout
      badge="Agent Portal"
      tagline="登录代理商账号，查看邀请客户、返佣明细与结算进度。"
      formTitle="代理商登录"
      formTag="Login"
      switchText="没有账号？"
      switchLinkText="去注册"
      switchTo="/register"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted-foreground">邮箱</label>
          <input
            type="email"
            placeholder="请输入注册时使用的邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted-foreground">密码</label>
          <input
            type="password"
            placeholder="请输入登录密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="mt-2 w-full rounded-full py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, oklch(0.62 0.13 45), oklch(0.55 0.11 40))",
          }}
        >
          登录并进入控制台
        </button>
      </form>
    </AuthLayout>
  );
}
