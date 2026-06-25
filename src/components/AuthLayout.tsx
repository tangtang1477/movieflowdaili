import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";

interface AuthLayoutProps {
  children: React.ReactNode;
  badge: string;
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
  badge,
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
              "linear-gradient(160deg, oklch(0.38 0.06 40) 0%, oklch(0.16 0.025 30) 100%)",
          }}
        >
          {/* Decorative warm glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 70% 85%, oklch(0.55 0.13 50 / 0.35), transparent 65%)",
            }}
          />
          {/* Soft gold orb */}
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-40"
            style={{
              background:
                "radial-gradient(circle, oklch(0.75 0.12 75 / 0.4), transparent 70%)",
            }}
          />

          {/* Top — badge */}
          <div className="relative z-10">
            <span className="inline-block rounded-md border border-white/20 px-3 py-1.5 text-xs font-medium tracking-widest text-white/80 uppercase">
              {badge}
            </span>
          </div>

          {/* Middle — main tagline */}
          <div className="relative z-10 flex flex-col gap-3">
            <h1 className="text-4xl leading-tight font-bold tracking-tight text-white lg:text-5xl">
              {taglineMain}
            </h1>
            <p className="text-2xl leading-snug font-light text-white/70 lg:text-3xl">
              {taglineSub}
            </p>
            <div
              className="mt-4 h-px w-10"
              style={{ background: "oklch(0.78 0.13 75 / 0.7)" }}
            />
          </div>

          {/* Bottom — subtitle */}
          <div className="relative z-10 flex flex-col gap-1.5">
            <p className="text-sm font-medium text-white/85">{subtitle}</p>
            <p
              className="text-xs font-medium tracking-wide"
              style={{ color: "oklch(0.82 0.13 75)" }}
            >
              {subtitleHint}
            </p>
            <p className="mt-6 text-[11px] tracking-[0.3em] text-white/40 uppercase">
              MovieFlow Studio
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
