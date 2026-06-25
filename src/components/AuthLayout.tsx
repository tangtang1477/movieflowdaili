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
              "linear-gradient(165deg, oklch(0.23 0.03 280) 0%, oklch(0.12 0.018 280) 100%)",
          }}
        >
          {/* Decorative warm glow — softened */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 75% 90%, oklch(0.55 0.11 50 / 0.22), transparent 65%)",
            }}
          />
          {/* Soft gold orb — softened */}
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(circle, oklch(0.75 0.12 75 / 0.3), transparent 70%)",
            }}
          />

          {/* Top — brand anchor */}
          <div className="relative z-10">
            <p className="text-[11px] font-medium tracking-[0.3em] text-white/45 uppercase">
              MovieFlow Studio
            </p>
          </div>

          {/* Middle — main tagline (focal point) */}
          <div className="relative z-10 flex flex-col gap-3">
            <h1 className="text-5xl leading-[1.05] font-bold tracking-tight text-white lg:text-6xl">
              {taglineMain}
            </h1>
            <p className="text-lg leading-snug font-light text-white/55 lg:text-xl">
              {taglineSub}
            </p>
            <div
              className="mt-5 h-px w-12"
              style={{ background: "oklch(0.78 0.13 75 / 0.7)" }}
            />
          </div>

          {/* Bottom — subtitle */}
          <div className="relative z-10 flex flex-col gap-1.5">
            <p className="text-sm text-white/80">{subtitle}</p>
            <p
              className="text-xs font-medium tracking-wider"
              style={{ color: "oklch(0.82 0.13 75)" }}
            >
              {subtitleHint}
            </p>
          </div>
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
