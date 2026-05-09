import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

export const Route = createFileRoute("/console")({
  head: () => ({
    meta: [
      { title: "代理商控制台 — Agent Console" },
      { name: "description", content: "查看返佣收益、邀请数据并申请提现。" },
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

type Section = "overview" | "invite" | "stats" | "info";

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
  { key: "info", label: "账户信息", icon: "👤" },
];

const PIE_COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444"];

/* ── Demo data ── */
const TREND_DATA = [
  { month: "2024-12", 佣金收益: 0, 充值人数: 0 },
  { month: "2025-01", 佣金收益: 0, 充值人数: 0 },
  { month: "2025-02", 佣金收益: 0, 充值人数: 0 },
  { month: "2025-03", 佣金收益: 0, 充值人数: 0 },
  { month: "2025-04", 佣金收益: 0, 充值人数: 0 },
  { month: "2025-05", 佣金收益: 0, 充值人数: 0 },
];

/* ================================================================ */
function ConsolePage() {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("overview");
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [payMethod, setPayMethod] = useState<null | "wechat" | "alipay">(null);
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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

  // Welcome dialog (commission-oriented, shown once per session)
  useEffect(() => {
    const key = "agent_console_welcome_shown";
    if (typeof window !== "undefined" && !sessionStorage.getItem(key)) {
      const t = setTimeout(() => {
        setShowWelcomeDialog(true);
        sessionStorage.setItem(key, "1");
      }, 400);
      return () => clearTimeout(t);
    }
  }, []);

  // Commission stats (demo: always 0 until real data wired up)
  const commissionStats = useMemo(() => ({
    available: 0,        // 当前可提现
    pending: 0,          // 待结算
    withdrawn: 0,        // 累计已提现
    monthIncrement: 0,   // 本月新增
    invitedUsers: 0,     // 邀请人数
    rechargedUsers: 0,   // 已充值人数
    totalRecharge: 0,    // 累计充值金额
  }), []);

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

  const handleSelectSection = (s: Section) => {
    setSection(s);
    setMobileNavOpen(false);
  };

  const sectionTitle = SIDEBAR_ITEMS.find(i => i.key === section)?.label;

  const NavList = ({ onPick }: { onPick: (s: Section) => void }) => (
    <nav className="flex-1 space-y-1 px-2 py-4">
      {SIDEBAR_ITEMS.map(item => (
        <button
          key={item.key}
          onClick={() => onPick(item.key)}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
            section === item.key
              ? "bg-primary/10 font-semibold text-primary"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
        >
          <span className="text-base">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );

  const onContact = () => setShowContactDialog(true);

  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Desktop Sidebar ── */}
      <aside className="sticky top-0 hidden h-screen w-56 flex-col border-r border-border bg-card md:flex">
        <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">A</div>
          <span className="text-sm font-semibold text-foreground">Agent Console</span>
        </div>
        <NavList onPick={handleSelectSection} />
      </aside>

      {/* ── Main ── */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-md md:px-6">
          <div className="flex items-center gap-2">
            {/* Mobile nav trigger */}
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <button
                  className="btn-outline flex h-9 w-9 items-center justify-center p-0 md:hidden"
                  aria-label="打开导航"
                >
                  ☰
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SheetHeader className="border-b border-border px-4 py-3">
                  <SheetTitle className="text-sm">Agent Console</SheetTitle>
                </SheetHeader>
                <NavList onPick={handleSelectSection} />
              </SheetContent>
            </Sheet>
            <h1 className="text-base font-semibold text-foreground">{sectionTitle}</h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">{user.name.charAt(0)}</div>
              <span className="hidden text-sm text-foreground sm:inline">{user.name}</span>
            </div>
            <button onClick={() => navigate({ to: "/login" })} className="btn-outline px-3 py-1.5 text-xs">退出</button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-5 md:px-6 md:py-6">
          <div className="mx-auto w-full max-w-[960px]">
            {section === "overview" && <OverviewSection
              user={user}
              commissionStats={commissionStats}
              pendingCounts={pendingCounts}
              onGenerateClick={() => setShowGenerateDialog(true)}
              onWithdraw={() => setShowWithdrawDialog(true)}
              onSectionChange={handleSelectSection}
              onContact={onContact}
              commissionNotSet={commissionNotSet}
              agent={agent}
            />}
            {section === "invite" && <InviteSection
              inviteCodes={inviteCodes} copySuccess={copySuccess}
              onCopyLink={handleCopyLink} onGenerateClick={() => setShowGenerateDialog(true)}
            />}
            {section === "stats" && <StatsSection
              trendData={TREND_DATA} distributionData={distributionData}
              inviteCodes={inviteCodes} commissionStats={commissionStats}
            />}
            {section === "info" && <InfoSection
              user={user} agent={agent} commissionNotSet={commissionNotSet}
              onContact={onContact}
            />}
          </div>
        </main>
      </div>

      {/* ── Welcome dialog (commission-oriented) ── */}
      <Dialog open={showWelcomeDialog} onOpenChange={setShowWelcomeDialog}>
        <DialogContent className="max-w-md rounded-2xl border-border bg-card p-7">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold leading-snug">
              欢迎加入，最高可赚 <span className="text-primary">50%</span> 佣金 🎉
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              您每邀请一位用户充值，最高可获得 <strong className="text-foreground">50% 的佣金奖励</strong>。
            </p>
            <p>
              零成本起步，立即生成您的专属邀请码，分享给好友即可开始赚取第一笔收益。
            </p>
            <ul className="rounded-lg border border-border bg-muted/30 p-3 text-xs space-y-1.5">
              <li>✅ 注册即可使用，无需任何前置费用</li>
              <li>✅ 客户充值即结算，结算后随时申请提现</li>
              <li>✅ 邀请越多，佣金比例越高</li>
            </ul>
          </div>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              onClick={() => setShowWelcomeDialog(false)}
              className="btn-outline w-full px-6 py-2.5 sm:w-auto"
            >
              先看看控制台
            </button>
            <button
              onClick={() => { setShowWelcomeDialog(false); setShowGenerateDialog(true); }}
              className="btn-primary w-full px-6 py-2.5 sm:w-auto"
            >
              立即生成邀请码
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Generate invite-code dialog ── */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent className="max-w-md rounded-2xl border-border bg-card p-7">
          <DialogHeader><DialogTitle className="text-xl font-bold">生成邀请码</DialogTitle></DialogHeader>
          <div className="mt-3 flex flex-col gap-5">
            <NumberField label="生成数量" value={genQuantity} onChange={setGenQuantity} min={1} max={100} />
            <NumberField label="邀请码可用次数" value={genUsageLimit} onChange={setGenUsageLimit} min={1} max={999} />
            <NumberField label="注册预存积分" value={genCredits} onChange={setGenCredits} min={0} max={99999} />
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
              <p>💡 客户使用邀请码注册并充值后，您将根据返佣比例获得对应佣金。</p>
              <p className="mt-1.5 text-foreground/80">建议提前预存积分，邀请码额度更充足，推广不断档，收益上限同步提升。</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">预存积分</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPayMethod("wechat")}
                  className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-md border border-[#07C160]/40 bg-white text-sm font-medium text-[#07C160] transition-colors hover:bg-[#07C160]/10 active:bg-[#07C160]/15"
                  aria-label="微信支付预存积分"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                    <path d="M9.5 3C5.36 3 2 5.91 2 9.5c0 2.06 1.13 3.89 2.88 5.09L4.2 17l2.5-1.36c.66.18 1.36.31 2.1.35-.13-.45-.2-.92-.2-1.4 0-3.31 3.13-6 7-6 .26 0 .51.01.76.04C16.73 5.07 13.46 3 9.5 3zM7 7.5a1 1 0 110 2 1 1 0 010-2zm5 0a1 1 0 110 2 1 1 0 010-2zm3.6 4c-3.31 0-6 2.24-6 5s2.69 5 6 5c.7 0 1.36-.1 1.98-.29L20 22l-.55-1.84c1.55-.92 2.55-2.43 2.55-4.16 0-2.76-2.69-5-6-5zm-2 2.5a.75.75 0 110 1.5.75.75 0 010-1.5zm4 0a.75.75 0 110 1.5.75.75 0 010-1.5z"/>
                  </svg>
                  微信
                </button>
                <button
                  type="button"
                  onClick={() => setPayMethod("alipay")}
                  className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-md border border-[#1677FF]/40 bg-white text-sm font-medium text-[#1677FF] transition-colors hover:bg-[#1677FF]/10 active:bg-[#1677FF]/15"
                  aria-label="支付宝支付预存积分"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                    <path d="M5 3h14a2 2 0 012 2v10.2c-2.1-.7-5.3-1.7-7.7-2.4.5-.9.9-1.9 1.2-3h-3.3v-1.2H15V8h-3.8V6h-1.5v1.6H6v1.2h3.7v1.2H6.6v1.2h6.2c-.2.7-.5 1.4-.8 2-1.7-.5-3.5-1-4.7-1-2 0-3.4 1-3.6 2.6-.3 1.9 1 3.6 3.6 3.6 1.9 0 3.7-.9 5.2-2.4 2.3 1.1 5.4 2.4 7.7 3.3A2 2 0 0119 21H5a2 2 0 01-2-2V5a2 2 0 012-2zm2.7 13.6c-1.4 0-2.3-.7-2.2-1.6.1-.8 1-1.3 2.3-1.3.9 0 2 .3 3.4.8-1 1.3-2.3 2.1-3.5 2.1z"/>
                  </svg>
                  支付宝
                </button>
              </div>
            </div>
            <div className="flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:justify-center">
              <button onClick={() => setShowGenerateDialog(false)} className="btn-outline px-6 py-2.5">取消</button>
              <button onClick={handleGenerate} disabled={genQuantity < 1} className="btn-primary px-6 py-2.5">确认生成</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Prepay QR-code dialog ── */}
      <Dialog open={payMethod !== null} onOpenChange={(o) => !o && setPayMethod(null)}>
        <DialogContent className="max-w-xs rounded-2xl border-border bg-card p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {payMethod === "wechat" ? "微信扫码预存积分" : "支付宝扫码预存积分"}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 flex flex-col items-center gap-3">
            <div
              className={`flex h-48 w-48 items-center justify-center rounded-lg border-2 ${
                payMethod === "wechat" ? "border-[#07C160]/40" : "border-[#1677FF]/40"
              } bg-white`}
            >
              <svg viewBox="0 0 100 100" className="h-44 w-44" aria-label="支付二维码">
                <rect width="100" height="100" fill="#fff" />
                {Array.from({ length: 100 }).map((_, i) => {
                  const x = (i % 10) * 10;
                  const y = Math.floor(i / 10) * 10;
                  const on = (i * 73 + 17) % 3 === 0;
                  return on ? <rect key={i} x={x} y={y} width="10" height="10" fill="#111" /> : null;
                })}
                <rect x="0" y="0" width="30" height="30" fill="#fff" stroke="#111" strokeWidth="4" />
                <rect x="10" y="10" width="10" height="10" fill="#111" />
                <rect x="70" y="0" width="30" height="30" fill="#fff" stroke="#111" strokeWidth="4" />
                <rect x="80" y="10" width="10" height="10" fill="#111" />
                <rect x="0" y="70" width="30" height="30" fill="#fff" stroke="#111" strokeWidth="4" />
                <rect x="10" y="80" width="10" height="10" fill="#111" />
              </svg>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              请使用 {payMethod === "wechat" ? "微信" : "支付宝"} 扫一扫完成预存积分充值
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Withdraw dialog (gates the only "Contact us" prompt) ── */}
      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent className="max-w-md rounded-2xl border-border bg-card p-7">
          <DialogHeader><DialogTitle className="text-xl font-bold">申请提现</DialogTitle></DialogHeader>
          <div className="mt-2 space-y-3 text-sm leading-relaxed">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="text-xs text-green-700">当前可提现金额</p>
              <p className="mt-1 text-3xl font-bold text-green-700">¥ {commissionStats.available.toFixed(2)}</p>
            </div>
            <p className="text-muted-foreground">
              提现需联系我们的合作经理审核，确认无误后预计 <strong className="text-foreground">1–3 个工作日</strong>到账。
            </p>
          </div>
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
            <button onClick={() => setShowWithdrawDialog(false)} className="btn-outline px-6 py-2.5">取消</button>
            <button onClick={() => { setShowWithdrawDialog(false); setShowContactDialog(true); }} className="btn-primary px-6 py-2.5">联系合作经理</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Contact us dialog ── */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="max-w-sm rounded-2xl border-border bg-card p-7">
          <DialogHeader><DialogTitle className="text-xl font-bold">联系我们</DialogTitle></DialogHeader>
          <div className="mt-2 space-y-3 text-sm">
            <p className="text-muted-foreground">通过以下方式联系合作经理：</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                <span className="text-xs text-muted-foreground">微信号</span>
                <span className="font-mono text-sm font-medium">movieflow_agent</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                <span className="text-xs text-muted-foreground">邮箱</span>
                <span className="font-mono text-sm font-medium">agent@movieflow.ai</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                <span className="text-xs text-muted-foreground">客服电话</span>
                <span className="font-mono text-sm font-medium">400-000-0000</span>
              </div>
            </div>
          </div>
          <div className="mt-5 flex justify-center">
            <button onClick={() => setShowContactDialog(false)} className="btn-primary px-8 py-2.5">我知道了</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ================================================================
   SECTION: 账户总览（佣金导向）
   ================================================================ */
function OverviewSection({
  user, commissionStats, pendingCounts,
  onGenerateClick, onWithdraw, onSectionChange, onContact,
  commissionNotSet, agent,
}: {
  user: any;
  commissionStats: { available: number; pending: number; withdrawn: number; monthIncrement: number; invitedUsers: number; rechargedUsers: number; totalRecharge: number };
  pendingCounts: { active: number; expired: number; fullyUsed: number };
  onGenerateClick: () => void;
  onWithdraw: () => void;
  onSectionChange: (s: Section) => void;
  onContact: () => void;
  commissionNotSet: boolean;
  agent: any;
}) {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold">你好，{user.name} 👋</h2>
        <p className="mt-1 text-sm text-muted-foreground">最高 50% 返佣，邀请越多赚得越多</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />账号正常
          </span>
          <span className="text-xs text-muted-foreground break-all">ID: {user.agentId}</span>
        </div>
      </div>

      {/* Hero: cumulative commission earnings */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">当前可提现佣金</p>
        <div className="mt-2 flex flex-wrap items-end gap-3">
          <p className="text-4xl font-bold text-foreground md:text-5xl">¥ {commissionStats.available.toFixed(2)}</p>
          <span className="text-sm text-muted-foreground pb-1.5">本月新增 ¥{commissionStats.monthIncrement.toFixed(2)}</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-muted/40 px-3 py-2">
            <p className="text-xs text-muted-foreground">待结算</p>
            <p className="mt-0.5 font-semibold text-foreground">¥ {commissionStats.pending.toFixed(2)}</p>
          </div>
          <div className="rounded-lg bg-muted/40 px-3 py-2">
            <p className="text-xs text-muted-foreground">累计已提现</p>
            <p className="mt-0.5 font-semibold text-foreground">¥ {commissionStats.withdrawn.toFixed(2)}</p>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button onClick={onWithdraw} className="btn-primary px-6 py-2.5">💰 申请提现</button>
          <button onClick={onGenerateClick} className="btn-outline px-6 py-2.5">+ 生成邀请码</button>
        </div>
      </div>

      {/* Reward rule banner */}
      <div className="rounded-xl border border-border bg-card p-4 text-sm">
        <div className="flex items-start gap-3">
          <span className="text-xl">🎁</span>
          <div className="flex-1">
            <p className="font-semibold text-foreground">奖励规则</p>
            <p className="mt-1 text-xs text-muted-foreground">
              每邀请 1 位用户充值，您可获得对应金额的佣金奖励。当前最高比例 <strong className="text-primary">50%</strong>，邀请越多档位越高。
            </p>
          </div>
        </div>
      </div>

      {/* 3-column commission cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="邀请人数" value={commissionStats.invitedUsers} suffix="人" icon="👥" color="blue" />
        <StatCard label="充值人数" value={commissionStats.rechargedUsers} suffix="人" icon="💳" color="orange" />
        <StatCard label="累计佣金" value={`¥${commissionStats.totalRecharge}`} icon="💰" color="green" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Pending tasks */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">邀请码状态</h3>
          <div className="grid grid-cols-3 gap-2">
            <PendingItem label="待使用" count={pendingCounts.active} color="text-blue-600" onClick={() => onSectionChange("invite")} />
            <PendingItem label="已过期" count={pendingCounts.expired} color="text-amber-600" onClick={() => onSectionChange("invite")} />
            <PendingItem label="已用完" count={pendingCounts.fullyUsed} color="text-green-600" onClick={() => onSectionChange("invite")} />
          </div>
        </div>

        {/* Quick info */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">合作信息</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">返佣比例</span>
              {commissionNotSet
                ? <button onClick={onContact} className="btn-contact">联系我们</button>
                : <span className="font-medium text-foreground">{agent.commissionRate}</span>}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">结算日</span>
              {agent.settlementDay === "未设置"
                ? <button onClick={onContact} className="btn-contact">联系我们</button>
                : <span className="font-medium text-foreground">{agent.settlementDay}</span>}
            </div>
            <button onClick={() => onSectionChange("info")} className="btn-ghost w-full py-1.5 text-xs">查看账户信息 →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   SECTION: 邀请码管理（响应式：桌面表格 / 移动卡片）
   ================================================================ */
function InviteSection({
  inviteCodes, copySuccess, onCopyLink, onGenerateClick,
}: {
  inviteCodes: InviteCode[]; copySuccess: string | null;
  onCopyLink: (code: string) => void; onGenerateClick: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">邀请码管理</h2>
          <p className="mt-1 text-sm text-muted-foreground">分享邀请码给好友，他们注册后将自动绑定到您名下。</p>
        </div>
        <button onClick={onGenerateClick} className="btn-primary px-6 py-2.5">+ 生成邀请码</button>
      </div>

      {inviteCodes.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col items-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-3xl">📋</div>
            <p className="text-sm font-medium">还没有邀请码</p>
            <p className="mt-1 text-xs text-muted-foreground">点击上方「生成邀请码」按钮创建第一个吧</p>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden rounded-xl border border-border bg-card p-6 md:block">
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
                      <td className="py-3.5 pr-4"><StatusBadge status={c.status} /></td>
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
          </div>

          {/* Mobile card list */}
          <div className="space-y-3 md:hidden">
            {inviteCodes.map(c => (
              <div key={c.code} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-base font-semibold">{c.code}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{c.createdAt}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-muted/40 py-2">
                    <p className="text-[10px] text-muted-foreground">可用</p>
                    <p className="text-sm font-semibold">{c.usageLimit}</p>
                  </div>
                  <div className="rounded-lg bg-muted/40 py-2">
                    <p className="text-[10px] text-muted-foreground">已用</p>
                    <p className="text-sm font-semibold">{c.usedCount}</p>
                  </div>
                  <div className="rounded-lg bg-muted/40 py-2">
                    <p className="text-[10px] text-muted-foreground">积分</p>
                    <p className="text-sm font-semibold">{c.credits}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => onCopyLink(c.code)} className="btn-outline flex-1 py-2 text-xs">
                    {copySuccess === c.code ? "✓ 已复制" : "复制链接"}
                  </button>
                  <button className="btn-outline flex-1 py-2 text-xs">二维码</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ================================================================
   SECTION: 使用统计（佣金导向 + 结算时间线）
   ================================================================ */
function StatsSection({
  trendData, distributionData, inviteCodes, commissionStats,
}: {
  trendData: { month: string; 佣金收益: number; 充值人数: number }[];
  distributionData: { name: string; value: number }[];
  inviteCodes: InviteCode[];
  commissionStats: { invitedUsers: number; rechargedUsers: number; totalRecharge: number; available: number; pending: number };
}) {
  // Settlement timeline rows (demo) — generate next 3 settlement dates (last day of each month)
  const settlementRows = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 3 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() + i + 1, 0); // last day of month
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const isPast = i === 0 && now.getDate() > 25;
      return {
        date: dateStr,
        recharge: 0,
        rate: "—",
        commission: 0,
        status: isPast ? "已结算 · 可提现" : "待结算",
      };
    });
  }, []);

  const conversionRate = commissionStats.invitedUsers > 0
    ? Math.round((commissionStats.rechargedUsers / commissionStats.invitedUsers) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">使用统计</h2>
        <p className="mt-1 text-sm text-muted-foreground">查看邀请数据与可提现佣金时间线</p>
      </div>

      {/* 4 stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="通过邀请码注册" value={commissionStats.invitedUsers} suffix="人" icon="👥" color="blue" />
        <StatCard label="其中已充值" value={`${commissionStats.rechargedUsers} (${conversionRate}%)`} icon="💳" color="orange" />
        <StatCard label="累计充值金额" value={`¥${commissionStats.totalRecharge}`} icon="💵" color="green" />
        <StatCard label="预计可提现佣金" value={`¥${(commissionStats.available + commissionStats.pending).toFixed(2)}`} icon="💰" color="primary" />
      </div>

      {/* Settlement timeline (key new section) */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-3">
          <h3 className="text-sm font-semibold">按结算日期展示可提现金额</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            结算日为每月最后一天，结算后 T+3 个工作日可申请提现。
          </p>
        </div>
        {/* Desktop */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">结算日期</th>
                <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">充值金额</th>
                <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">佣金比例</th>
                <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">可提现金额</th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">状态</th>
              </tr>
            </thead>
            <tbody>
              {settlementRows.map(r => (
                <tr key={r.date} className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">{r.date}</td>
                  <td className="py-3 pr-4">¥ {r.recharge.toFixed(2)}</td>
                  <td className="py-3 pr-4">{r.rate}</td>
                  <td className="py-3 pr-4 font-semibold text-foreground">¥ {r.commission.toFixed(2)}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${r.status.includes("已结算") ? "text-green-600" : "text-amber-600"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${r.status.includes("已结算") ? "bg-green-500" : "bg-amber-500"}`} />
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile */}
        <div className="space-y-2 md:hidden">
          {settlementRows.map(r => (
            <div key={r.date} className="rounded-lg border border-border bg-muted/20 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{r.date}</p>
                <span className={`text-xs font-medium ${r.status.includes("已结算") ? "text-green-600" : "text-amber-600"}`}>
                  {r.status}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                <div><span className="text-muted-foreground">充值</span><p className="font-medium">¥{r.recharge}</p></div>
                <div><span className="text-muted-foreground">比例</span><p className="font-medium">{r.rate}</p></div>
                <div><span className="text-muted-foreground">可提现</span><p className="font-semibold text-foreground">¥{r.commission}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold">近六月佣金收益</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="佣金收益" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="充值人数" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold">邀请码状态分布</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distributionData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={((props: any) => `${props.name ?? ""} ${((props.percent ?? 0) * 100).toFixed(0)}%`) as any}>
                  {distributionData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Latent var: keep inviteCodes referenced for future detail tabs */}
      <input type="hidden" data-codes={inviteCodes.length} />
    </div>
  );
}

/* ================================================================
   SECTION: 账户信息（原"账户设置"）
   ================================================================ */
function InfoSection({ user, agent, commissionNotSet, onContact }: {
  user: any; agent: any; commissionNotSet: boolean; onContact: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">账户信息</h2>
        <p className="mt-1 text-sm text-muted-foreground">查看您的账号与企业资料</p>
      </div>

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
          <InfoRow label="结算日" value={agent.settlementDay} contactWhen="未设置" onContact={onContact} />
          <InfoRow label="返佣比例" value={agent.commissionRate} contactWhen={commissionNotSet ? "未设置" : undefined} onContact={onContact} />
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

function InfoRow({ label, value, badge, contactWhen, onContact }: {
  label: string; value: string; badge?: boolean;
  contactWhen?: string; onContact?: () => void;
}) {
  const showContact = contactWhen !== undefined && (contactWhen === value || contactWhen === "未设置" && value === "未设置");
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/50 py-2.5 text-sm last:border-0">
      <span className="text-muted-foreground shrink-0">{label}</span>
      {badge ? (
        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">{value}</span>
      ) : showContact ? (
        <button onClick={onContact} className="btn-contact">联系我们</button>
      ) : (
        <span className="font-medium text-foreground text-right break-all">{value}</span>
      )}
    </div>
  );
}

function StatCard({ label, value, suffix, icon, color }: {
  label: string; value: number | string; suffix?: string; icon: string;
  color: "blue" | "orange" | "green" | "primary";
}) {
  const colorMap = {
    blue: "border-blue-200 bg-blue-50",
    orange: "border-amber-200 bg-amber-50",
    green: "border-green-200 bg-green-50",
    primary: "border-primary/30 bg-primary/5",
  };
  return (
    <div className={`rounded-xl border p-4 ${colorMap[color]}`}>
      <div className="flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
      </div>
      <p className="mt-2 text-2xl font-bold text-foreground md:text-3xl">
        {value}{suffix && <span className="ml-1 text-sm font-medium text-muted-foreground">{suffix}</span>}
      </p>
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
