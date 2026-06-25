## 目标
1. 全站背景与卡片色重新对齐到 #0F0F1A（深紫黑）色系
2. 删除登录页左侧的 "Agent Portal" 徽章
3. 重新设计左侧文案的字号与排版层级

## 1. 色系调整（src/styles.css）

将暗色模式（`.dark`）的色值改为冷调深紫黑系，以 #0F0F1A 为基准：

- `--background`: oklch(0.16 0.018 280) ≈ #0F0F1A
- `--card`: oklch(0.21 0.022 280) — 卡片比背景略亮一档，保证层次
- `--popover`: 同 card
- `--secondary` / `--muted` / `--accent`: oklch(0.26 0.025 280)
- `--border`: oklch(1 0 0 / 8%)
- `--input`: oklch(1 0 0 / 12%)
- `--sidebar`: oklch(0.18 0.022 280)
- `--dark-brown`（左侧卡片基色）: oklch(0.18 0.025 280)
- 保留 terracotta/primary 作为暖橘色强调色，与冷背景形成对比

亮色模式保留现有暖砂色不动（用户只提到暗色卡片适配）。

## 2. AuthLayout 左侧重设计（src/components/AuthLayout.tsx）

**删除：**
- 顶部的 `Agent Portal` 徽章块（整个 `<span>`）
- 组件 `badge` prop 及其在调用方的传值

**新背景：** 改用与 #0F0F1A 协调的深紫黑渐变 + 内敛的暖色辉光

```
linear-gradient(165deg, oklch(0.23 0.03 280) 0%, oklch(0.12 0.018 280) 100%)
```

辉光保留橘色 radial-gradient，但降低饱和度让其更克制。

**新排版层级（解决"不协调"）：**

```text
┌─────────────────────────────┐
│  MOVIEFLOW STUDIO   ← 顶部细标 0.7rem tracking宽
│                              │
│                              │
│  分享创造价值        ← 主标 text-5xl/6xl bold leading-[1.05]
│  连接创作者与未来    ← 副标 text-lg/xl 浅色 font-light
│                              │
│  ──── (金色 12px 横线)       │
│                              │
│  邀请好友加入       ← subtitle text-sm 白80
│  MovieFlow Studio            │
│  注册即可获得收益   ← 金色 text-xs tracking宽
└─────────────────────────────┘
```

具体字号：
- 主标 `taglineMain`: `text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]`（之前 4xl/5xl）
- 副标 `taglineSub`: `text-lg lg:text-xl font-light text-white/55`（之前 2xl/3xl 与主标差距太小、显得堆叠）
- 金色分隔线：`h-px w-12`
- `subtitle`: `text-sm text-white/80`
- `subtitleHint`: `text-xs tracking-wider` 金色

视觉重心由"三段平均分布"调整为"上品牌锚点 → 中部主视觉聚焦 → 底部辅助信息"，让主标题成为唯一焦点。

## 3. 同步更新调用方

`AuthLayout` 移除 `badge` prop。修改 4 个调用文件，删除 `badge="..."` 行：
- `src/routes/login.tsx`
- `src/routes/register.tsx`
- `src/routes/forgot-password.tsx`
- `src/routes/verify-email.tsx`

## 涉及文件
- `src/styles.css`（暗色 token 重映射）
- `src/components/AuthLayout.tsx`（删徽章 + 左侧重排版 + 背景渐变）
- `src/routes/login.tsx` / `register.tsx` / `forgot-password.tsx` / `verify-email.tsx`（移除 badge prop）