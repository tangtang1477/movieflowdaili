import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AuthLayout } from "../components/AuthLayout";
import { useState, useEffect, useCallback } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "代理商登录 — Agent Portal" },
      { name: "description", content: "分享创造价值" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [tab, setTab] = useState<"email" | "phone">("email");

  // Email login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Phone login state
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [codeSent, setCodeSent] = useState(false);

  const navigate = useNavigate();

  const isEmailValid = email.trim().length > 0 && password.trim().length > 0;
  const isPhoneValid = phone.trim().length >= 11 && code.trim().length >= 4;

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendCode = useCallback(() => {
    if (phone.trim().length < 11 || countdown > 0) return;
    // Mock: pretend code sent
    setCodeSent(true);
    setCountdown(60);
  }, [phone, countdown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === "email" && !isEmailValid) return;
    if (tab === "phone" && !isPhoneValid) return;
    navigate({ to: "/console" });
  };

  return (
    <AuthLayout
      badge="Agent Portal"
      tagline="分享创造价值"
      formTitle="代理商登录"
      formTag="Login"
      switchText="没有账号？"
      switchLinkText="去注册"
      switchTo="/register"
    >
      {/* Tab switcher */}
      <div className="mb-5 flex rounded-lg border border-border overflow-hidden">
        <button
          type="button"
          onClick={() => setTab("email")}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            tab === "email"
              ? "bg-primary text-primary-foreground"
              : "bg-transparent text-muted-foreground hover:bg-muted"
          }`}
        >
          邮箱密码登录
        </button>
        <button
          type="button"
          onClick={() => setTab("phone")}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            tab === "phone"
              ? "bg-primary text-primary-foreground"
              : "bg-transparent text-muted-foreground hover:bg-muted"
          }`}
        >
          手机验证码登录
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {tab === "email" ? (
          <>
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
          </>
        ) : (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-muted-foreground">手机号</label>
              <input
                type="tel"
                placeholder="请输入手机号"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                className="form-input"
                maxLength={11}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-muted-foreground">验证码</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="请输入验证码"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="form-input flex-1"
                  maxLength={6}
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={phone.trim().length < 11 || countdown > 0}
                  className="btn-outline shrink-0 whitespace-nowrap px-4 py-2.5 text-sm"
                >
                  {countdown > 0
                    ? `${countdown}s 后重发`
                    : codeSent
                      ? "重新发送"
                      : "获取验证码"}
                </button>
              </div>
              {codeSent && countdown > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  验证码已发送至 {phone}，请注意查收
                </p>
              )}
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={tab === "email" ? !isEmailValid : !isPhoneValid}
          className="btn-primary mt-2 w-full py-3.5"
        >
          登录并进入控制台
        </button>
      </form>
    </AuthLayout>
  );
}
