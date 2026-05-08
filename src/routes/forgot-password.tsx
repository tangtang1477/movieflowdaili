import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "../components/AuthLayout";
import { useState } from "react";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "忘记密码 — Agent Portal" },
      { name: "description", content: "重置您的代理商账号密码。" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const isValid = email.trim().length > 0 && email.includes("@");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setSent(true);
  };

  return (
    <AuthLayout
      badge="Agent Portal"
      tagline="重置密码，恢复对代理商控制台的访问。"
      formTitle="忘记密码"
      formTag="Reset"
      switchText="想起密码了？"
      switchLinkText="返回登录"
      switchTo="/login"
    >
      {sent ? (
        <div className="flex flex-col items-center gap-6 py-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">重置链接已发送</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              我们已向 <span className="font-medium text-foreground">{email}</span> 发送了密码重置链接，请查收邮箱。
            </p>
          </div>
          <Link to="/login" className="btn-primary mt-2 w-full py-3.5">
            返回登录
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <p className="text-sm text-muted-foreground">
            请输入您注册时使用的邮箱地址，我们将发送密码重置链接。
          </p>
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

          <button
            type="submit"
            disabled={!isValid}
            className="btn-primary mt-2 w-full py-3.5"
          >
            发送重置链接
          </button>

          <Link to="/login" className="text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← 返回登录
          </Link>
        </form>
      )}
    </AuthLayout>
  );
}
