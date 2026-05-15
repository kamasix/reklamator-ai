import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CaseWizard } from "@/components/cases/CaseWizard";
import { DisclaimerBox } from "@/components/common/DisclaimerBox";

export function NewCasePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-1">
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link to="/dashboard">
              <ArrowLeft className="size-4" />
              Wróć do listy spraw
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Nowa sprawa</h1>
          <p className="text-sm text-muted-foreground">
            Odpowiedz na pytania – na ich podstawie wygenerujemy gotowe pismo i
            checklistę. Wszystko zostaje w Twojej przeglądarce.
          </p>
        </div>
      </div>
      <CaseWizard />
      <DisclaimerBox variant="compact" />
    </div>
  );
}
