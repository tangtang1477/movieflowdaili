import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";

interface AuthLayoutProps {
  children: React.ReactNode;
  /** Legacy props — content now lives inside the hero background image. Kept optional for caller compatibility. */
  taglineMain?: string;
  taglineSub?: string;
  subtitle?: string;
  subtitleHint?: string;
  formTitle: string;
  formTag: string;
  switchText: string;
  switchLinkText: string;
  switchTo: string;
}

export function AuthLayout({
  children,
  formTitle,
  formTag,
  switchText,
  switchLinkText,
  switchTo,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="flex w-full max-w-[960px] overflow-hidden rounded-2xl shadow-2xl">
        {/* Left panel — full-bleed hero illustration (theme-aware via CSS variable) */}
        <div
          className="relative hidden w-[45%] overflow-hidden md:block"
          style={{
            backgroundImage: "var(--auth-panel-image)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          aria-hidden
        />

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
