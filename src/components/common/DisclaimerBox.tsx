import { Scale } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type DisclaimerBoxProps = {
  variant?: "default" | "compact";
  className?: string;
};

export function DisclaimerBox({
  variant = "default",
  className,
}: DisclaimerBoxProps) {
  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex items-start gap-2 rounded-md border border-warning/40 bg-warning/10 p-3 text-xs text-foreground",
          className,
        )}
      >
        <Scale className="mt-0.5 size-4 shrink-0 text-warning-foreground" />
        <p>
          Reklamator AI nie zastępuje porady prawnika. Sprawdź dane przed
          wysłaniem pisma.
        </p>
      </div>
    );
  }
  return (
    <div
      className={cn(
        "rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <Scale className="mt-0.5 size-5 shrink-0 text-warning-foreground" />
        <div className="space-y-1">
          <div className="font-medium text-foreground">
            Informacja prawna
          </div>
          <p className="text-foreground/90 leading-relaxed">
            Aplikacja nie jest kancelarią prawną i nie zastępuje porady
            prawnika. Pomaga uporządkować informacje i przygotować pismo na
            podstawie danych wpisanych przez użytkownika. Przed wysłaniem
            sprawdź poprawność danych.
          </p>
        </div>
      </div>
    </div>
  );
}
