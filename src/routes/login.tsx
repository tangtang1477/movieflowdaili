import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
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
  const navigate = useNavigate();

  const isValid = email.trim().length > 0 && password.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    navigate({ to: "/console" });
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
            className="form-input"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm text-muted-foreground">密码</label>
            <Link
              to="/forgot-password"
              className="text-xs text-primary hover:underline transition-colors"
            >
              忘记密码？
            </Link>
          </div>
          <input
            type="password"
            placeholder="请输入登录密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
          />
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className="btn-primary mt-2 w-full py-3.5"
        >
          登录并进入控制台
        </button>
      </form>
    </AuthLayout>
  );
}
