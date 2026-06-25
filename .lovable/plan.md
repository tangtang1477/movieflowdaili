## 改动计划

### 1. 主题切换功能（默认暗色）

**新建 `src/components/ThemeToggle.tsx`**
- 圆形小按钮，使用 lucide-react 的 `Sun` / `Moon` icon
- 暗色模式显示 `Sun`（点击切到亮色），亮色模式显示 `Moon`（点击切到暗色）
- 通过给 `<html>` 元素加/移除 `.dark` class 切换主题
- 持久化到 `localStorage`（key: `theme`），默认值 `dark`
- 首次挂载时读取 localStorage 并应用

**在 `src/routes/__root.tsx`** 中加入初始化脚本：
- 在 `<head>` 注入一段同步 inline script，在页面渲染前根据 localStorage（默认 dark）给 `<html>` 加 `.dark` class，避免闪烁

**集成位置**
- `AuthLayout` 右上角（form panel 右上）放一个 `ThemeToggle`
- `console.tsx` 顶部导航栏右侧也放一个

### 2. 重新设计登录卡片左侧

修改 `src/components/AuthLayout.tsx` 左侧 panel，并扩展 props 以支持主副标题分行：

**Props 调整**
- 把 `tagline: string` 拆为：
  - `taglineMain: string`（主标题第一行）
  - `taglineSub: string`（主标题第二行，较小/低对比）
  - `subtitle: string`（副标题第一行）
  - `subtitleHint: string`（副标题第二行）

**视觉设计（保留 terracotta 暖色基调）**
- 背景沿用深棕渐变，新增右下角的柔光晕
- 顶部 Badge `Agent Portal` 维持原样
- 主标题区：
  - `分享创造价值` —— 大号 4xl/5xl 加粗白色
  - `连接创作者与未来` —— 3xl 半透明白 (text-white/70)，紧贴下方
- 中部分割线（细横线，宽 40px，warm gold）
- 副标题区（位于卡片中下部）：
  - `邀请好友加入 MovieFlow Studio` —— sm 字号 text-white/80
  - `注册即可获得收益` —— xs，warm gold 色（oklch 暖金）作为高亮点缀
- 左下角加一个微妙的装饰（小圆点矩阵或品牌字标 `MovieFlow`）

**`login.tsx`** 更新 AuthLayout 调用：
```tsx
taglineMain="分享创造价值"
taglineSub="连接创作者与未来"
subtitle="邀请好友加入 MovieFlow Studio"
subtitleHint="注册即可获得收益"
```

`register.tsx` 同步更新（保留品牌一致性，文案可微调成注册场景）。

### 涉及文件
- 新建 `src/components/ThemeToggle.tsx`
- 修改 `src/routes/__root.tsx`（注入初始主题脚本）
- 修改 `src/components/AuthLayout.tsx`（props + 左侧重设计 + 右上角放 ThemeToggle）
- 修改 `src/routes/login.tsx`（新 props）
- 修改 `src/routes/register.tsx`（新 props）
- 修改 `src/routes/console.tsx`（顶栏加 ThemeToggle）
