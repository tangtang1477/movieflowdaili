import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { AuthLayout } from "../components/AuthLayout";
import { useState, useEffect, useRef, useCallback } from "react";

export const Route = createFileRoute("/verify-email")({
  validateSearch: (s: Record<string, unknown>) => ({
    email: typeof s.email === "string" ? s.email : "",
  }),
  head: () => ({
    meta: [
      { title: "邮箱验证 — Agent Portal" },
      { name: "description", content: "完成邮箱验证以激活您的代理商账号。" },
    ],
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const navigate = useNavigate();
  const { email } = useSearch({ from: "/verify-email" });
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [status, setStatus] = useState<"idle" | "verifying" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (i: number, v: string) => {
    const ch = v.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = ch;
    setDigits(next);
    setStatus("idle");
    if (ch && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) inputRefs.current[i - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = ["", "", "", "", "", ""];
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setDigits(next);
    inputRefs.current[Math.min(text.length, 5)]?.focus();
  };

  const verify = useCallback((code: string) => {
    setStatus("verifying");
    setErrorMsg("");
    setTimeout(() => {
      if (/^\d{6}$/.test(code)) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("agent_session_active", "1");
        }
        navigate({ to: "/console" });
      } else {
        setStatus("error");
        setErrorMsg("验证码格式错误，请输入 6 位数字");
        setDigits(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    }, 600);
  }, [navigate]);

  useEffect(() => {
    const code = digits.join("");
    if (code.length === 6 && status !== "verifying") verify(code);
  }, [digits, verify, status]);

  const handleResend = () => {
    if (countdown > 0) return;
    setCountdown(60);
    setStatus("idle");
    setErrorMsg("");
  };

  return (
    <AuthLayout
      
      taglineMain="分享创造价值"
      taglineSub="连接创作者与未来"
      subtitle="邀请好友加入 MovieFlow Studio"
      subtitleHint="注册即可获得收益"
      formTitle="验证您的邮箱"
      formTag="Verify"
      switchText="想用其他邮箱？"
      switchLinkText="返回注册"
      switchTo="/register"
    >
      <div className="flex flex-col gap-6">
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
          <p className="text-muted-foreground">
            我们已向 <span className="font-semibold text-foreground break-all">{email || "您的邮箱"}</span> 发送了 6 位验证码，请查收邮件并填写下方验证码。
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            请在邮件中查收 6 位数字验证码。
          </p>
        </div>

        <div onPaste={handlePaste} className="flex justify-between gap-2 sm:gap-3">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKey(i, e)}
              disabled={status === "verifying"}
              className={`form-input h-14 w-full p-0 text-center text-2xl font-bold ${status === "error" ? "error" : ""}`}
            />
          ))}
        </div>

        {status === "verifying" && (
          <p className="text-center text-sm text-muted-foreground">正在验证…</p>
        )}
        {status === "error" && (
          <p className="text-center text-sm text-destructive">{errorMsg}</p>
        )}

        <div className="flex items-center justify-center gap-1 text-sm">
          <span className="text-muted-foreground">没收到邮件？</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={countdown > 0}
            className="btn-ghost px-2 py-1 text-sm"
          >
            {countdown > 0 ? `${countdown}s 后重新发送` : "重新发送验证邮件"}
          </button>
        </div>

        <Link to="/login" className="text-center text-xs text-muted-foreground hover:text-foreground transition-colors">
          已经验证过了？返回登录 →
        </Link>
      </div>
    </AuthLayout>
  );
}
