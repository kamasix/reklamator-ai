import { NavLink, Link } from "react-router-dom";
import { FileText, LayoutDashboard, Plus, Settings as SettingsIcon, Info, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { to: "/dashboard", label: "Sprawy", icon: LayoutDashboard },
  { to: "/cases/new", label: "Nowa sprawa", icon: Plus },
  { to: "/settings", label: "Ustawienia", icon: SettingsIcon },
  { to: "/about", label: "O aplikacji", icon: Info },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
        <Link to="/" className="group flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FileText className="size-4" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold tracking-tight">Reklamator AI</span>
            <span className="hidden text-[10px] uppercase tracking-wide text-muted-foreground sm:block">
              Darmowy generator reklamacji
            </span>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground",
                )
              }
            >
              <item.icon className="size-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="border-t border-border bg-muted/40">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="size-3.5 text-success" />
          <span>
            Działa lokalnie w przeglądarce. Bez konta. Bez płatności. Twoje dane
            nie są wysyłane na serwer.
          </span>
        </div>
      </div>
    </header>
  );
}
