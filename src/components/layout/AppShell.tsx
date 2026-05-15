import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Navbar } from "./Navbar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8">
          {children}
        </div>
      </main>
      <footer className="border-t border-border bg-muted/30">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1.5">
            <Heart className="size-3.5 text-primary" />
            <span>
              Reklamator AI – darmowe narzędzie open-source dla konsumentów.
            </span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Link to="/about" className="hover:text-foreground">
              O aplikacji
            </Link>
            <Link to="/settings" className="hover:text-foreground">
              Ustawienia
            </Link>
            <span>
              Aplikacja nie zastępuje porady prawnika.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
