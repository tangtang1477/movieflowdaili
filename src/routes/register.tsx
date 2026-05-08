import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "../components/AuthLayout";
import { useState } from "react";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "代理商注册 — Agent Signup" },
      { name: "description", content: "完善代理商基础信息，创建专属账号并进入合作控制台。" },
    ],
  }),
  component: RegisterPage,
});

function FormField({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-muted-foreground">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
      />
    </div>
  );
}

function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    invitePrefix: "",
    contact: "",
    phone: "",
    contactEmail: "",
    password: "",
    confirmPassword: "",
  });

  const update = (key: keyof typeof form) => (v: string) =>
    setForm((prev) => ({ ...prev, [key]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <AuthLayout
      badge="Agent Signup"
      tagline="完善代理商基础信息，创建专属账号并进入合作控制台。"
      formTitle="代理商注册"
      formTag="Register"
      switchText="已有账号？"
      switchLinkText="去登录"
      switchTo="/login"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Row 1 */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="负责人姓名" placeholder="请输入负责人真实姓名" value={form.name} onChange={update("name")} />
          <FormField label="登录邮箱" placeholder="用于登录和接收系统通知" type="email" value={form.email} onChange={update("email")} />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="代理商企业名称" placeholder="请输入公司或团队名称" value={form.company} onChange={update("company")} />
          <FormField label="邀请码前缀" placeholder="例如 MFLOW" value={form.invitePrefix} onChange={update("invitePrefix")} />
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="联系人" placeholder="如有专属联系人可填写" value={form.contact} onChange={update("contact")} />
          <FormField label="联系电话" placeholder="用于合作沟通和结算通知" value={form.phone} onChange={update("phone")} />
        </div>

        {/* Row 4 - full width */}
        <FormField label="联系邮箱" placeholder="用于接收合作或财务通知" type="email" value={form.contactEmail} onChange={update("contactEmail")} />

        {/* Row 5 */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="密码" placeholder="设置 6 位及以上登录密码" type="password" value={form.password} onChange={update("password")} />
          <FormField label="确认密码" placeholder="请再次输入登录密码" type="password" value={form.confirmPassword} onChange={update("confirmPassword")} />
        </div>

        <button
          type="submit"
          className="mt-2 w-full rounded-full py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, oklch(0.62 0.13 45), oklch(0.55 0.11 40))",
          }}
        >
          创建代理商账号
        </button>
      </form>
    </AuthLayout>
  );
}
