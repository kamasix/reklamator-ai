import { Link } from "react-router-dom";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";

export function NotFoundPage() {
  return (
    <EmptyState
      icon={FileQuestion}
      title="Strona nie istnieje"
      description="Sprawdź adres lub wróć na stronę główną."
      action={
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="size-4" />
            Wróć na stronę główną
          </Link>
        </Button>
      }
    />
  );
}
