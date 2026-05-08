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

  // Generate invite code form state
  const [genQuantity, setGenQuantity] = useState(1);
  const [genUsageLimit, setGenUsageLimit] = useState(1);
  const [genCredits, setGenCredits] = useState(0);

  // Mock user data
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

  // Show commission dialog on first visit
  useEffect(() => {
    const timer = setTimeout(() => setShowCommissionDialog(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const totalQuota = inviteCodes.reduce((sum, c) => sum + c.credits * c.usageLimit, 0);
  const reservedQuota = inviteCodes.reduce((sum, c) => sum + c.credits * c.usageLimit, 0);
  const remainingQuota = 0;

  const mainCode = inviteCodes.length > 0 ? inviteCodes[0] : null;

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

  const handleLogout = () => {
    navigate({ to: "/login" });
  };

  const handleCopyLink = (code: string) => {
    const link = `https://aideo-test.movieflow.ai/login?invite_code=${code}`;
    navigator.clipboard.writeText(link);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-[960px]">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <span className="mb-2 inline-block rounded-md border border-border px-3 py-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Console
            </span>
            <h1 className="text-3xl font-bold text-foreground">代理商控制台</h1>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            style={{
              background: "linear-gradient(135deg, oklch(0.62 0.13 45), oklch(0.55 0.11 40))",
            }}
          >
            退出登录
          </button>
        </div>

        {/* Success banner */}
        {inviteCodes.length > 0 && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
            已生成 {inviteCodes.length} 个邀请码
          </div>
        )}

        {/* User & Agent Info */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-bold text-foreground">当前登录用户</h3>
            <InfoRow label="姓名" value={user.name} />
            <InfoRow label="邮箱" value={user.email} />
            <InfoRow label="代理商 ID" value={user.agentId} />
            <InfoRow label="状态" value={user.status} />
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-bold text-foreground">代理商资料</h3>
            <InfoRow label="企业名称" value={agent.company} />
            <InfoRow label="邀请码前缀" value={agent.invitePrefix} />
            <InfoRow label="联系人" value={agent.contact} />
            <InfoRow label="联系电话" value={agent.phone} />
            <InfoRow label="联系邮箱" value={agent.contactEmail} />
            <InfoRow label="结算日" value={agent.settlementDay} />
            <InfoRow label="返佣比例" value={agent.commissionRate} />
            <button className="mt-3 rounded-full border border-border px-4 py-1.5 text-sm text-foreground hover:bg-muted">
              联系我们
            </button>
          </div>
        </div>

        {/* Invite Quota */}
        <div className="mb-6 rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-bold text-foreground">邀请码额度</h3>
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="总额度" value={totalQuota} />
            <StatCard label="已预留" value={reservedQuota} />
            <StatCard label="剩余额度" value={remainingQuota} />
          </div>
        </div>

        {/* Main Invite Record */}
        {mainCode && (
          <div className="mb-6 rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-bold text-foreground">邀请记录</h3>
            <div className="rounded-lg bg-accent/50 p-5">
              <p className="mb-1 text-sm text-muted-foreground">主邀请码</p>
              <span className="mb-3 inline-block rounded-md border border-border bg-card px-3 py-1 text-sm font-mono font-bold text-foreground">
                {mainCode.code}
              </span>
              <p className="mt-2 text-sm text-muted-foreground">
                已注册客户数：{mainCode.usedCount}
              </p>
              <p className="mt-1 text-sm text-primary break-all">
                https://aideo-test.movieflow.ai/login?invite_code={mainCode.code}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleCopyLink(mainCode.code)}
                  className="rounded-full border border-border px-4 py-1.5 text-sm text-foreground hover:bg-muted"
                >
                  复制邀请链接
                </button>
                <button className="rounded-full border border-border px-4 py-1.5 text-sm text-foreground hover:bg-muted">
                  下载二维码
                </button>
              </div>
            </div>
          </div>
        )}

        {/* All Invite Records */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-bold text-foreground">全部邀请记录</h3>
          <button
            onClick={() => setShowGenerateDialog(true)}
            className="mb-4 rounded-full border border-primary px-4 py-1.5 text-sm font-medium text-primary hover:bg-primary/5"
          >
            生成邀请码
          </button>

          {inviteCodes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-2 pr-4">邀请码</th>
                    <th className="pb-2 pr-4">可用次数</th>
                    <th className="pb-2 pr-4">已使用</th>
                    <th className="pb-2 pr-4">预存积分</th>
                    <th className="pb-2">创建时间</th>
                  </tr>
                </thead>
                <tbody>
                  {inviteCodes.map((c) => (
                    <tr key={c.code} className="border-b border-border/50">
                      <td className="py-3 pr-4 font-mono font-medium">{c.code}</td>
                      <td className="py-3 pr-4">{c.usageLimit}</td>
                      <td className="py-3 pr-4">{c.usedCount}</td>
                      <td className="py-3 pr-4">{c.credits}</td>
                      <td className="py-3">{c.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">暂无邀请码，请点击上方按钮生成。</p>
          )}
        </div>
      </div>

      {/* Commission Dialog */}
      <Dialog open={showCommissionDialog} onOpenChange={setShowCommissionDialog}>
        <DialogContent className="max-w-md rounded-2xl border-border bg-card p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              返佣比例待设置
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 rounded-lg border border-red-100 bg-red-50/50 p-4 text-sm text-foreground">
            您可以立刻生成0预存额度的邀请码，如需提升额度，请联系我们
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button className="rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted">
              联系我们
            </button>
            <button
              onClick={() => {
                setShowCommissionDialog(false);
                setShowGenerateDialog(true);
              }}
              className="rounded-full px-6 py-2.5 text-sm font-semibold text-primary-foreground"
              style={{
                background: "linear-gradient(135deg, oklch(0.62 0.13 45), oklch(0.55 0.11 40))",
              }}
            >
              生成0预存邀请码
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Generate Invite Code Dialog */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent className="max-w-md rounded-2xl border-border bg-card p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              生成邀请码
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">生成数量</label>
              <input
                type="number"
                min={1}
                value={genQuantity}
                onChange={(e) => setGenQuantity(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">邀请码可用次数</label>
              <input
                type="number"
                min={1}
                value={genUsageLimit}
                onChange={(e) => setGenUsageLimit(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">注册预存积分</label>
              <input
                type="number"
                min={0}
                value={genCredits}
                onChange={(e) => setGenCredits(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-red-50/50 border border-red-100 p-4">
                <p className="text-xs text-muted-foreground">本次预留额度</p>
                <p className="mt-1 text-xl font-bold text-foreground">
                  {genCredits * genUsageLimit * genQuantity}
                </p>
              </div>
              <div className="rounded-lg bg-red-50/50 border border-red-100 p-4">
                <p className="text-xs text-muted-foreground">当前剩余额度</p>
                <p className="mt-1 text-xl font-bold text-foreground">0</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowGenerateDialog(false)}
                className="rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                取消
              </button>
              <button
                onClick={handleGenerate}
                className="rounded-full px-6 py-2.5 text-sm font-semibold text-primary-foreground"
                style={{
                  background: "linear-gradient(135deg, oklch(0.62 0.13 45), oklch(0.55 0.11 40))",
                }}
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}
