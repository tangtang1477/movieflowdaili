## 1. 主题切换按钮：真实 glowing 光晕

当前用了两层均匀阴影，看起来像描边而不是光。改造：

- 去掉硬边 box-shadow，改用一层 `::before` 伪元素（或外层包裹 div）作为光晕层
- 光晕用 `radial-gradient(circle, rgba(229,234,146,0.55) 0%, rgba(229,234,146,0.25) 35%, rgba(229,234,146,0) 70%)`
- 光晕尺寸约 60×60px（按钮 36×36 的 1.7 倍），用 `filter: blur(8px)` 让边缘真正软化
- 按钮本体保留 #E5EA92 实色，无边框，光晕从中心向外自然衰减

由于按钮在 AuthLayout 顶部右侧，光晕会向外溢出 — 通过定位让光晕居中于按钮、`pointer-events-none`，不影响点击。

## 2. 亮色模式左侧面板重新设计

当前 AuthLayout 左侧用了硬编码的 `linear-gradient(165deg, oklch(0.22 0.028 285) → oklch(0.14 0.022 285))` — 暗色紫黑色，亮色模式下与白色右卡片冲突。

**方案：** 用 CSS 变量驱动，亮/暗色模式各一套渐变。

新增 token（`src/styles.css`）：

- `.dark` 下 `--auth-panel-gradient` 保持当前深紫黑
- `:root`（亮色）下 `--auth-panel-gradient` 改为柔和的浅紫/奶白渐变：
  - `linear-gradient(165deg, oklch(0.96 0.025 285) 0%, oklch(0.88 0.05 290) 100%)`
  - 即左上偏白、右下偏淡薰衣草紫
- `--auth-panel-glow`（装饰辉光）：
  - 暗色：`radial-gradient(ellipse at 80% 90%, oklch(0.55 0.18 290 / 0.22), transparent 60%)`（保持）
  - 亮色：`radial-gradient(ellipse at 80% 90%, oklch(0.70 0.18 290 / 0.22), transparent 65%)`（淡紫辉光，更柔）
- `--auth-panel-text` / `--auth-panel-text-muted` / `--auth-panel-brand`：
  - 暗色：`#fff`、`rgba(255,255,255,0.7)`、`rgba(255,255,255,0.45)`
  - 亮色：`oklch(0.25 0.04 285)`（深紫灰主标）、`oklch(0.40 0.03 285)`（次要灰紫）、`oklch(0.45 0.05 285)`（品牌字）

**AuthLayout.tsx 改造：**
- 把硬编码的 `style={{ background: ... }}` 改为 `style={{ background: "var(--auth-panel-gradient)" }}`
- 辉光层同样改成 `var(--auth-panel-glow)`
- 文字颜色从 `text-white` / `text-white/70` / `text-white/45` 改为 `style={{ color: "var(--auth-panel-text)" }}` 等，确保亮色模式下文字为深紫灰而非白色（在浅背景上保证可读）

## 涉及文件

- `src/components/ThemeToggle.tsx`：重做光晕（伪元素 + blur + 径向渐变）
- `src/styles.css`：新增 4 个 auth panel token，亮/暗两套
- `src/components/AuthLayout.tsx`：左侧背景/辉光/文字颜色改为 token 驱动
