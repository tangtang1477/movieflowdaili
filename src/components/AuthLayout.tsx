import { Link } from "@tanstack/react-router";

interface AuthLayoutProps {
  children: React.ReactNode;
  badge: string;
  tagline: string;
  formTitle: string;
  formTag: string;
  switchText: string;
  switchLinkText: string;
  switchTo: string;
}

export function AuthLayout({
  children,
  badge,
  tagline,
  formTitle,
  formTag,
  switchText,
  switchLinkText,
  switchTo,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="flex w-full max-w-[960px] overflow-hidden rounded-2xl shadow-2xl">
        {/* Left panel - dark with tagline */}
        <div className="relative hidden w-[45%] flex-col justify-end overflow-hidden p-10 md:flex"
          style={{
            background: "linear-gradient(160deg, oklch(0.35 0.05 40) 0%, oklch(0.18 0.03 30) 100%)",
          }}
        >
          {/* Decorative warm glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 60% 80%, oklch(0.45 0.1 45 / 0.3), transparent 70%)",
            }}
          />
          <div className="relative z-10">
            <span className="mb-6 inline-block rounded-md border border-white/20 px-3 py-1.5 text-xs font-medium tracking-widest text-white/80 uppercase">
              {badge}
            </span>
            <h1 className="mt-4 text-3xl leading-tight font-bold tracking-tight text-white lg:text-4xl">
              {tagline}
            </h1>
          </div>
        </div>

        {/* Right panel - form */}
        <div className="flex w-full flex-col bg-card p-8 md:w-[55%] md:p-10">
          <div className="mb-6 flex items-center justify-between">
            <span className="rounded-md border border-border px-3 py-1 text-xs font-semibold tracking-wider text-foreground uppercase">
              {formTag}
            </span>
            <Link
              to={switchTo}
              className="text-sm font-medium text-primary hover:underline"
            >
              {switchText}{switchLinkText}
            </Link>
          </div>

          <h2 className="mb-6 text-2xl font-bold text-foreground">
            {formTitle}
          </h2>

          {children}
        </div>
      </div>
    </div>
  );
}
