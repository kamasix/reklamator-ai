import { useCallback, useEffect, useState } from "react";
import { caseRepository } from "@/lib/storage/caseRepository";
import type { Case } from "@/types/case";

export function useCases() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await caseRepository.getCases();
      setCases(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Nie udało się wczytać spraw"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { cases, loading, error, refresh };
}
