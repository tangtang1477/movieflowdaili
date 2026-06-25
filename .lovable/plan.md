# 方案：登录页背景图 + 控制台暗色适配

## 一、登录页（AuthLayout）左侧面板改成背景图

把图1（紫色傍晚像素风）作为**暗色模式**左侧背景，图2（黄昏村庄像素风）作为**亮色模式**左侧背景。原本的渐变与文字标题不再需要——图片本身已包含 "Movieflow Studio / 分享创造价值 / 连接创作者与未来 / 邀请好友加入..." 全部宣传文案。

### 资源接入
- 把两张图通过 `lovable-assets` 上传为 CDN 资源，生成 `src/assets/auth-bg-dark.png.asset.json` 与 `src/assets/auth-bg-light.png.asset.json`。
- 不把图片拷进 git。

### AuthLayout 改造（`src/components/AuthLayout.tsx`）
- 左侧 `<div>` 改为：根据当前主题切换 `background-image`，`background-size: cover; background-position: center;`。
- 由于图片已含完整文案，**移除**左侧所有文字层（brand 小标、taglineMain、taglineSub、subtitle、subtitleHint）和装饰 glow 层；保留容器结构、圆角与阴影。
- `AuthLayoutProps` 中 `taglineMain / taglineSub / subtitle / subtitleHint` 不再使用——保留 props 签名兼容（标记为可选）即可，无需改 login/register/forgot-password 三个调用点。
- 主题判断：用 `document.documentElement.classList.contains('dark')` + `useEffect` 监听，或直接用 CSS 变量方案：在 `:root` / `.dark` 下分别定义 `--auth-panel-image: url(...)`，组件里 `background-image: var(--auth-panel-image)` 自动切换（更优，无 JS）。

### styles.css
- 删除（或保留为空）`--auth-panel-gradient / glow / text / text-muted / brand` 这几个不再使用的变量；新增 `--auth-panel-image` 在 `:root` 与 `.dark` 下分别指向亮/暗背景图 URL。

---

## 二、控制台（`/console`）整体暗色适配

控制台目前主体已经用语义 token（`bg-card`、`text-foreground` 等），但仍有少量硬编码颜色需要替换，并需要全面 review 一遍配色对比度。

### 已识别的硬编码点（`src/routes/console.tsx`）
1. **行 324**：微信支付按钮 `bg-white` → 改为 `bg-card` 或保留浅底但加 `dark:bg-card`。
2. **行 335**：支付宝按钮 `bg-white` → 同上。
3. **行 366**：二维码容器 `bg-white` → 二维码本身需要白底才能扫，保留 `bg-white` 但加内边距 + `dark:bg-white`（显式声明，避免误判）。SVG 内部的 `#fff/#111` 是二维码图形，保留不动。
4. **行 904**：`expired` 状态 chip `bg-gray-100 text-gray-600` → 改为 `bg-muted text-muted-foreground`。

### Recharts 图表暗色适配
图表硬编码了浅色坐标轴/网格。需要：
- `CartesianGrid stroke` 改用 `var(--border)`（通过 `hsl(var(--border))` 或直接读 CSS 变量）。
- `XAxis / YAxis` 的 `tick` 字色改为 `var(--muted-foreground)`。
- `Tooltip` 的 `contentStyle` 设为 `background: var(--popover); color: var(--popover-foreground); border: 1px solid var(--border)`。
- `PIE_COLORS` 暂保留（这些是图表数据色，亮暗通用 OK）。

### Dialog / 表格 / 侧边栏
- 通读 console.tsx 其余部分，把所有 `bg-white`、`bg-gray-*`、`text-gray-*`、`border-gray-*`、`text-black`、`#fff` 等都替换为对应 token：
  - 背景：`bg-card` / `bg-background` / `bg-muted`
  - 文本：`text-foreground` / `text-muted-foreground`
  - 边框：`border-border`
  - 主色：`text-primary` / `bg-primary`
- 验收标准：切到暗色模式后，控制台所有面板、对话框、表格、按钮、图表都能清晰可读，无白底大色块、无低对比文字。

### 主题入口
控制台目前没有 `ThemeToggle`（只在登录页有）。在控制台顶栏右上角加一个 `<ThemeToggle />`，方便登录后切换。

---

## 文件改动清单

```text
新增：
  src/assets/auth-bg-dark.png.asset.json     （lovable-assets 指针）
  src/assets/auth-bg-light.png.asset.json    （lovable-assets 指针）

修改：
  src/styles.css                  → 新增 --auth-panel-image，清理旧的 auth-panel-* 变量
  src/components/AuthLayout.tsx   → 左侧改为背景图，移除文字层
  src/routes/console.tsx          → 替换硬编码色、Recharts 暗色适配、加 ThemeToggle
```

## 不改动
- 亮色模式整体配色继续沿用现有版本，仅左侧面板换成图2。
- 登录/注册/忘记密码三个路由的调用方式不变。
- ThemeToggle 组件本身不动。

确认后我进入 build 模式执行。
