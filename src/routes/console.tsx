import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

export const Route = createFileRoute("/console")({
  head: () => ({
    meta: [
      { title: "代理商控制台 — Agent Console" },
      { name: "description", content: "管理邀请码、查看返佣与客户数据。" },
    ],
  }),
  component: ConsolePage,
});

/* ── Types ── */
interface InviteCode {
  code: string;
  usageLimit: number;
  usedCount: number;
  credits: number;
  createdAt: string;
  status: "active" | "expired" | "used";
}

type Section = "overview" | "invite" | "stats" | "settings";

/* ── Helpers ── */
function generateRandomCode(prefix: string) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = prefix;
  for (let i = 0; i < 5; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

const SIDEBAR_ITEMS: { key: Section; label: string; icon: string }[] = [
  { key: "overview", label: "账户总览", icon: "📊" },
  { key: "invite", label: "邀请码管理", icon: "🎫" },
  { key: "stats", label: "使用统计", icon: "📈" },
  { key: "settings", label: "账户设置", icon: "⚙️" },
];

const PIE_COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444"];

/* ── Demo data for charts ── */
const TREND_DATA = [
  { month: "2024-12", 注册人数: 0, 使用积分: 0 },
  { month: "2025-01", 注册人数: 0, 使用积分: 0 },
  { month: "2025-02", 注册人数: 0, 使用积分: 0 },
  { month: "2025-03", 注册人数: 0, 使用积分: 0 },
  { month: "2025-04", 注册人数: 0, 使用积分: 0 },
  { month: "2025-05", 注册人数: 0, 使用积分: 0 },
];

/* ================================================================ */
function ConsolePage() {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("overview");
  const [showCommissionDialog, setShowCommissionDialog] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Quota alert
  const [quotaAlertEnabled, setQuotaAlertEnabled] = useState(false);
  const [quotaAlertThreshold, setQuotaAlertThreshold] = useState(100);

  // Generate form
  const [genQuantity, setGenQuantity] = useState(1);
  const [genUsageLimit, setGenUsageLimit] = useState(1);
  const [genCredits, setGenCredits] = useState(0);

  const user = { name: "Vic", email: "fangxi.dou@gmail.com", agentId: "agt_a5877cdbe3584f7a87109359", status: "ACTIVE" };
  const agent = {
    company: "Victoria Ltc", invitePrefix: "AAAA", contact: "Vic",
    phone: "13216341111", contactEmail: "fangxi.dou@gmail.com",
    settlementDay: "未设置", commissionRate: "未设置",
  };
  const commissionNotSet = agent.commissionRate === "未设置";

  useEffect(() => {
    if (commissionNotSet) {
      const t = setTimeout(() => setShowCommissionDialog(true), 500);
      return () => clearTimeout(t);
    }
  }, [commissionNotSet]);

  const totalQuota = inviteCodes.reduce((s, c) => s + c.credits * c.usageLimit, 0);
  const usedQuota = inviteCodes.reduce((s, c) => s + c.credits * c.usedCount, 0);
  const remainingQuota = totalQuota - usedQuota;

  const pendingCounts = useMemo(() => {
    const active = inviteCodes.filter(c => c.status === "active" && c.usedCount < c.usageLimit).length;
    const expired = inviteCodes.filter(c => c.status === "expired").length;
    const fullyUsed = inviteCodes.filter(c => c.usedCount >= c.usageLimit).length;
    return { active, expired, fullyUsed };
  }, [inviteCodes]);

  const distributionData = useMemo(() => {
    if (inviteCodes.length === 0) return [{ name: "暂无数据", value: 1 }];
    return [
      { name: "待使用", value: pendingCounts.active || 0 },
      { name: "已过期", value: pendingCounts.expired || 0 },
      { name: "已用完", value: pendingCounts.fullyUsed || 0 },
    ].filter(d => d.value > 0);
  }, [inviteCodes, pendingCounts]);

  const handleGenerate = () => {
    const newCodes: InviteCode[] = [];
    for (let i = 0; i < genQuantity; i++) {
      newCodes.push({
        code: generateRandomCode(agent.invitePrefix),
        usageLimit: genUsageLimit, usedCount: 0, credits: genCredits,
        createdAt: new Date().toLocaleDateString("zh-CN"), status: "active",
      });
    }
    setInviteCodes(prev => [...prev, ...newCodes]);
    setShowGenerateDialog(false);
    setGenQuantity(1); setGenUsageLimit(1); setGenCredits(0);
  };

  const handleCopyLink = (code: string) => {
    navigator.clipboard.writeText(`https://aideo-test.movieflow.ai/login?invite_code=${code}`);
    setCopySuccess(code);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Sidebar ── */}
      <aside className={`sticky top-0 flex h-screen flex-col border-r border-border bg-card transition-all duration-200 ${sidebarCollapsed ? "w-16" : "w-56"}`}>
        {/* Logo */}
        <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">A</div>
          {!sidebarCollapsed && <span className="text-sm font-semibold text-foreground">Agent Console</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.key}
              onClick={() => setSection(item.key)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                section === item.key
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="border-t border-border p-2">
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-muted/50">
            {sidebarCollapsed ? "»" : "« 收起"}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-md">
          <h1 className="text-base font-semibold text-foreground">
            {SIDEBAR_ITEMS.find(i => i.key === section)?.label}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">{user.name.charAt(0)}</div>
              <span className="text-sm text-foreground">{user.name}</span>
            </div>
            <button onClick={() => navigate({ to: "/login" })} className="btn-outline px-4 py-1.5 text-xs">退出登录</button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto max-w-[960px]">
            {section === "overview" && <OverviewSection
              user={user} agent={agent} commissionNotSet={commissionNotSet}
              totalQuota={totalQuota} usedQuota={usedQuota} remainingQuota={remainingQuota}
              pendingCounts={pendingCounts}
              quotaAlertEnabled={quotaAlertEnabled} setQuotaAlertEnabled={setQuotaAlertEnabled}
              quotaAlertThreshold={quotaAlertThreshold} setQuotaAlertThreshold={setQuotaAlertThreshold}
              onGenerateClick={() => setShowGenerateDialog(true)}
              onSectionChange={setSection}
            />}
            {section === "invite" && <InviteSection
              inviteCodes={inviteCodes} copySuccess={copySuccess}
              onCopyLink={handleCopyLink} onGenerateClick={() => setShowGenerateDialog(true)}
            />}
            {section === "stats" && <StatsSection trendData={TREND_DATA} distributionData={distributionData} inviteCodes={inviteCodes} />}
            {section === "settings" && <SettingsSection user={user} agent={agent} commissionNotSet={commissionNotSet} />}
          </div>
        </main>
      </div>

      {/* ── Dialogs ── */}
      <Dialog open={showCommissionDialog} onOpenChange={setShowCommissionDialog}>
        <DialogContent className="max-w-md rounded-2xl border-border bg-card p-8">
          <DialogHeader><DialogTitle className="text-xl font-bold">开始使用前</DialogTitle></DialogHeader>
          <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed">
            您的返佣比例尚未设置。您可以先生成 <strong>0 预存额度</strong> 的邀请码体验功能，如需提升额度请联系我们。
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button className="btn-outline px-6 py-2.5">联系我们</button>
            <button onClick={() => { setShowCommissionDialog(false); setShowGenerateDialog(true); }} className="btn-primary px-6 py-2.5">生成 0 预存邀请码</button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent className="max-w-md rounded-2xl border-border bg-card p-8">
          <DialogHeader><DialogTitle className="text-xl font-bold">生成邀请码</DialogTitle></DialogHeader>
          <div className="mt-4 flex flex-col gap-5">
            <NumberField label="生成数量" value={genQuantity} onChange={setGenQuantity} min={1} max={100} />
            <NumberField label="邀请码可用次数" value={genUsageLimit} onChange={setGenUsageLimit} min={1} max={999} />
            <NumberField label="注册预存积分" value={genCredits} onChange={setGenCredits} min={0} max={99999} />
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs text-muted-foreground">本次预留额度</p>
                <p className="mt-1 text-xl font-bold">{genCredits * genUsageLimit * genQuantity}</p>
              </div>
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="text-xs text-muted-foreground">当前剩余额度</p>
                <p className="mt-1 text-xl font-bold">{remainingQuota}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setShowGenerateDialog(false)} className="btn-outline px-6 py-2.5">取消</button>
              <button onClick={handleGenerate} disabled={genQuantity < 1} className="btn-primary px-6 py-2.5">确认生成</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ================================================================
   SECTION: 账户总览
   ================================================================ */
function OverviewSection({
  user, agent, commissionNotSet,
  totalQuota, usedQuota, remainingQuota,
  pendingCounts,
  quotaAlertEnabled, setQuotaAlertEnabled,
  quotaAlertThreshold, setQuotaAlertThreshold,
  onGenerateClick, onSectionChange,
}: {
  user: any; agent: any; commissionNotSet: boolean;
  totalQuota: number; usedQuota: number; remainingQuota: number;
  pendingCounts: { active: number; expired: number; fullyUsed: number };
  quotaAlertEnabled: boolean; setQuotaAlertEnabled: (v: boolean) => void;
  quotaAlertThreshold: number; setQuotaAlertThreshold: (v: number) => void;
  onGenerateClick: () => void; onSectionChange: (s: Section) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold">你好，{user.name} 👋</h2>
        <p className="mt-1 text-sm text-muted-foreground">欢迎回到代理商控制台</p>
        <div className="mt-2 flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />账号正常
          </span>
          <span className="text-xs text-muted-foreground">ID: {user.agentId}</span>
        </div>
      </div>

      {/* Commission warning */}
      {commissionNotSet && (
        <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100">⚠️</div>
            <div>
              <p className="text-sm font-medium text-amber-800">返佣比例尚未设置</p>
              <p className="text-xs text-amber-600">目前只能生成 0 预存额度的邀请码，联系我们提升额度</p>
            </div>
          </div>
          <button className="btn-outline border-amber-300 px-4 py-1.5 text-xs text-amber-700 hover:bg-amber-100">联系我们</button>
        </div>
      )}

      {/* Quota card with formula */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">可用额度</p>
            <p className="mt-1 text-3xl font-bold text-foreground">{remainingQuota}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={onGenerateClick} className="btn-primary px-5 py-2">生成邀请码</button>
            <button onClick={() => onSectionChange("invite")} className="btn-outline px-4 py-2 text-sm">邀请码管理</button>
          </div>
        </div>
        {/* Formula breakdown (inspired by Volcengine) */}
        <p className="mt-3 text-xs text-muted-foreground">
          ( 总额度: <span className="font-semibold text-foreground">{totalQuota}</span> − 已使用: <span className="font-semibold text-foreground">{usedQuota}</span> ) = 剩余额度: <span className="font-semibold text-foreground">{remainingQuota}</span>
        </p>

        {/* Quota alert toggle */}
        <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">可用额度预警</p>
          <button
            onClick={() => setQuotaAlertEnabled(!quotaAlertEnabled)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${quotaAlertEnabled ? "bg-primary" : "bg-muted"}`}
          >
            <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${quotaAlertEnabled ? "translate-x-4" : "translate-x-0.5"}`} />
          </button>
          {quotaAlertEnabled && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">阈值:</span>
              <input
                type="number" min={0} value={quotaAlertThreshold}
                onChange={e => setQuotaAlertThreshold(Number(e.target.value))}
                className="form-input w-20 py-1 text-center text-xs"
              />
            </div>
          )}
        </div>
      </div>

      {/* 3-column quota cards */}
      <div className="grid grid-cols-3 gap-4">
        <QuotaCard label="总额度" value={totalQuota} icon="📊" color="blue" />
        <QuotaCard label="已使用" value={usedQuota} icon="📤" color="orange" />
        <QuotaCard label="剩余额度" value={remainingQuota} icon="💰" color="green" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Pending tasks card (inspired by Volcengine 待办事项) */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">待办事项</h3>
          <div className="grid grid-cols-3 gap-4">
            <PendingItem label="待使用" count={pendingCounts.active} color="text-blue-600" onClick={() => onSectionChange("invite")} />
            <PendingItem label="已过期" count={pendingCounts.expired} color="text-amber-600" onClick={() => onSectionChange("invite")} />
            <PendingItem label="已用完" count={pendingCounts.fullyUsed} color="text-green-600" onClick={() => onSectionChange("invite")} />
          </div>
        </div>

        {/* Quick settings card (inspired by Volcengine 账户设置) */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">快捷设置</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">返佣比例</span>
              {commissionNotSet
                ? <span className="text-xs text-amber-600 font-medium">未设置</span>
                : <span className="font-medium text-foreground">{agent.commissionRate}</span>}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">结算日</span>
              <span className={`text-xs font-medium ${agent.settlementDay === "未设置" ? "text-amber-600" : "text-foreground"}`}>{agent.settlementDay}</span>
            </div>
            <button onClick={() => onSectionChange("settings")} className="btn-ghost w-full py-1.5 text-xs text-primary">查看全部设置 →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   SECTION: 邀请码管理
   ================================================================ */
function InviteSection({
  inviteCodes, copySuccess, onCopyLink, onGenerateClick,
}: {
  inviteCodes: InviteCode[]; copySuccess: string | null;
  onCopyLink: (code: string) => void; onGenerateClick: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">邀请码管理</h2>
          <p className="mt-1 text-sm text-muted-foreground">生成邀请码分享给客户，客户注册后自动关联到您的代理商账号</p>
        </div>
        <button onClick={onGenerateClick} className="btn-primary px-6 py-2.5">+ 生成邀请码</button>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        {inviteCodes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">邀请码</th>
                  <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">可用次数</th>
                  <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">已使用</th>
                  <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">预存积分</th>
                  <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">状态</th>
                  <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">创建时间</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody>
                {inviteCodes.map(c => (
                  <tr key={c.code} className="border-b border-border/50 transition-colors hover:bg-muted/30">
                    <td className="py-3.5 pr-4 font-mono text-sm font-semibold">{c.code}</td>
                    <td className="py-3.5 pr-4">{c.usageLimit}</td>
                    <td className="py-3.5 pr-4">{c.usedCount}</td>
                    <td className="py-3.5 pr-4">{c.credits}</td>
                    <td className="py-3.5 pr-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3.5 pr-4 text-muted-foreground">{c.createdAt}</td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => onCopyLink(c.code)} className="btn-ghost px-2 py-1 text-xs">
                          {copySuccess === c.code ? "✓ 已复制" : "复制链接"}
                        </button>
                        <button className="btn-ghost px-2 py-1 text-xs">二维码</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-3xl">📋</div>
            <p className="text-sm font-medium">还没有邀请码</p>
            <p className="mt-1 text-xs text-muted-foreground">点击上方「生成邀请码」按钮创建第一个邀请码</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================================================
   SECTION: 使用统计
   ================================================================ */
function StatsSection({
  trendData, distributionData, inviteCodes,
}: {
  trendData: { month: string; 注册人数: number; 使用积分: number }[];
  distributionData: { name: string; value: number }[];
  inviteCodes: InviteCode[];
}) {
  // Recent 3-month billing-style table
  const recentMonths = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 3 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const codesThisMonth = inviteCodes.filter(c => c.createdAt.includes(key));
      const generated = codesThisMonth.length;
      const used = codesThisMonth.reduce((s, c) => s + c.usedCount, 0);
      const credits = codesThisMonth.reduce((s, c) => s + c.credits * c.usageLimit, 0);
      return { month: key, generated, used, credits, status: i === 0 ? "统计中" : "已结算" };
    });
  }, [inviteCodes]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">使用统计</h2>

      {/* Recent 3-month summary table (Volcengine style) */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-sm font-semibold">近三月概览</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">账期</th>
              <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">生成数量</th>
              <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">使用次数</th>
              <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">涉及积分</th>
              <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">状态</th>
            </tr>
          </thead>
          <tbody>
            {recentMonths.map(m => (
              <tr key={m.month} className="border-b border-border/50">
                <td className="py-3 pr-4 font-medium">{m.month}</td>
                <td className="py-3 pr-4">{m.generated}</td>
                <td className="py-3 pr-4">{m.used}</td>
                <td className="py-3 pr-4">{m.credits}</td>
                <td className="py-3">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${m.status === "统计中" ? "text-blue-600" : "text-green-600"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${m.status === "统计中" ? "bg-blue-500" : "bg-green-500"}`} />
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Trend chart */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold">近六月使用趋势</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="注册人数" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="使用积分" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution pie */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold">邀请码状态分布</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distributionData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {distributionData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   SECTION: 账户设置
   ================================================================ */
function SettingsSection({ user, agent, commissionNotSet }: { user: any; agent: any; commissionNotSet: boolean }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">账户设置</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">登录信息</h3>
          <InfoRow label="姓名" value={user.name} />
          <InfoRow label="邮箱" value={user.email} />
          <InfoRow label="代理商 ID" value={user.agentId} />
          <InfoRow label="状态" value={user.status} badge />
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">企业资料</h3>
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
  );
}

/* ================================================================
   SHARED SUB-COMPONENTS
   ================================================================ */
function NumberField({ label, value, onChange, min, max }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} className="btn-outline flex h-10 w-10 items-center justify-center p-0 text-lg">−</button>
        <input type="number" min={min} max={max} value={value} onChange={e => { const v = Number(e.target.value); if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v))); }} className="form-input w-full text-center" />
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} className="btn-outline flex h-10 w-10 items-center justify-center p-0 text-lg">+</button>
      </div>
    </div>
  );
}

function InfoRow({ label, value, badge, warn }: { label: string; value: string; badge?: boolean; warn?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 py-2.5 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      {badge ? (
        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">{value}</span>
      ) : warn ? (
        <span className="font-medium text-amber-600">{value}</span>
      ) : (
        <span className="font-medium text-foreground">{value}</span>
      )}
    </div>
  );
}

function QuotaCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: "blue" | "orange" | "green" }) {
  const colorMap = { blue: "border-blue-200 bg-blue-50", orange: "border-amber-200 bg-amber-50", green: "border-green-200 bg-green-50" };
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

function StatusBadge({ status }: { status: InviteCode["status"] }) {
  const map = {
    active: { label: "使用中", cls: "bg-green-100 text-green-700" },
    expired: { label: "已过期", cls: "bg-gray-100 text-gray-600" },
    used: { label: "已用完", cls: "bg-blue-100 text-blue-700" },
  };
  const s = map[status];
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.cls}`}>{s.label}</span>;
}

function PendingItem({ label, count, color, onClick }: { label: string; count: number; color: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 rounded-lg p-3 transition-colors hover:bg-muted/50">
      <span className={`text-2xl font-bold ${color}`}>{count}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </button>
  );
}
