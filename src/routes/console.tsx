import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/console")({
  head: () => ({
    meta: [
      { title: "代理商控制台 — Agent Console" },
      { name: "description", content: "管理邀请码、查看返佣与客户数据。" },
    ],
  }),
  component: ConsolePage,
});

interface InviteCode {
  code: string;
  usageLimit: number;
  usedCount: number;
  credits: number;
  createdAt: string;
}

function generateRandomCode(prefix: string) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = prefix;
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function ConsolePage() {
  const navigate = useNavigate();
  const [showCommissionDialog, setShowCommissionDialog] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Generate invite code form state
  const [genQuantity, setGenQuantity] = useState(1);
  const [genUsageLimit, setGenUsageLimit] = useState(1);
  const [genCredits, setGenCredits] = useState(0);

  const user = {
    name: "Vic",
    email: "fangxi.dou@gmail.com",
    agentId: "agt_a5877cdbe3584f7a87109359",
    status: "ACTIVE",
  };

  const agent = {
    company: "Victoria Ltc",
    invitePrefix: "AAAA",
    contact: "Vic",
    phone: "13216341111",
    contactEmail: "fangxi.dou@gmail.com",
    settlementDay: "未设置",
    commissionRate: "未设置",
  };

  const commissionNotSet = agent.commissionRate === "未设置";

  useEffect(() => {
    if (commissionNotSet) {
      const timer = setTimeout(() => setShowCommissionDialog(true), 500);
      return () => clearTimeout(timer);
    }
  }, [commissionNotSet]);

  const totalQuota = inviteCodes.reduce((sum, c) => sum + c.credits * c.usageLimit, 0);
  const usedQuota = inviteCodes.reduce((sum, c) => sum + c.credits * c.usedCount, 0);
  const remainingQuota = totalQuota - usedQuota;

  const handleGenerate = () => {
    const newCodes: InviteCode[] = [];
    for (let i = 0; i < genQuantity; i++) {
      newCodes.push({
        code: generateRandomCode(agent.invitePrefix),
        usageLimit: genUsageLimit,
        usedCount: 0,
        credits: genCredits,
        createdAt: new Date().toLocaleDateString("zh-CN"),
      });
    }
    setInviteCodes((prev) => [...prev, ...newCodes]);
    setShowGenerateDialog(false);
    setGenQuantity(1);
    setGenUsageLimit(1);
    setGenCredits(0);
  };

  const handleCopyLink = (code: string) => {
    const link = `https://aideo-test.movieflow.ai/login?invite_code=${code}`;
    navigator.clipboard.writeText(link);
    setCopySuccess(code);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const handleLogout = () => navigate({ to: "/login" });

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
              A
            </div>
            <span className="text-sm font-semibold text-foreground">Agent Console</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                {user.name.charAt(0)}
              </div>
              <span className="text-sm text-foreground">{user.name}</span>
            </div>
            <button onClick={handleLogout} className="btn-outline px-4 py-1.5 text-xs">
              退出登录
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1080px] px-6 py-8">
        {/* Section A: Welcome + Status */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">你好，{user.name} 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">欢迎回到代理商控制台，这里可以管理您的邀请码和查看客户数据。</p>
          <div className="mt-3 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              账号正常
            </span>
            <span className="text-xs text-muted-foreground">ID: {user.agentId}</span>
          </div>
        </div>

        {/* Commission Warning Banner */}
        {commissionNotSet && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100">
                <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-amber-800">返佣比例尚未设置</p>
                <p className="text-xs text-amber-600">目前只能生成 0 预存额度的邀请码，联系我们提升额度</p>
              </div>
            </div>
            <button className="btn-outline border-amber-300 px-4 py-1.5 text-xs text-amber-700 hover:bg-amber-100">
              联系我们
            </button>
          </div>
        )}

        {/* Section B: Quota Cards */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <QuotaCard label="总额度" value={totalQuota} icon="📊" color="blue" />
          <QuotaCard label="已使用" value={usedQuota} icon="📤" color="orange" />
          <QuotaCard label="剩余额度" value={remainingQuota} icon="💰" color="green" />
        </div>

        {/* Section C: Quick Action */}
        <div className="mb-8 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">邀请码管理</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                生成邀请码分享给客户，客户注册后自动关联到您的代理商账号
              </p>
            </div>
            <button
              onClick={() => setShowGenerateDialog(true)}
              className="btn-primary px-6 py-2.5"
            >
              + 生成邀请码
            </button>
          </div>
        </div>

        {/* Section D: Invite Records Table */}
        <div className="mb-8 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-bold text-foreground">邀请记录</h2>

          {inviteCodes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">邀请码</th>
                    <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">可用次数</th>
                    <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">已使用</th>
                    <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">预存积分</th>
                    <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">创建时间</th>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {inviteCodes.map((c) => (
                    <tr key={c.code} className="border-b border-border/50 transition-colors hover:bg-muted/30">
                      <td className="py-3.5 pr-4 font-mono text-sm font-semibold text-foreground">{c.code}</td>
                      <td className="py-3.5 pr-4 text-foreground">{c.usageLimit}</td>
                      <td className="py-3.5 pr-4 text-foreground">{c.usedCount}</td>
                      <td className="py-3.5 pr-4 text-foreground">{c.credits}</td>
                      <td className="py-3.5 pr-4 text-muted-foreground">{c.createdAt}</td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyLink(c.code)}
                            className="btn-ghost px-2 py-1 text-xs"
                          >
                            {copySuccess === c.code ? "✓ 已复制" : "复制链接"}
                          </button>
                          <button className="btn-ghost px-2 py-1 text-xs">
                            二维码
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-3xl">
                📋
              </div>
              <p className="text-sm font-medium text-foreground">还没有邀请码</p>
              <p className="mt-1 text-xs text-muted-foreground">点击上方「生成邀请码」按钮创建第一个邀请码</p>
            </div>
          )}
        </div>

        {/* Section E: Account Info (Collapsible) */}
        <div className="rounded-xl border border-border bg-card">
          <button
            onClick={() => setShowAccountInfo(!showAccountInfo)}
            className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-muted/30"
          >
            <h2 className="text-lg font-bold text-foreground">账号与企业信息</h2>
            <svg
              className={`h-5 w-5 text-muted-foreground transition-transform ${showAccountInfo ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showAccountInfo && (
            <div className="border-t border-border px-6 pb-6 pt-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">登录信息</h3>
                  <InfoRow label="姓名" value={user.name} />
                  <InfoRow label="邮箱" value={user.email} />
                  <InfoRow label="代理商 ID" value={user.agentId} />
                  <InfoRow label="状态" value={user.status} badge />
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">企业资料</h3>
                  <InfoRow label="企业名称" value={agent.company} />
                  <InfoRow label="邀请码前缀" value={agent.invitePrefix} />
                  <InfoRow label="联系人" value={agent.contact} />
                  <InfoRow label="联系电话" value={agent.phone} />
                  <InfoRow label="联系邮箱" value={agent.contactEmail} />
                  <InfoRow label="结算日" value={agent.settlementDay} warn={agent.settlementDay === "未设置"} />
                  <InfoRow label="返佣比例" value={agent.commissionRate} warn={commissionNotSet} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Commission Dialog */}
      <Dialog open={showCommissionDialog} onOpenChange={setShowCommissionDialog}>
        <DialogContent className="max-w-md rounded-2xl border-border bg-card p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              开始使用前
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-foreground leading-relaxed">
            您的返佣比例尚未设置。您可以先生成 <strong>0 预存额度</strong> 的邀请码体验功能，如需提升额度请联系我们。
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button className="btn-outline px-6 py-2.5">
              联系我们
            </button>
            <button
              onClick={() => {
                setShowCommissionDialog(false);
                setShowGenerateDialog(true);
              }}
              className="btn-primary px-6 py-2.5"
            >
              生成 0 预存邀请码
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Generate Invite Code Dialog */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent className="max-w-md rounded-2xl border-border bg-card p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              生成邀请码
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-5">
            <NumberField label="生成数量" value={genQuantity} onChange={setGenQuantity} min={1} max={100} />
            <NumberField label="邀请码可用次数" value={genUsageLimit} onChange={setGenUsageLimit} min={1} max={999} />
            <NumberField label="注册预存积分" value={genCredits} onChange={setGenCredits} min={0} max={99999} />

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs text-muted-foreground">本次预留额度</p>
                <p className="mt-1 text-xl font-bold text-foreground">
                  {genCredits * genUsageLimit * genQuantity}
                </p>
              </div>
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="text-xs text-muted-foreground">当前剩余额度</p>
                <p className="mt-1 text-xl font-bold text-foreground">{remainingQuota}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowGenerateDialog(false)}
                className="btn-outline px-6 py-2.5"
              >
                取消
              </button>
              <button
                onClick={handleGenerate}
                disabled={genQuantity < 1}
                className="btn-primary px-6 py-2.5"
              >
                确认生成
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* --- Sub-components --- */

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="btn-outline flex h-10 w-10 items-center justify-center p-0 text-lg"
        >
          −
        </button>
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
          }}
          className="form-input w-full text-center"
        />
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="btn-outline flex h-10 w-10 items-center justify-center p-0 text-lg"
        >
          +
        </button>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  badge,
  warn,
}: {
  label: string;
  value: string;
  badge?: boolean;
  warn?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 py-2.5 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      {badge ? (
        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">{value}</span>
      ) : warn ? (
        <span className="text-amber-600 font-medium">{value}</span>
      ) : (
        <span className="font-medium text-foreground">{value}</span>
      )}
    </div>
  );
}

function QuotaCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: string;
  color: "blue" | "orange" | "green";
}) {
  const colorMap = {
    blue: "border-blue-200 bg-blue-50",
    orange: "border-amber-200 bg-amber-50",
    green: "border-green-200 bg-green-50",
  };
  return (
    <div className={`rounded-xl border p-5 ${colorMap[color]}`}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
      </div>
      <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}
