import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";

interface AuthLayoutProps {
  children: React.ReactNode;
  taglineMain: string;
  taglineSub: string;
  subtitle: string;
  subtitleHint: string;
  formTitle: string;
  formTag: string;
  switchText: string;
  switchLinkText: string;
  switchTo: string;
}

export function AuthLayout({
  children,
  taglineMain,
  taglineSub,
  subtitle,
  subtitleHint,
  formTitle,
  formTag,
  switchText,
  switchLinkText,
  switchTo,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="flex w-full max-w-[960px] overflow-hidden rounded-2xl shadow-2xl">
        {/* Left panel */}
        <div
          className="relative hidden w-[45%] flex-col justify-between overflow-hidden p-10 md:flex"
          style={{ background: "var(--auth-panel-gradient)" }}
        >
          {/* Decorative glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "var(--auth-panel-glow)" }}
          />

          {/* Top — brand anchor */}
          <div className="relative z-10">
            <p
              className="text-[11px] font-medium tracking-[0.3em] uppercase"
              style={{ color: "var(--auth-panel-brand)" }}
            >
              MovieFlow Studio
            </p>
          </div>

          {/* Middle — unified content block */}
          <div className="relative z-10 flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <h1
                className="text-[34px] leading-[1.25] font-bold tracking-tight"
                style={{ color: "var(--auth-panel-text)" }}
              >
                {taglineMain}
              </h1>
              <h2
                className="text-[34px] leading-[1.25] font-bold tracking-tight"
                style={{ color: "var(--auth-panel-text)" }}
              >
                {taglineSub}
              </h2>
            </div>

            <div className="flex flex-col gap-2">
              <p
                className="text-[14px] leading-relaxed"
                style={{ color: "var(--auth-panel-text-muted)" }}
              >
                {subtitle}
              </p>
              <p
                className="text-[14px] leading-relaxed"
                style={{ color: "var(--auth-panel-text-muted)" }}
              >
                {subtitleHint}
              </p>
            </div>
          </div>

          {/* Bottom spacer */}
          <div className="relative z-10" />
        </div>

        {/* Right panel - form */}
        <div className="flex w-full flex-col bg-card p-8 md:w-[55%] md:p-10">
          <div className="mb-6 flex items-center justify-between">
            <span className="rounded-md border border-border px-3 py-1 text-xs font-semibold tracking-wider text-foreground uppercase">
              {formTag}
            </span>
            <div className="flex items-center gap-3">
              <Link
                to={switchTo}
                className="text-sm font-medium text-primary hover:underline"
              >
                {switchText}
                {switchLinkText}
              </Link>
              <ThemeToggle />
            </div>
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
