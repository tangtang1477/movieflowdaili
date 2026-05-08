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
  error,
  required,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-muted-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`form-input ${error ? "error" : ""}`}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function RegisterPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
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

  const requiredFields: (keyof typeof form)[] = ["name", "email", "company", "invitePrefix", "password", "confirmPassword"];
  const allRequiredFilled = requiredFields.every((k) => form[k].trim().length > 0);
  const passwordsMatch = form.password === form.confirmPassword;
  const passwordLongEnough = form.password.length >= 6;
  const isValid = allRequiredFilled && passwordsMatch && passwordLongEnough;

  const getError = (field: keyof typeof form) => {
    if (!submitted) return undefined;
    if (requiredFields.includes(field) && !form[field].trim()) return "此项为必填项";
    if (field === "password" && !passwordLongEnough) return "密码至少需要 6 个字符";
    if (field === "confirmPassword" && !passwordsMatch) return "两次输入的密码不一致";
    return undefined;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    navigate({ to: "/console" });
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="负责人姓名" placeholder="请输入负责人真实姓名" value={form.name} onChange={update("name")} required error={getError("name")} />
          <FormField label="登录邮箱" placeholder="用于登录和接收系统通知" type="email" value={form.email} onChange={update("email")} required error={getError("email")} />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="代理商企业名称" placeholder="请输入公司或团队名称" value={form.company} onChange={update("company")} required error={getError("company")} />
          <FormField label="邀请码前缀" placeholder="例如 MFLOW" value={form.invitePrefix} onChange={update("invitePrefix")} required error={getError("invitePrefix")} />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="联系人" placeholder="如有专属联系人可填写" value={form.contact} onChange={update("contact")} />
          <FormField label="联系电话" placeholder="用于合作沟通和结算通知" value={form.phone} onChange={update("phone")} />
        </div>

        <FormField label="联系邮箱" placeholder="用于接收合作或财务通知" type="email" value={form.contactEmail} onChange={update("contactEmail")} />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="密码" placeholder="设置 6 位及以上登录密码" type="password" value={form.password} onChange={update("password")} required error={getError("password")} />
          <FormField label="确认密码" placeholder="请再次输入登录密码" type="password" value={form.confirmPassword} onChange={update("confirmPassword")} required error={getError("confirmPassword")} />
        </div>

        <button
          type="submit"
          disabled={submitted && !isValid}
          className="btn-primary mt-2 w-full py-3.5"
        >
          创建代理商账号
        </button>
      </form>
    </AuthLayout>
  );
}
