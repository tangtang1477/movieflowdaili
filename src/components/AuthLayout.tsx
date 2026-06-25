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
          style={{
            background:
              "linear-gradient(165deg, oklch(0.18 0.022 280) 0%, oklch(0.10 0.015 280) 100%)",
          }}
        >
          {/* Decorative warm glow — softened */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 75% 95%, oklch(0.55 0.11 50 / 0.18), transparent 60%)",
            }}
          />

          {/* Top — brand anchor */}
          <div className="relative z-10">
            <p className="text-[11px] font-medium tracking-[0.3em] text-white/45 uppercase">
              MovieFlow Studio
            </p>
          </div>

          {/* Middle — unified content block */}
          <div className="relative z-10 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-[40px] leading-[1.15] font-bold tracking-tight text-white lg:text-[46px]">
                {taglineMain}
              </h1>
              <p className="text-[19px] leading-snug font-light text-white/65 lg:text-[21px]">
                {taglineSub}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[14px] leading-relaxed text-white/70">
                {subtitle}
              </p>
              <p
                className="text-[14px] font-medium tracking-wide"
                style={{ color: "oklch(0.82 0.13 75)" }}
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
